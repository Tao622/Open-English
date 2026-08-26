/**
 * js/app.js - 笑小英口语练习 网页版主应用 v2
 * 四板块架构：词汇积累 / 慢速听力 / 场景课程 / 生词本 + 首页今日任务
 * 背单词（不背单词式）：四选一 → 解释 → 穿插未掌握 → 最终复习 → 中译英朗读打分
 * 听力三步法：盲听 → 英文字幕 → 中英对照
 * 纯静态 H5 + hash 路由，零构建依赖
 */

(function () {
  'use strict';

  const app = document.getElementById('app');
  const $ = (sel, root) => (root || document).querySelector(sel);

  /* ============ 路由 ============ */
  const ROUTES = ['home', 'vocab', 'listening', 'courses', 'wordbook', 'practice', 'listen-play', 'profile', 'settings', 'checkin', 'ai'];
  let route = 'home';
  let routeArg = '';      // practice/listen-play 的 courseId/listenId
  let fromRoute = 'home';

  function parseHash() {
    const h = location.hash.replace(/^#\/?/, '');
    const parts = h.split('/');
    const r = parts[0] || 'home';
    if (ROUTES.includes(r)) {
      route = r;
      routeArg = parts[1] ? decodeURIComponent(parts[1]) : '';
    } else {
      route = 'home';
    }
  }

  function navigate(r, arg) {
    fromRoute = route;
    if (arg) location.hash = '#/' + r + '/' + encodeURIComponent(arg);
    else location.hash = '#/' + r;
  }

  function goBack() {
    if (fromRoute && ROUTES.includes(fromRoute)) navigate(fromRoute);
    else navigate('home');
  }

  window.addEventListener('hashchange', render);
  parseHash();

  /* ============ 页面级状态 ============ */
  const P = {
    auth: { mode: 'login', busy: false },
    practice: { recording: false, interim: '', result: null, finished: false, index: 0, mode: '', scoring: false },
    courses: { scene: 'all' },
    vocab: {
      phase: 'idle',        // idle | select | explain | translate | done
      day: 1, topic: '',
      newWords: [],         // 当天 20 个新词
      mainQueue: [], mainIndex: 0,   // 新词 + 穿插历史弱词的主队列
      reviewMode: false, reviewRound: 0, reviewQueue: [], reviewIndex: 0, // 最终复习
      weakToday: {},        // 当天选错的词 { en: true }
      currentWord: null,
      options: [], correctIndex: -1, isCorrect: false, correctText: '',
      explainWord: null,
      translateList: [], translateIndex: 0, translateResult: null, translatePassed: {},
      translateRec: { recording: false, scoring: false, interim: '', mode: '' }
    },
    listenPlay: { id: '', step: 1, index: 0, playing: false },
    ai: { messages: [], input: '', thinking: false },
    wordbook: { review: false, queue: [], index: 0, options: [], correctIndex: -1, selected: -1, isCorrect: false, correctCount: 0 },
    wordbookDraft: null
  };

  /* ============ 登录守卫 ============ */
  function isLoggedIn() {
    if (!Auth.ready()) return true;
    return !!Auth.user();
  }

  /* ============ 通用工具 ============ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 6) return '夜深了';
    if (h < 11) return '早上好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    return '晚上好';
  }

  function dateText() {
    const d = new Date();
    const w = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    return `${d.getMonth() + 1}月${d.getDate()}日 星期${w}`;
  }

  function toast(msg) {
    const old = $('.toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  function copyText(text, tip) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast(tip || '已复制')).catch(() => fallbackCopy(text, tip));
    } else {
      fallbackCopy(text, tip);
    }
  }
  function fallbackCopy(text, tip) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast(tip || '已复制'); } catch (e) { toast('复制失败，请手动复制'); }
    ta.remove();
  }

  /** 英文句子 → 单词 span（可轻点加生词本） */
  function wordify(text) {
    return String(text).split(/\s+/).map(w => {
      const clean = w.replace(/[.,!?;:'"()]/g, '');
      if (!clean) return esc(w);
      return `<span class="tap-word" data-word="${esc(clean)}">${esc(w)}</span>`;
    }).join(' ');
  }

  /** 单词加入生词本（词库查词义，查不到就用已有生词本条目） */
  function tapWord(en) {
    const key = String(en).toLowerCase();
    let found = Vocab.find(key);
    let word = null;
    if (found) {
      word = { en: found.en, cn: Vocab.cnShort(found), phonetic: found.ph || '' };
    } else if (typeof AI !== 'undefined' && AI.WORD_BANK) {
      const wb = AI.WORD_BANK.find(w => w.en.toLowerCase() === key);
      if (wb) word = { en: wb.en, cn: wb.cn, phonetic: wb.phonetic || '' };
    }
    if (!word) { toast(`没查到「${en}」的词义，问问小英老师吧`); return; }
    if (Store.addWord(word)) toast(`「${word.en}」已加入生词本 ✓`);
    else toast('这个词已经在生词本里啦');
  }

  /* ============ 渲染：外壳 ============ */
  const TAB_ROUTES = ['home', 'vocab', 'listening', 'courses', 'wordbook'];

  function render() {
    parseHash();

    if (!isLoggedIn()) {
      app.innerHTML = renderAuth();
      document.title = '登录 · 笑小英口语练习';
      return;
    }

    let html = '<div class="status-bar"></div>';
    html += renderUserBar();

    switch (route) {
      case 'home': html += renderHome(); break;
      case 'vocab': html += renderVocab(); break;
      case 'listening': html += renderListening(); break;
      case 'listen-play': html += renderListenPlay(); break;
      case 'courses': html += renderCourses(); break;
      case 'practice': html += renderPractice(); break;
      case 'wordbook': html += renderWordbook(); break;
      case 'profile': html += renderProfile(); break;
      case 'settings': html += renderSettings(); break;
      case 'checkin': html += renderCheckin(); break;
      case 'ai': html += renderAI(); break;
      default: html += renderHome();
    }

    if (TAB_ROUTES.includes(route)) {
      html += renderTabBar();
      html += '<button class="ai-fab" data-action="go-ai" aria-label="问小英老师">AI</button>';
    }

    app.innerHTML = html;
    document.title = pageTitle();
    window.scrollTo(0, 0);
  }

  function pageTitle() {
    const titles = { home: '今日任务 · 笑小英', vocab: '词汇积累', listening: '慢速听力', courses: '场景课程', wordbook: '生词本', practice: '跟读练习', 'listen-play': '慢速听力', profile: '我的', settings: '设置', checkin: '打卡', ai: '小英老师' };
    return titles[route] || '笑小英口语练习';
  }

  function renderTabBar() {
    const active = TAB_ROUTES.includes(route) ? route : 'home';
    return `<nav class="tab-bar">${TABS.map(t => `
      <button class="tab-item ${active === t.id ? 'active' : ''}" data-action="nav" data-arg="${t.id}">
        <span class="tab-icon">${t.icon}</span>
        <span>${t.label}</span>
      </button>`).join('')}</nav>`;
  }

  function renderUserBar() {
    if (!Auth.ready()) return '';
    return `
      <div class="user-bar">
        <span class="user-bar-name" data-action="nav" data-arg="profile">👤 ${esc(Auth.username())}</span>
        <button class="user-bar-logout" data-action="logout">退出登录</button>
      </div>`;
  }

  /* ============ 登录 / 注册 ============ */
  function renderAuth() {
    const m = P.auth.mode;
    const isLogin = m === 'login';
    const single = !Auth.ready();
    return `
    <div class="auth-screen">
      <div class="auth-card">
        <div class="auth-brand">
          <img src="icon.png" alt="笑小英" class="auth-logo">
          <div class="auth-name">笑小英口语练习</div>
          <div class="auth-slogan">为敢开口的你而做</div>
        </div>

        ${single ? `
          <div class="auth-tip">
            尚未配置登录服务（见 README「用户注册登录」）。
            <br>配置前将以单机模式使用，不保存账号。
          </div>` : ''}

        <div class="auth-tabs">
          <button class="auth-tab ${isLogin ? 'active' : ''}" data-action="auth-mode" data-arg="login">登录</button>
          <button class="auth-tab ${!isLogin ? 'active' : ''}" data-action="auth-mode" data-arg="register">注册</button>
        </div>

        <input id="auth-username" class="auth-input" type="text" placeholder="用户名" autocomplete="username">
        <input id="auth-password" class="auth-input" type="password" placeholder="密码（至少 6 位）" autocomplete="${isLogin ? 'current-password' : 'new-password'}">
        <button id="auth-submit-btn" class="btn-primary auth-submit" data-action="auth-submit">${isLogin ? '登 录' : '注 册'}</button>
        <div id="auth-msg" class="auth-msg"></div>
      </div>
    </div>`;
  }

  async function authSubmit() {
    const u = $('#auth-username');
    const p = $('#auth-password');
    const msg = $('#auth-msg');
    const btn = $('#auth-submit-btn');
    const user = u ? u.value.trim() : '';
    const pass = p ? p.value : '';
    if (!user || !pass) { if (msg) msg.textContent = '请先填上用户名和密码'; return; }
    if (P.auth.mode === 'register' && pass.length < 6) { if (msg) msg.textContent = '密码至少要 6 位'; return; }
    P.auth.busy = true;
    if (btn) btn.disabled = true;
    if (msg) msg.textContent = '请稍等…';
    const res = P.auth.mode === 'register' ? await Auth.register(user, pass) : await Auth.login(user, pass);
    P.auth.busy = false;
    if (btn) btn.disabled = false;
    if (res.error) {
      if (msg) msg.textContent = res.error;
      return;
    }
    if (P.auth.mode === 'register' && !Auth.user()) {
      if (msg) msg.textContent = '注册成功！按提示完成验证后就能登录了。';
    }
  }

  /* ============ 首页：今日任务汇总 ============ */
  function renderHome() {
    const s = Store.state.settings;
    const v = Store.state.vocab;
    const day = Math.min(30, v.day || 1);
    const goal = s.todayGoal;
    const todayCount = Store.vocabCountToday();
    const doneToday = Store.vocabDoneToday();
    const courseDone = Store.courseDoneToday();
    const wordPct = Math.min(100, Math.round((doneToday ? goal : todayCount) / goal * 100));
    const daily = CONTENT.getDailySentence();
    const weekDone = Store.weekDays().filter(d => d.done).length;

    return `
    <div class="view active">
      <div class="home-header">
        <div>
          <div class="home-greeting">${greeting()}，${esc(s.userName)}</div>
          <div class="home-date">${dateText()} · 连续打卡 ${Store.state.streak} 天 · 本周 ${weekDone}/7</div>
        </div>
        <div class="home-avatar" data-action="nav" data-arg="profile">${esc(s.userName.charAt(0))}</div>
      </div>

      <div class="task-card">
        <div class="task-card-head">
          <span class="task-badge">今日任务</span>
          <span style="font-size:13px;opacity:.9">${doneToday ? '单词已完成 ✓' : '还差一点点'}</span>
        </div>

        <div class="task-row">
          <div class="task-row-title">📖 场景课程 <span class="task-row-sub">（至少 1 节）</span></div>
          <div class="task-progress">
            <div class="progress-track"><div class="progress-fill" style="width:${courseDone ? 100 : 0}%"></div></div>
            <div class="task-progress-nums"><span>${courseDone ? '已完成 ✓' : '还没开始'}</span><span>${courseDone ? '1/1' : '0/1'}</span></div>
          </div>
        </div>

        <div class="task-row">
          <div class="task-row-title">📚 背单词 <span class="task-row-sub">（每天 ${goal} 个）</span></div>
          <div class="task-progress">
            <div class="progress-track"><div class="progress-fill" style="width:${wordPct}%"></div></div>
            <div class="task-progress-nums"><span>${doneToday ? '已完成 ✓' : `已学 ${todayCount} 个`}</span><span>${doneToday ? goal + '/' + goal : Math.min(todayCount, goal) + '/' + goal}</span></div>
          </div>
        </div>

        <button class="task-btn" data-action="go-today-task">${courseDone && doneToday ? '全部完成，去看看 ›' : '继续学习 →'}</button>
      </div>

      <div class="entry-grid">
        <button class="entry-item" data-action="go-vocab-today">
          <span class="entry-icon">词</span>
          <span><span class="entry-title">第${day}天词汇</span><br><span class="entry-desc">${Vocab.getDay(day) ? Vocab.getDay(day).topic : ''}</span></span>
        </button>
        <button class="entry-item" data-action="nav" data-arg="listening">
          <span class="entry-icon orange">听</span>
          <span><span class="entry-title">慢速听力</span><br><span class="entry-desc">30 段对话磨耳朵</span></span>
        </button>
        <button class="entry-item" data-action="nav" data-arg="courses">
          <span class="entry-icon blue">课</span>
          <span><span class="entry-title">场景课程</span><br><span class="entry-desc">30 节 · 餐厅酒店交通</span></span>
        </button>
        <button class="entry-item" data-action="nav" data-arg="wordbook">
          <span class="entry-icon">词</span>
          <span><span class="entry-title">我的生词本</span><br><span class="entry-desc">${Store.state.wordbook.length} 个词</span></span>
        </button>
      </div>

      <div class="daily-card">
        <div class="daily-label">每日一句</div>
        <div class="daily-en">${esc(daily.en)}</div>
        <div class="daily-cn">${esc(daily.cn)}</div>
        <button class="daily-play" data-action="play-daily">▶ 听一听</button>
      </div>
    </div>`;
  }

  /* ============ 词汇积累 ============ */
  function renderVocab() {
    const v = P.vocab;
    if (v.phase === 'select') return renderVocabSelect();
    if (v.phase === 'explain') return renderVocabExplain();
    if (v.phase === 'translate') return renderVocabTranslate();
    if (v.phase === 'done') return renderVocabDone();
    return renderVocabHome();
  }

  /** 词汇首页：今日任务 + 30 天日历 */
  function renderVocabHome() {
    const v = Store.state.vocab;
    const day = Math.min(30, v.day || 1);
    const dayData = Vocab.getDay(day);
    const goal = Store.state.settings.todayGoal;
    const doneToday = Store.vocabDoneToday();
    const todayCount = Store.vocabCountToday();
    const pct = Math.min(100, Math.round((doneToday ? goal : todayCount) / goal * 100));

    const grid = Vocab.days().map(d => {
      const dd = Vocab.getDay(d);
      const learnedCount = Object.keys(v.learned[d] || {}).length;
      const done = learnedCount >= dd.words.length;
      const cls = done ? 'done' : (d === day ? 'today' : '');
      return `<div class="cal-cell ${cls}" data-action="vocab-cal" data-arg="${d}">${d}</div>`;
    }).join('');

    return `
    <div class="view active">
      <div style="padding-top:12px;display:flex;align-items:baseline;justify-content:space-between">
        <span class="page-title">词汇积累</span>
        <span style="font-size:13px;color:var(--c-text-light)">第 ${day}/30 天</span>
      </div>

      <div class="vocab-today-card">
        <div class="vocab-today-topic">${dayData ? '第' + day + '天 · ' + dayData.topic : '30 天全部学完啦'}</div>
        ${dayData ? `
          <div class="vocab-today-meta">${dayData.words.length} 个词 · 四级词汇精选，偏向旅行日常</div>
          <div class="task-progress" style="margin-top:10px">
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="task-progress-nums"><span>${doneToday ? '今天已完成 ✓' : `已学 ${todayCount} 个`}</span><span>${pct}%</span></div>
          </div>
          <button class="btn-primary vocab-start-btn" data-action="vocab-start">
            ${doneToday ? '明天再来 ›' : (todayCount > 0 ? '继续学习 →' : '开始今天的单词 →')}
          </button>
        ` : `
          <div class="vocab-today-meta">600 个词全部学完，去生词本复习吧！</div>
          <button class="btn-primary vocab-start-btn" data-action="nav" data-arg="wordbook">去复习生词本 →</button>
        `}
      </div>

      <div class="vocab-cal-title">30 天学习日历</div>
      <div class="vocab-calendar">
        ${grid}
      </div>
      <div class="vocab-cal-legend"><span class="dot done"></span> 已学完 <span class="dot today"></span> 今天 <span class="dot"></span> 未开始</div>
    </div>`;
  }

  /** 四选一 */
  function renderVocabSelect() {
    const v = P.vocab;
    const w = v.currentWord;
    if (!w) return '<div class="view active"><div class="empty-tip">没有更多单词了</div></div>';
    const doneCount = v.mainIndex;
    const total = v.newWords.length;
    return `
    <div class="view active">
      <div class="practice-top">
        <div class="back-row">
          <button class="back-btn" data-action="vocab-quit">✕</button>
          <span class="practice-course-title">第${v.day}天 · ${esc(v.topic)}</span>
          <span class="practice-progress-dots">${doneCount}/${total}</span>
        </div>
      </div>
      <div class="vocab-stage">
        <div class="vocab-en">${esc(w.en)}</div>
        <div class="vocab-hint">${v.reviewMode ? '复习：选出正确的中文意思' : '选出正确的中文意思'}</div>
        <div class="vocab-options">
          ${v.options.map((opt, i) => `
            <button class="vocab-opt" data-action="vocab-answer" data-arg="${i}">
              <span class="vocab-opt-key">${'ABCD'[i]}</span>
              <span class="vocab-opt-text">${esc(opt)}</span>
            </button>`).join('')}
        </div>
        <div style="text-align:center;color:var(--c-text-light);font-size:13px;margin-top:16px">点「🔊」先听听怎么读？</div>
        <div style="text-align:center;margin-top:8px">
          <button class="ctrl-play small" data-action="vocab-listen">🔊</button>
        </div>
      </div>
    </div>`;
  }

  function renderVocabExplain() {
    const v = P.vocab;
    const w = v.explainWord || v.currentWord;
    if (!w) return '<div class="view active"><div class="empty-tip">没有更多单词了</div></div>';
    const total = v.newWords.length;
    return `
    <div class="view active">
      <div class="practice-top">
        <div class="back-row">
          <button class="back-btn" data-action="vocab-quit">✕</button>
          <span class="practice-course-title">第${v.day}天 · 单词解释</span>
          <span class="practice-progress-dots">${Math.min(v.mainIndex, total)}/${total}</span>
        </div>
      </div>
      <div class="explain-verdict ${v.isCorrect ? 'ok' : 'bad'}">
        ${v.isCorrect ? '✓ 选对了，太棒了！' : '✗ 正确答案是「' + esc(v.correctText) + '」，记住它！'}
      </div>
      <div class="explain-card">
        <div class="explain-en">${esc(w.en)} <span class="explain-ph">${esc(w.ph || '')}</span></div>
        <div class="explain-defs">${w.defs.map(d => `<div class="explain-def"><span class="explain-p">${esc(d.p)}</span>${esc(d.c)}</div>`).join('')}</div>
        <div class="explain-divider"></div>
        <div class="explain-ex">${esc(w.ex)}</div>
        <div class="explain-ec">${esc(w.ec)}</div>
      </div>
      <div class="action-row">
        <button class="btn-primary" data-action="vocab-next">${v.mainIndex >= v.newWords.length && Object.keys(v.weakToday).length === 0 ? '开始中译英 →' : '下一个 →'}</button>
        <button class="ai-mini-btn" data-action="vocab-add-word">＋ 生词本</button>
      </div>
    </div>`;
  }

  /** 中译英：看中文 → 听英文 → 说英文打分 */
  function renderVocabTranslate() {
    const v = P.vocab;
    const total = v.translateList.length;
    if (v.translateIndex >= total) return renderVocabDone();
    const w = v.translateList[v.translateIndex];
    const tr = v.translateRec;
    const passed = !!v.translatePassed[w.en];
    const r = v.translateResult;

    let body = '';
    if (tr.recording) {
      body = `
        <div class="rec-wave"><span></span><span></span><span></span><span></span><span></span></div>
        <div class="rec-hint">正在听你说，大声读出来～</div>
        ${tr.mode === 'sr' && tr.interim ? `<div class="tr-interim">${esc(tr.interim)}</div>` : ''}
        <div style="margin-top:22px" class="action-row">
          <button class="btn-primary" data-action="translate-say">说完了</button>
        </div>`;
    } else if (tr.scoring) {
      body = `
        <div class="rec-wave"><span></span><span></span><span></span><span></span><span></span></div>
        <div class="rec-hint">小英老师评分中，稍等一下～</div>`;
    } else if (r) {
      const stars = '★'.repeat(r.stars) + '<span class="empty">' + '★'.repeat(Math.max(0, 3 - r.stars)) + '</span>';
      body = `
        <div class="score-card">
          <div class="score-stars">${stars}</div>
          <div class="score-text">${esc(r.text)}</div>
          <div class="score-detail">${esc(r.detail)}</div>
        </div>
        <div class="action-row">
          ${passed ? `<button class="btn-primary" data-action="translate-next">下一个 →</button>` : `
            <button class="btn-primary" data-action="translate-say">再试一次</button>
            <button class="btn-ghost" data-action="translate-next">跳过这个</button>`}
        </div>`;
    } else {
      body = `
        <div class="audio-row">
          <button class="ctrl-play small" data-action="translate-listen">🔊 听发音</button>
        </div>
        <div class="speak-area"><button class="speak-btn" data-action="translate-say">说</button></div>
        <div style="text-align:center;color:var(--c-text-light);font-size:13px;margin-top:14px">看着中文，说出对应的英文单词</div>`;
    }

    return `
    <div class="view active">
      <div class="practice-top">
        <div class="back-row">
          <button class="back-btn" data-action="vocab-quit">✕</button>
          <span class="practice-course-title">中译英 · 第${v.day}天</span>
          <span class="practice-progress-dots">${v.translateIndex + 1}/${total}</span>
        </div>
      </div>
      <div class="vocab-stage">
        <div class="translate-cn">${esc(Vocab.cnShort(w))}</div>
        <div class="vocab-hint">说出它的英文（${esc(w.ph || '')}）</div>
        ${body}
      </div>
    </div>`;
  }

  function renderVocabDone() {
    const v = P.vocab;
    const newCount = v.newWords.length;
    const passedCount = Object.keys(v.translatePassed).length;
    const weakLeft = Object.keys(Store.state.vocab.weak).length;
    return `
    <div class="view active">
      <div class="checkin-page">
        <div class="checkin-badge">✓</div>
        <div class="checkin-title">今天的单词学完啦！</div>
        <div class="checkin-sub">第${v.day}天 ${newCount} 个新词，中译英通过 ${passedCount} 个</div>
        <div class="checkin-stats">
          <div class="stat-card"><div class="stat-num">${newCount}</div><div class="stat-label">新词</div></div>
          <div class="stat-card"><div class="stat-num">${passedCount}</div><div class="stat-label">会说</div></div>
          <div class="stat-card"><div class="stat-num">${weakLeft}</div><div class="stat-label">待复习</div></div>
        </div>
        <div class="checkin-btns">
          <button class="btn-primary" data-action="vocab-home">回到词汇页</button>
          <button class="btn-ghost" data-action="nav" data-arg="home">回首页</button>
        </div>
      </div>
    </div>`;
  }

  /* ---- 词汇流程控制 ---- */

  /** 开始当天学习 */
  function startVocab() {
    const v = Store.state.vocab;
    const day = Math.min(30, v.day || 1);
    const dayData = Vocab.getDay(day);
    const doneToday = Store.vocabDoneToday();
    if (doneToday) { toast('今天的单词已经学完啦，明天再来！'); return; }
    if (!dayData) { toast('30 天内容都学完啦，去生词本复习吧'); navigate('wordbook'); return; }

    const learnedSet = v.learned[day] || {};
    const newWords = dayData.words.filter(w => !learnedSet[w.en]);
    if (newWords.length === 0) {
      // 新词都学过（异常恢复）→ 直接进入中译英
      P.vocab.phase = 'translate';
      P.vocab.day = day; P.vocab.topic = dayData.topic;
      P.vocab.newWords = dayData.words;
      P.vocab.translateList = dayData.words.slice();
      P.vocab.translateIndex = 0;
      P.vocab.translatePassed = {};
      P.vocab.translateResult = null;
      render();
      TTS.speak(P.vocab.translateList[0].en, { rate: 0.7 });
      return;
    }

    // 历史遗留弱词（其他天的未掌握词，穿插复习）
    const legacyWeak = Object.keys(v.weak)
      .map(en => Vocab.find(en))
      .filter(w => w && w.day !== day);

    const pv = {
      phase: 'select', day, topic: dayData.topic,
      newWords, mainQueue: [], mainIndex: 0,
      reviewMode: false, reviewRound: 0, reviewQueue: [], reviewIndex: 0,
      weakToday: {},
      currentWord: null, options: [], correctIndex: -1, isCorrect: false, correctText: '',
      explainWord: null,
      translateList: [], translateIndex: 0, translateResult: null, translatePassed: {},
      translateRec: { recording: false, scoring: false, interim: '', mode: '' }
    };
    // 主队列：每 3 个新词穿插 1 个历史弱词
    const news = newWords.slice();
    const weaks = legacyWeak.slice();
    while (news.length || weaks.length) {
      for (let i = 0; i < 3 && news.length; i++) pv.mainQueue.push(news.shift());
      if (weaks.length) pv.mainQueue.push(weaks.shift());
    }
    P.vocab = pv;
    showNextVocabWord();
  }

  /** 取下一个词（主队列 → 最终复习队列 → 中译英） */
  function showNextVocabWord() {
    const v = P.vocab;
    let next = null;

    if (!v.reviewMode) {
      if (v.mainIndex < v.mainQueue.length) {
        next = { word: v.mainQueue[v.mainIndex], reviewMode: false };
      } else {
        const weakList = Object.keys(v.weakToday);
        if (weakList.length) {
          v.reviewMode = true;
          v.reviewRound = 0;
          v.reviewQueue = Vocab.shuffle(weakList);
          v.reviewIndex = 0;
        }
      }
    }
    if (v.reviewMode && !next) {
      if (v.reviewIndex < v.reviewQueue.length) {
        next = { word: Vocab.find(v.reviewQueue[v.reviewIndex]), reviewMode: true };
      } else {
        const remain = Object.keys(v.weakToday);
        if (remain.length && v.reviewRound < 2) {
          v.reviewRound++;
          v.reviewQueue = Vocab.shuffle(remain);
          v.reviewIndex = 0;
          return showNextVocabWord();
        }
      }
    }

    if (!next) { startTranslate(); return; }

    const w = next.word;
    if (!w) { v.mainIndex++; v.reviewIndex++; return showNextVocabWord(); }

    v.currentWord = w;
    v.reviewMode = next.reviewMode;
    const q = Vocab.makeOptions(w, w.day || v.day);
    v.options = q.options;
    v.correctIndex = q.correctIndex;
    v.isCorrect = false;
    v.phase = 'select';
    v.mainIndex++;
    v.reviewIndex++;
    render();
  }

  /** 用户选择选项 */
  function answerVocab(i) {
    const v = P.vocab;
    const w = v.currentWord;
    if (!w || v.phase !== 'select') return;
    const ok = i === v.correctIndex;
    v.isCorrect = ok;
    v.correctText = v.options[v.correctIndex];
    v.phase = 'explain';
    v.explainWord = w;

    const V = Store.state.vocab;
    const en = w.en;
    if (ok) {
      V.mastered[en] = true;
      delete V.weak[en];
      delete v.weakToday[en];
      Store.bumpVocabCount(); // 学过 1 个新词（含复习通过的）
    } else {
      V.weak[en] = true;
      if (!v.reviewMode) v.weakToday[en] = true;
      // 复习阶段选错：保留在 weak（下一轮再考）
    }
    Store.save();
    render();
  }

  function nextVocabStep() {
    const v = P.vocab;
    v.phase = 'select';
    v.explainWord = null;
    showNextVocabWord();
  }

  function quitVocab() {
    P.vocab.phase = 'idle';
    goBack();
  }

  /** 进入中译英 */
  function startTranslate() {
    const v = P.vocab;
    // 中译英词表 = 今天所有新词（含未掌握的）
    v.translateList = v.newWords.slice();
    v.translateIndex = 0;
    v.translatePassed = {};
    v.translateResult = null;
    v.translateRec = { recording: false, scoring: false, interim: '', mode: '' };
    v.phase = 'translate';
    render();
    if (v.translateList.length) TTS.speak(v.translateList[0].en, { rate: 0.7 });
  }

  function translateListen() {
    const v = P.vocab;
    const w = v.translateList[v.translateIndex];
    if (!w) return;
    TTS.speak(w.en, { rate: 0.7 });
  }

  function translateSay() {
    const v = P.vocab;
    const w = v.translateList[v.translateIndex];
    const tr = v.translateRec;
    if (!w) return;
    TTS.stop();

    if (tr.recording) {
      if (tr.mode === 'wav') {
        tr.recording = false;
        tr.scoring = true;
        render();
        Scorer.WavRecorder.stop()
          .then(rec => Scorer.proxyScore({ en: w.en }, rec.wavBase64, Store.state.settings.scoreProxyUrl))
          .then(result => {
            tr.scoring = false;
            v.translateResult = result;
            if (result.score >= 60) v.translatePassed[w.en] = true;
            render();
          })
          .catch(err => {
            tr.scoring = false;
            v.translateResult = null;
            render();
            toast(err.message || '打分失败，请再试一次');
          });
        return;
      }
      Scorer.Recognizer.stop();
      tr.recording = false;
      const text = tr.interim || '';
      const result = Scorer.matchScore(text, { en: w.en, keywords: [w.en] });
      v.translateResult = result;
      tr.interim = '';
      if (result.score >= 60) v.translatePassed[w.en] = true;
      render();
      return;
    }

    const proxyUrl = (Store.state.settings.scoreProxyUrl || '').trim();
    if (proxyUrl) {
      if (!Scorer.WavRecorder.supported) { toast('当前浏览器不支持录音，请用 Safari 或 Chrome'); return; }
      tr.mode = 'wav';
      tr.interim = '';
      tr.recording = true;
      tr.scoring = false;
      v.translateResult = null;
      render();
      Scorer.WavRecorder.start().catch(() => {
        tr.recording = false;
        render();
        toast('无法使用麦克风，请到手机设置允许权限');
      });
      return;
    }

    if (!Scorer.supported) {
      toast('iPhone 上打分需要先在「我的-设置」里填打分服务地址');
      return;
    }
    tr.mode = 'sr';
    tr.interim = '';
    tr.recording = true;
    v.translateResult = null;
    render();
    Scorer.startPractice({
      onResult(r) {
        tr.interim = r.interim || r.final;
        const el = $('.tr-interim');
        if (el) el.textContent = tr.interim;
      },
      onDone(finalText) {
        if (!tr.recording) return;
        tr.recording = false;
        const text = finalText || tr.interim || '';
        const result = Scorer.matchScore(text, { en: w.en, keywords: [w.en] });
        v.translateResult = result;
        tr.interim = '';
        if (result.score >= 60) v.translatePassed[w.en] = true;
        render();
      },
      onError(err) {
        tr.recording = false;
        tr.interim = '';
        render();
        if (err === 'not-allowed') toast('无法使用麦克风，请检查浏览器权限');
        else if (err === 'no-speech') toast('没有听到声音，靠近麦克风再试一次');
        else toast('录音出错了，请再试一次');
      }
    });
  }

  function translateNext() {
    const v = P.vocab;
    v.translateResult = null;
    v.translateRec = { recording: false, scoring: false, interim: '', mode: '' };
    v.translateIndex++;
    if (v.translateIndex >= v.translateList.length) {
      finishVocab();
      return;
    }
    render();
    const w = v.translateList[v.translateIndex];
    if (w) TTS.speak(w.en, { rate: 0.7 });
  }

  /** 全部完成：记录进度、推进天数、判断打卡 */
  function finishVocab() {
    const v = Store.state.vocab;
    const today = Store.todayString();
    const day = P.vocab.day;
    v.learned[day] = v.learned[day] || {};
    P.vocab.newWords.forEach(w => { v.learned[day][w.en] = true; });
    v.done[today] = { day, newCount: P.vocab.newWords.length, weakCount: Object.keys(v.weak).length };
    if (day < 30) v.day = day + 1;
    Store.save();
    P.vocab.phase = 'done';
    render();
    if (Store.courseDoneToday()) {
      Store.checkin();
      setTimeout(() => navigate('checkin'), 1200);
    } else {
      toast('单词任务完成 ✓ 今天再学 1 节场景课程就能打卡啦');
    }
  }

  /* ============ 慢速听力 ============ */
  function renderListening() {
    const list = CONTENT.getListeningList();
    const cards = list.map(l => {
      const done = Store.listeningDone(l.id);
      return `
      <button class="listen-card" data-action="open-listen" data-arg="${l.id}">
        <span class="course-icon">${l.icon}</span>
        <span class="course-info">
          <span class="course-title">${l.day}. ${esc(l.title)} ${done ? '<span class="listen-done-tag">已听</span>' : ''}</span><br>
          <span class="course-meta">${l.sentenceCount} 句 · 约 ${l.wordCount} 词 · ${l.duration}</span>
        </span>
        <span class="course-arrow">›</span>
      </button>`;
    }).join('');

    return `
    <div class="view active">
      <div style="padding-top:12px"><span class="page-title">慢速听力</span></div>
      <div class="listen-intro">30 段真实对话 · 三步法：先盲听，再看英文，最后中英对照。听不懂就放慢、反复听。</div>
      <div class="course-list">${cards}</div>
    </div>`;
  }

  function renderListenPlay() {
    // 深链/刷新恢复：优先使用路由参数里的 id（点卡片进入时由 openListenPlay 同步设置）
    const want = routeArg || P.listenPlay.id;
    if (want && P.listenPlay.id !== want) {
      P.listenPlay = { id: want, step: P.listenPlay.step || 1, index: 0, playing: false };
    }
    const p = P.listenPlay;
    const dlg = CONTENT.getListening(p.id);
    if (!dlg) return '<div class="view active"><div class="empty-tip">内容不存在</div></div>';
    const total = dlg.dialogue.length;

    const steps = [
      { n: 1, label: '① 盲听' },
      { n: 2, label: '② 英文字幕' },
      { n: 3, label: '③ 中英对照' }
    ];

    let body = '';
    if (p.step === 1) {
      body = `
        <div class="listen-blind">
          <div class="listen-blind-title">👂 第一遍 · 盲听</div>
          <div class="listen-tip">先不看字幕，整体听一遍，抓住大意就行</div>
          <div class="audio-row">
            <button class="play-circle" data-action="listen-full">${p.playing ? '⏸' : '▶'}</button>
          </div>
          ${p.playing ? '<div class="rec-hint" style="margin-top:10px">正在播放，点暂停可停…</div>' : ''}
        </div>`;
    } else if (p.step === 2) {
      body = `
        <div class="listen-tip">第二遍 · 看英文字幕跟听，听不懂的句子点一下重听</div>
        <div class="listen-lines">
          ${dlg.dialogue.map((s, i) => `
            <div class="listen-line ${i === p.index ? 'active' : ''}" data-action="listen-line" data-arg="${i}">
              <span class="line-no">${i + 1}</span>
              <span class="line-en">${wordify(s.en)}</span>
            </div>`).join('')}
        </div>
        <div class="action-row">
          <button class="btn-primary" data-action="listen-full">${p.playing ? '⏸ 暂停' : '▶ 从头播放'}</button>
        </div>`;
    } else {
      body = `
        <div class="listen-tip">第三遍 · 中英对照，点任意句子反复听，点单词可加入生词本</div>
        <div class="listen-lines">
          ${dlg.dialogue.map((s, i) => `
            <div class="listen-line ${i === p.index ? 'active' : ''}" data-action="listen-line" data-arg="${i}">
              <span class="line-no">${i + 1}</span>
              <span class="line-en">${wordify(s.en)}</span>
              <span class="line-cn">${esc(s.cn)}</span>
            </div>`).join('')}
        </div>`;
    }

    return `
    <div class="view active">
      <div class="practice-top">
        <div class="back-row">
          <button class="back-btn" data-action="back">‹</button>
          <span class="practice-course-title">${esc(dlg.title)}</span>
          <span class="practice-progress-dots">${total}句</span>
        </div>
      </div>
      <div class="step-row">
        ${steps.map(s => `<button class="step-chip ${p.step === s.n ? 'active' : ''}" data-action="listen-step" data-arg="${s.n}">${s.label}</button>`).join('')}
      </div>
      ${body}
      <div style="text-align:center;color:var(--c-text-light);font-size:12px;margin-top:14px">👆 轻点英文单词可加入生词本</div>
    </div>`;
  }

  function openListenPlay(id) {
    TTS.stop();
    P.listenPlay = { id, step: 1, index: 0, playing: false };
    navigate('listen-play', id);
  }

  function setListenStep(n) {
    TTS.stop();
    const p = P.listenPlay;
    p.step = n;
    p.playing = false;
    p.index = 0;
    render();
    if (n === 1) { /* 等用户点播放 */ }
  }

  /** 整段连读（第一遍盲听） */
  function listenFull() {
    const p = P.listenPlay;
    const dlg = CONTENT.getListening(p.id);
    if (!dlg) return;
    if (p.playing) { TTS.stop(); p.playing = false; render(); return; }
    p.playing = true;
    render();
    const full = dlg.dialogue.map(s => s.en).join(' ');
    TTS.speak(full, { rate: 0.75 }).then(() => {
      if (P.listenPlay.playing) { P.listenPlay.playing = false; render(); }
    });
  }

  /** 逐句顺序播放（第二遍） */
  async function playDialogueLines() {
    const p = P.listenPlay;
    const dlg = CONTENT.getListening(p.id);
    if (!dlg) return;
    if (p.playing) { TTS.stop(); p.playing = false; render(); return; }
    p.playing = true;
    render();
    for (let i = p.index; i < dlg.dialogue.length; i++) {
      if (!P.listenPlay.playing) break;
      p.index = i;
      render();
      await TTS.speak(dlg.dialogue[i].en, { rate: 0.75 });
    }
    if (P.listenPlay.playing) {
      p.playing = false;
      Store.markListeningDone(p.id);
      toast('这节听力听完啦 ✓');
    }
    render();
  }

  /** 点句重听 */
  function playLine(i) {
    const p = P.listenPlay;
    const dlg = CONTENT.getListening(p.id);
    if (!dlg) return;
    p.index = i;
    TTS.stop();
    TTS.speak(dlg.dialogue[i].en, { rate: 0.75 }).then(() => {
      if (p.step === 3 && i >= dlg.dialogue.length - 1) {
        Store.markListeningDone(p.id);
        toast('这节听力听完啦 ✓');
      }
    });
    render();
  }

  function listenMove(dir) {
    const p = P.listenPlay;
    const dlg = CONTENT.getListening(p.id);
    if (!dlg) return;
    TTS.stop();
    const total = dlg.dialogue.length;
    let i = p.index + dir;
    if (i < 0) i = total - 1;
    if (i >= total) i = 0;
    playLine(i);
  }

  /* ============ 场景课程列表 ============ */
  function renderCourses() {
    const chips = ['all', 'restaurant', 'hotel', 'transport', 'shopping', 'social', 'bank', 'medical', 'telecom', 'help', 'life'].map(sc => `
      <button class="chip ${P.courses.scene === sc ? 'active' : ''}" data-action="filter-scene" data-arg="${sc}">${SCENE_NAMES[sc]}</button>`).join('');

    const list = CONTENT.getCourseList(P.courses.scene).map(c => {
      const learned = Store.learnedCount(c.id);
      const pct = Math.round(learned / c.sentenceCount * 100);
      return `
      <button class="course-card" data-action="go-practice" data-arg="${c.id}">
        <span class="course-icon">${c.icon}</span>
        <span class="course-info">
          <span class="course-title">第${c.day}课 · ${esc(c.title)}</span><br>
          <span class="course-meta">${esc(c.coreSentence)} · ${c.sentenceCount}句 · ${c.duration}</span>
          <span class="course-progress"><span class="fill" style="width:${pct}%"></span></span>
        </span>
        <span class="course-arrow">›</span>
      </button>`;
    }).join('');

    return `
    <div class="view active">
      <div style="padding-top:12px"><span class="page-title">场景课程</span></div>
      <div class="course-chips">${chips}</div>
      <div class="course-list">${list || '<div class="empty-tip">该分类下课程还在制作中</div>'}</div>
    </div>`;
  }

  /* ============ 跟读练习（含打分） ============ */
  function currentCourse() {
    return CONTENT.getCourse(routeArg) || CONTENT.getCourse('restaurant-day01');
  }

  function renderPractice() {
    const course = currentCourse();
    const idx = P.practice.index || 0;
    const s = course.sentences[idx];
    if (!s) return '<div class="view active"><div class="empty-tip">课程没有内容</div></div>';

    const total = course.sentences.length;
    const st = P.practice;
    const learned = Store.learnedCount(course.id);

    let body = '';
    if (st.recording) {
      body = `
        <div class="rec-wave"><span></span><span></span><span></span><span></span><span></span></div>
        <div class="rec-hint">正在听你说，别紧张～</div>
        ${st.mode === 'sr' && st.interim ? `<div style="text-align:center;color:var(--c-text-sub);font-size:14px;margin-top:8px">${esc(st.interim)}</div>` : ''}
        <div style="margin-top:22px" class="action-row">
          <button class="btn-primary" data-action="practice-say">说完了</button>
        </div>`;
    } else if (st.scoring) {
      body = `
        <div class="rec-wave"><span></span><span></span><span></span><span></span><span></span></div>
        <div class="rec-hint">小英老师评分中，稍等一下～</div>`;
    } else if (st.result) {
      const r = st.result;
      const stars = '★'.repeat(r.stars) + '<span class="empty">' + '★'.repeat(Math.max(0, 3 - r.stars)) + '</span>';
      body = `
        <div class="score-card">
          <div class="score-stars">${stars}</div>
          <div class="score-text">${esc(r.text)}</div>
          <div class="score-detail">${esc(r.detail)}</div>
        </div>
        <div class="action-row">
          <button class="btn-primary" data-action="practice-next">${idx >= total - 1 ? '完成本课 ✓' : '下一句 →'}</button>
          <button class="ai-mini-btn" data-action="go-ai">AI</button>
        </div>`;
    } else {
      body = `
        <div class="audio-row"><button class="play-circle" data-action="practice-replay">▶</button></div>
        <div class="speak-area"><button class="speak-btn" data-action="practice-say">说</button></div>
        <div style="text-align:center;color:var(--c-text-light);font-size:13px;margin-top:14px">点「说」开始录音，说完再点一次</div>`;
    }

    return `
    <div class="view active">
      <div class="practice-top">
        <div class="back-row">
          <button class="back-btn" data-action="back">‹</button>
          <span class="practice-course-title">第${course.day}课 · ${esc(course.title)}</span>
          <span class="practice-progress-dots">${idx + 1}/${total} · 已学${learned}句</span>
        </div>
      </div>
      <div class="practice-main">
        <div class="sentence-en">${wordify(s.en)}</div>
        <div class="sentence-cn">${esc(s.cn)}</div>
        <div class="sentence-tips">💡 ${esc(s.tips || '')}</div>
        ${body}
      </div>
    </div>`;
  }

  function practiceSay() {
    const st = P.practice;
    const course = currentCourse();
    const idx = st.index || 0;
    const sentence = course.sentences[idx];
    TTS.stop();

    if (st.recording) {
      if (st.mode === 'wav') {
        st.recording = false;
        st.scoring = true;
        render();
        Scorer.WavRecorder.stop()
          .then(rec => Scorer.proxyScore(sentence, rec.wavBase64, Store.state.settings.scoreProxyUrl))
          .then(result => {
            st.scoring = false;
            st.result = result;
            Store.markLearned(course.id, sentence.order);
            render();
          })
          .catch(err => {
            st.scoring = false;
            st.result = null;
            render();
            toast(err.message || '打分失败，请再试一次');
          });
        return;
      }
      Scorer.Recognizer.stop();
      st.recording = false;
      const text = st.interim || '';
      const result = Scorer.matchScore(text, sentence);
      st.result = result;
      st.interim = '';
      Store.markLearned(course.id, sentence.order);
      render();
      return;
    }

    const proxyUrl = (Store.state.settings.scoreProxyUrl || '').trim();
    if (proxyUrl) {
      if (!Scorer.WavRecorder.supported) {
        toast('当前浏览器不支持录音，请用 Safari 或 Chrome 打开');
        return;
      }
      st.mode = 'wav';
      st.interim = '';
      st.result = null;
      st.scoring = false;
      st.recording = true;
      render();
      Scorer.WavRecorder.start().catch(() => {
        st.recording = false;
        render();
        toast('无法使用麦克风，请到手机「设置-Safari-麦克风」允许权限');
      });
      return;
    }

    if (!Scorer.supported) {
      toast('iPhone 上打分需要先在「我的-设置」里填打分服务地址（见部署说明）');
      return;
    }

    st.mode = 'sr';
    st.interim = '';
    st.result = null;
    st.recording = true;
    render();

    Scorer.startPractice({
      onResult(r) {
        st.interim = r.interim || r.final;
        const el = $('.rec-hint');
        if (el && el.nextElementSibling) {
          el.nextElementSibling.textContent = st.interim;
        }
      },
      onDone(finalText) {
        if (!st.recording) return;
        st.recording = false;
        const text = finalText || st.interim || '';
        const result = Scorer.matchScore(text, sentence);
        st.result = result;
        st.interim = '';
        Store.markLearned(course.id, sentence.order);
        render();
      },
      onError(err) {
        st.recording = false;
        st.interim = '';
        render();
        if (err === 'unsupported' || err === 'not-allowed') {
          toast('无法使用麦克风，请检查浏览器权限设置');
        } else if (err === 'no-speech') {
          toast('没有听到声音，靠近麦克风再试一次');
        } else {
          toast('录音出错了，请再试一次');
        }
      }
    });
  }

  function practiceNext() {
    const course = currentCourse();
    const total = course.sentences.length;
    const idx = (P.practice.index || 0);

    if (idx >= total - 1) {
      P.practice = { recording: false, scoring: false, mode: '', interim: '', result: null, index: 0, finished: true };
      Store.markCourseDone();
      const vocabToday = Store.vocabDoneToday();
      if (vocabToday) {
        Store.checkin();
        navigate('checkin');
      } else {
        toast('课程完成 ✓ 今天再背完单词就能打卡啦');
        navigate('courses');
      }
      return;
    }
    P.practice.index = idx + 1;
    P.practice.result = null;
    P.practice.interim = '';
    render();
  }

  function practiceReplay() {
    const course = currentCourse();
    const idx = P.practice.index || 0;
    const s = course.sentences[idx];
    TTS.speak(s.en, { rate: 0.8 });
  }

  /* ============ 生词本 ============ */
  function renderWordbook() {
    const wb = P.wordbook;
    if (wb.review) return renderWordbookReview();

    const words = Store.state.wordbook;
    const list = words.map(w => `
      <div class="card" style="padding:14px 16px;margin-bottom:12px;display:flex;align-items:center;gap:12px">
        <div style="flex:1">
          <div style="font-size:17px;font-weight:700;color:var(--c-primary-dark)">${esc(w.en)} <span style="font-size:13px;color:var(--c-text-sub);font-weight:400">${esc(w.phonetic || '')}</span></div>
          <div style="font-size:14px;color:var(--c-text-sub);margin-top:2px">${esc(w.cn)}</div>
        </div>
        <button class="ctrl-btn" style="width:40px;height:40px;font-size:16px" data-action="word-del" data-arg="${esc(w.en)}">删</button>
      </div>`).join('');

    return `
    <div class="view active">
      <div style="padding-top:12px;display:flex;align-items:baseline;justify-content:space-between">
        <span class="page-title">生词本</span>
        <span style="font-size:13px;color:var(--c-text-light)">${words.length} 个词</span>
      </div>
      ${words.length ? `
        <button class="btn-primary vocab-start-btn" data-action="wb-start">📖 开始复习（${Math.min(words.length, 10)} 题）</button>
      ` : ''}
      <div style="height:12px"></div>
      ${list || '<div class="empty-tip">还没有生词。学习时轻点单词，或点「＋ 生词本」，就能把不认识的词收进来。</div>'}
    </div>`;
  }

  function renderWordbookReview() {
    const wb = P.wordbook;
    const total = wb.queue.length;
    if (wb.index >= total) {
      return `
      <div class="view active">
        <div class="checkin-page">
          <div class="checkin-badge">✓</div>
          <div class="checkin-title">复习完成！</div>
          <div class="checkin-sub">答对 ${wb.correctCount}/${total} 个</div>
          <div class="checkin-btns">
            <button class="btn-primary" data-action="wb-exit">回到生词本</button>
          </div>
        </div>
      </div>`;
    }
    const w = wb.queue[wb.index];
    if (!w) return '<div class="view active"><div class="empty-tip">没有单词</div></div>';

    return `
    <div class="view active">
      <div class="practice-top">
        <div class="back-row">
          <button class="back-btn" data-action="wb-exit">✕</button>
          <span class="practice-course-title">生词复习</span>
          <span class="practice-progress-dots">${wb.index + 1}/${total}</span>
        </div>
      </div>
      <div class="vocab-stage">
        <div class="vocab-en">${esc(w.en)}</div>
        <div class="vocab-hint">选出正确的中文意思</div>
        <div class="vocab-options">
          ${wb.options.map((opt, i) => `
            <button class="vocab-opt ${wb.selected !== -1 ? (i === wb.correctIndex ? 'right' : (i === wb.selected ? 'wrong' : '')) : ''}" data-action="wb-answer" data-arg="${i}">
              <span class="vocab-opt-key">${'ABCD'[i]}</span>
              <span class="vocab-opt-text">${esc(opt)}</span>
            </button>`).join('')}
        </div>
        <div class="action-row" style="margin-top:24px">
          ${wb.selected !== -1 ? `<button class="btn-primary" data-action="wb-next">${wb.index >= total - 1 ? '完成复习 ✓' : '下一题 →'}</button>` : ''}
        </div>
      </div>
    </div>`;
  }

  function wbStart() {
    const words = Store.state.wordbook;
    if (!words.length) { toast('生词本是空的，先去收几个词吧'); return; }
    const queue = Vocab.shuffle(words).slice(0, Math.min(10, words.length));
    P.wordbook = {
      review: true, queue, index: 0,
      options: [], correctIndex: -1, selected: -1, isCorrect: false, correctCount: 0
    };
    wbLoadQuestion();
  }

  function wbLoadQuestion() {
    const wb = P.wordbook;
    const w = wb.queue[wb.index];
    if (!w) { render(); return; }
    let q;
    const found = Vocab.find(w.en);
    if (found) {
      q = Vocab.makeOptions(found, found.day || 1);
    } else {
      const correct = w.cn || w.en;
      const pool = Vocab.shuffle(Vocab.allWords())
        .filter(x => x.en.toLowerCase() !== w.en.toLowerCase())
        .slice(0, 3)
        .map(x => Vocab.cnShort(x));
      const options = Vocab.shuffle([correct].concat(pool));
      q = { options, correct, correctIndex: options.indexOf(correct) };
    }
    wb.options = q.options;
    wb.correctIndex = q.correctIndex;
    wb.selected = -1;
    render();
  }

  function wbAnswer(i) {
    const wb = P.wordbook;
    if (wb.selected !== -1) return;
    wb.selected = i;
    if (i === wb.correctIndex) wb.correctCount++;
    render();
  }

  function wbNext() {
    const wb = P.wordbook;
    wb.index++;
    if (wb.index < wb.queue.length) {
      wbLoadQuestion();
    } else {
      render();
    }
  }

  function wbExit() {
    P.wordbook = { review: false, queue: [], index: 0, options: [], correctIndex: -1, selected: -1, isCorrect: false, correctCount: 0 };
    render();
  }

  /* ============ AI 助手 ============ */
  function renderAI() {
    const msgs = P.ai.messages;
    const s = Store.state.settings;

    const msgsHtml = msgs.map(m => {
      if (m.from === 'user') {
        return `<div class="msg user"><span class="msg-avatar">我</span><div class="msg-bubble">${esc(m.text)}</div></div>`;
      }
      let inner = `<div class="msg-bubble">${esc(m.text)}</div>`;
      if (m.word) {
        const w = m.word;
        inner += `
          <div class="word-card">
            <div class="word-head"><span class="word-en">${esc(w.en)}</span><span class="word-phonetic">${esc(w.phonetic || '')}</span></div>
            <div class="word-cn">${esc(w.cn)}</div>
            <div class="word-example">${esc(w.example || '')}</div>
            <button class="word-add" data-action="word-add" data-arg="${esc(w.en)}">＋ 加入生词本</button>
          </div>`;
      }
      return `<div class="msg ai"><span class="msg-avatar">英</span>${inner}</div>`;
    }).join('');

    return `
    <div class="view active ai-page">
      <div class="ai-header">
        <button class="back-btn" data-action="back">‹</button>
        <span class="ai-avatar">英</span>
        <span>
          <span class="ai-title">小英老师</span><br>
          <span class="ai-sub">${s.llmApiKey ? '已联网 · 可以随便问' : '离线模式 · 设置 Key 后更聪明'}</span>
        </span>
      </div>

      <div class="ai-msgs">
        <div class="msg ai">
          <span class="msg-avatar">英</span>
          <div class="msg-bubble">你好呀～我是小英老师。有不认识的单词、听不懂的句子，都可以问我。大胆问，别怕错！</div>
        </div>
        ${msgsHtml}
        ${P.ai.thinking ? `<div class="msg ai"><span class="msg-avatar">英</span><div class="msg-bubble thinking-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>` : ''}
        <div id="ai-anchor"></div>
      </div>

      <div class="quick-chips">
        <button class="quick-chip" data-action="ai-quick" data-arg="menu 是什么意思？">这个单词怎么读</button>
        <button class="quick-chip" data-action="ai-quick" data-arg="这句话语法对吗：Table for one, please.">这句话语法对吗</button>
        <button class="quick-chip" data-action="ai-quick" data-arg="帮我翻译：请问洗手间在哪里？">帮我翻译</button>
        <button class="quick-chip" data-action="ai-quick" data-arg="这句话我不会读怎么办？">这句话我不会读</button>
      </div>

      <div class="ai-input-bar">
        <input id="ai-input" type="text" placeholder="输入单词或句子…" value="${esc(P.ai.input)}">
        <button class="ai-send" data-action="ai-send">发</button>
      </div>
    </div>`;
  }

  async function aiSend(text) {
    const t = (text != null ? text : P.ai.input).trim();
    if (!t || P.ai.thinking) return;
    P.ai.input = '';
    P.ai.messages.push({ from: 'user', text: t });
    P.ai.thinking = true;
    render();

    const history = P.ai.messages.filter(m => m.from === 'user' || m.from === 'ai');
    const reply = await AI.ask(history.slice(0, -1), t);
    P.ai.thinking = false;
    P.ai.messages.push({ from: 'ai', text: reply.text || reply.type, word: reply.word });
    render();
    scrollAI();
  }

  function scrollAI() {
    setTimeout(() => {
      const anchor = $('#ai-anchor');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 60);
  }

  /* ============ 打卡成功页 ============ */
  function renderCheckin() {
    const streak = Store.state.streak;
    const todaySentences = Store.totalLearned();
    const week = Store.weekDays();

    return `
    <div class="view active checkin-page">
      <div class="checkin-badge">✓</div>
      <div class="checkin-title">太棒了！</div>
      <div class="checkin-sub">今天的课程和单词都完成了，敢开口就赢啦</div>

      <div class="checkin-stats">
        <div class="stat-card"><div class="stat-num">${streak}</div><div class="stat-label">连续打卡（天）</div></div>
        <div class="stat-card"><div class="stat-num">${todaySentences}</div><div class="stat-label">累计开口（句）</div></div>
      </div>

      <div class="week-stars">
        <div class="week-title">本周打卡</div>
        <div class="week-row">
          ${week.map(d => `
            <div class="week-day">
              <div class="week-s ${d.done ? '' : 'off'}">★</div>
              <div class="week-d">周${d.label}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="checkin-btns">
        <button class="btn-primary" data-action="nav" data-arg="home">明天继续</button>
        <button class="btn-ghost" data-action="share-checkin">把好消息发给家人</button>
      </div>
    </div>`;
  }

  /* ============ 我的页 ============ */
  function renderProfile() {
    const s = Store.state.settings;
    const totalLearned = Store.totalLearned();
    const weekDone = Store.weekDays().filter(d => d.done).length;
    const v = Store.state.vocab;
    const masteredCount = Object.keys(v.mastered).length;
    const weakCount = Object.keys(v.weak).length;
    const courseCount = CONTENT.getCourseList('all').length;
    const listenCount = CONTENT.getListeningList().length;

    return `
    <div class="view active">
      <div class="practice-top">
        <div class="back-row">
          <button class="back-btn" data-action="back">‹</button>
          <span class="practice-course-title">我的</span>
        </div>
      </div>
      <div class="profile-head">
        <div class="profile-avatar">${esc(s.userName.charAt(0))}</div>
        <div class="profile-name">${esc(s.userName)}</div>
        <div class="profile-days">连续打卡 ${Store.state.streak} 天 · 本周 ${weekDone}/7 天</div>
      </div>

      <div class="profile-stats">
        <div class="stat-card"><div class="stat-num">${masteredCount}</div><div class="stat-label">掌握单词</div></div>
        <div class="stat-card"><div class="stat-num">${weakCount}</div><div class="stat-label">待复习</div></div>
        <div class="stat-card"><div class="stat-num">${totalLearned}</div><div class="stat-label">开口句子</div></div>
      </div>
      <div class="profile-stats" style="margin-top:10px">
        <div class="stat-card"><div class="stat-num">${courseCount}</div><div class="stat-label">场景课程</div></div>
        <div class="stat-card"><div class="stat-num">${listenCount}</div><div class="stat-label">听力对话</div></div>
        <div class="stat-card"><div class="stat-num">${Store.state.wordbook.length}</div><div class="stat-label">生词</div></div>
      </div>

      <div class="menu-list">
        <button class="menu-item" data-action="nav" data-arg="wordbook">
          <span class="left"><span class="menu-ico">📖</span>我的生词本</span><span class="menu-arrow">›</span>
        </button>
        <button class="menu-item" data-action="nav" data-arg="settings">
          <span class="left"><span class="menu-ico">⚙️</span>设置（AI Key / 打分）</span><span class="menu-arrow">›</span>
        </button>
        <button class="menu-item" data-action="about">
          <span class="left"><span class="menu-ico">💬</span>关于笑小英</span><span class="menu-arrow">›</span>
        </button>
      </div>
    </div>`;
  }

  /* ============ 设置页 ============ */
  function renderSettings() {
    const s = Store.state.settings;
    return `
    <div class="view active">
      <div class="practice-top">
        <div class="back-row">
          <button class="back-btn" data-action="back">‹</button>
          <span class="practice-course-title">设置</span>
        </div>
      </div>

      <div class="setting-block">
        <div class="setting-label">称呼（首页问候语）</div>
        <input class="setting-input" id="set-name" value="${esc(s.userName)}">
      </div>

      <div class="setting-block">
        <div class="setting-label">每天背单词数（个）</div>
        <input class="setting-input" id="set-goal" type="number" value="${s.todayGoal}">
      </div>

      <div class="setting-block">
        <div class="setting-label">大模型 API Key（让小英老师联网，选填）</div>
        <input class="setting-input" id="set-key" type="password" placeholder="sk-..." value="${esc(s.llmApiKey)}">
        <div class="setting-hint">支持 DeepSeek / 通义千问 / OpenAI 等 OpenAI 兼容接口。Key 只存在你浏览器本地。申请：deepseek.com（几块钱能用很久）</div>
      </div>

      <div class="setting-block">
        <div class="setting-label">接口地址</div>
        <input class="setting-input" id="set-baseurl" value="${esc(s.llmBaseUrl)}">
      </div>

      <div class="setting-block">
        <div class="setting-label">模型名</div>
        <input class="setting-input" id="set-model" value="${esc(s.llmModel)}">
      </div>

      <div class="setting-block">
        <div class="setting-label">打分服务地址（iPhone 打分必填）</div>
        <input class="setting-input" id="set-scoreproxy" placeholder="https://xxx.apigw.tencentcs.com/..." value="${esc(s.scoreProxyUrl)}">
        <div class="setting-hint">不填：安卓 Chrome 可直接打分，iPhone 无法打分。填上：iPhone 也能打分，还能给出准确度/流利度/完整度（需先部署 score-proxy 云函数，见部署说明）</div>
      </div>

      <div class="setting-block">
        <div class="setting-label">打分模式</div>
        <button class="menu-item" data-action="toggle-score">
          <span class="left"><span class="menu-ico">⭐</span>${s.showScore ? '显示具体分数（当前：显示）' : '温和鼓励模式（当前：只显示星级）'}</span>
          <span class="menu-arrow">›</span>
        </button>
      </div>

      <div class="setting-block">
        <button class="btn-primary" data-action="save-settings">保存设置</button>
      </div>
      <div style="height:20px"></div>
    </div>`;
  }

  /* ============ 交互分发 ============ */
  const ACTIONS = {
    'auth-mode'(arg) { P.auth.mode = arg; render(); },
    'auth-submit'() { authSubmit(); },
    'logout'() {
      P.auth.busy = false;
      Auth.logout().then(() => {});
    },
    'nav'(arg) {
      TTS.stop();
      if (arg === 'practice' || arg === 'listen-play' || arg === 'vocab') { /* 特殊处理在各自 action */ }
      navigate(arg);
    },
    'back'() { TTS.stop(); goBack(); },
    'go-ai'() { navigate('ai'); },

    /* 首页 */
    'go-today-task'() {
      const doneToday = Store.vocabDoneToday();
      const courseDone = Store.courseDoneToday();
      if (!courseDone && doneToday) navigate('courses');
      else if (courseDone && !doneToday) navigate('vocab');
      else if (courseDone && doneToday) navigate('home');
      else navigate('vocab');
    },
    'go-vocab-today'() { navigate('vocab'); },
    'play-daily'() {
      const d = CONTENT.getDailySentence();
      TTS.speak(d.en, { rate: 0.75 });
    },

    /* 词汇 */
    'vocab-start'() { startVocab(); },
    'vocab-cal'(arg) {
      const d = Number(arg);
      const dd = Vocab.getDay(d);
      const v = Store.state.vocab;
      if (!dd) return;
      const n = Object.keys(v.learned[d] || {}).length;
      toast(`第${d}天 · ${dd.topic}（已学 ${n}/${dd.words.length} 词）`);
    },
    'vocab-quit'() { quitVocab(); },
    'vocab-listen'() {
      const w = P.vocab.currentWord;
      if (w) TTS.speak(w.en, { rate: 0.7 });
    },
    'vocab-answer'(arg) { answerVocab(Number(arg)); },
    'vocab-next'() { nextVocabStep(); },
    'vocab-add-word'() {
      const w = P.vocab.explainWord || P.vocab.currentWord;
      if (w && Store.addWord({ en: w.en, cn: Vocab.cnShort(w), phonetic: w.ph || '' })) toast('已加入生词本 ✓');
      else if (w) toast('这个词已经在生词本里啦');
    },
    'translate-listen'() { translateListen(); },
    'translate-say'() { translateSay(); },
    'translate-next'() { translateNext(); },
    'vocab-home'() {
      P.vocab.phase = 'idle';
      render();
    },

    /* 听力 */
    'open-listen'(arg) { openListenPlay(arg); },
    'listen-step'(arg) { setListenStep(Number(arg)); },
    'listen-full'() {
      if (P.listenPlay.step === 1) listenFull();
      else playDialogueLines();
    },
    'listen-line'(arg) { playLine(Number(arg)); },
    'listen-prev'() { listenMove(-1); },
    'listen-next'() { listenMove(1); },

    /* 课程 & 练习 */
    'filter-scene'(arg) { P.courses.scene = arg; render(); },
    'go-practice'(arg) {
      P.practice = { recording: false, scoring: false, mode: '', interim: '', result: null, index: 0, finished: false };
      navigate('practice', arg);
    },
    'practice-say'() { practiceSay(); },
    'practice-next'() { practiceNext(); },
    'practice-replay'() { practiceReplay(); },

    /* 生词本 */
    'wb-start'() { wbStart(); },
    'wb-answer'(arg) { wbAnswer(Number(arg)); },
    'wb-next'() { wbNext(); },
    'wb-exit'() { wbExit(); },
    'word-add'(arg) {
      const fromMsg = [...P.ai.messages].reverse().find(m => m.word && m.word.en.toLowerCase() === String(arg).toLowerCase());
      const word = fromMsg ? fromMsg.word : (AI.WORD_BANK ? AI.WORD_BANK.find(w => w.en.toLowerCase() === String(arg).toLowerCase()) : null);
      if (word && Store.addWord(word)) toast('已加入生词本 ✓');
      else if (word) toast('这个词已经在生词本里啦');
      else toast('暂不支持添加该词');
    },
    'word-del'(arg) { Store.removeWord(arg); render(); },

    /* 打卡 / 我的 */
    'share-checkin'() {
      copyText('今天我用「笑小英口语练习」完成了课程和背单词任务！敢开口就赢啦 💪', '已复制，快发给家人吧');
    },
    'about'() { toast('笑小英口语练习 v2.0 · 词汇 + 听力 + 场景课 + 生词本'); },
    'toggle-score'() {
      Store.updateSettings({ showScore: !Store.state.settings.showScore });
      render();
    },
    'save-settings'() {
      const name = $('#set-name') ? $('#set-name').value.trim() : Store.state.settings.userName;
      const goal = parseInt(($('#set-goal') ? $('#set-goal').value : 20), 10) || 20;
      const key = $('#set-key') ? $('#set-key').value.trim() : '';
      const baseUrl = $('#set-baseurl') ? $('#set-baseurl').value.trim() : '';
      const model = $('#set-model') ? $('#set-model').value.trim() : '';
      const scoreProxy = $('#set-scoreproxy') ? $('#set-scoreproxy').value.trim() : '';
      Store.updateSettings({
        userName: name || '王阿姨',
        todayGoal: Math.min(50, Math.max(5, goal)),
        llmApiKey: key,
        llmBaseUrl: baseUrl || 'https://api.deepseek.com/v1/chat/completions',
        llmModel: model || 'deepseek-chat',
        scoreProxyUrl: scoreProxy
      });
      toast('设置已保存 ✓');
      setTimeout(() => goBack(), 600);
    }
  };

  /* 事件委托：按钮 + 单词点按 */
  document.addEventListener('click', function (e) {
    const tap = e.target.closest('.tap-word');
    if (tap) {
      const w = tap.getAttribute('data-word');
      if (w) { tapWord(w); return; }
    }
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.getAttribute('data-action');
    const arg = el.getAttribute('data-arg');
    if (ACTIONS[action]) ACTIONS[action](arg, el, e);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      if (!isLoggedIn()) { authSubmit(); return; }
      if (route === 'ai') {
        const input = $('#ai-input');
        if (input && input.value.trim()) {
          P.ai.input = input.value;
          aiSend();
        }
      }
    }
  });

  /* ============ 启动 ============ */
  (async function boot() {
    await Auth.init();
    if (isLoggedIn()) {
      await Store.loadFromCloud();
    }
    Auth.onAuthChange(async (user, event) => {
      if (user) {
        if (event === 'SIGNED_IN' || event === 'SIGNED_UP' || event === 'INITIAL_SESSION') {
          await Store.loadFromCloud();
          location.hash = '#/home';
        }
        render();
      } else {
        await Store.resetForLogout();
        route = 'home';
        location.hash = '#/home';
        render();
      }
    });
    render();
  })();
})();
