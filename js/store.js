/**
 * js/store.js - 本地存储（localStorage 封装）
 * 管理：学习进度、打卡记录、生词本、AI/评测配置
 *
 * 云端同步：登录后学习进度自动同步到 Supabase（按用户隔离），
 * 换设备/换浏览器登录同一账号即可恢复进度。未登录时仅存本地。
 */

const Store = (function () {
  const PREFIX = 'xxy_';

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) { /* 存储失败静默 */ }
  }

  const defaultState = {
    // 学习进度：{ courseId: [已学句子 order] }
    learned: {},
    // 连续打卡天数 & 最近打卡日期
    streak: 0,
    lastCheckinDate: '',
    // 本周打卡星：['2026-08-24': true, ...]
    weekStars: {},
    // 生词本：[{ en, cn, phonetic, addedAt }]
    wordbook: [],
    // 场景课程完成记录：{ '2026-08-25': true } 当天至少完成 1 课
    courseDone: {},
    // 慢速听力完成记录：{ 'listen-01': true }
    listeningDone: {},
    // 词汇学习状态：
    //   day: 当前学习到第几天（1-30）
    //   learned: { day: { en: true } } 每天学过的新词
    //   mastered: { en: true } 曾选对/掌握的词
    //   weak: { en: true } 未掌握、待复习的词
    //   done: { '2026-08-25': { day, newCount } } 每天完成记录
    //   session: { date, count } 今天已学词数（进行中进度）
    vocab: {
      day: 1,
      learned: {},
      mastered: {},
      weak: {},
      done: {},
      session: { date: '', count: 0 }
    },
    // 设置
    settings: {
      userName: '王阿姨',
      todayGoal: 8,
      // AI 助手（OpenAI 兼容）
      llmApiKey: '',
      llmBaseUrl: 'https://api.deepseek.com/v1/chat/completions',
      llmModel: 'deepseek-chat',
      // 口语打分代理（讯飞口语评测，iPhone 打分必填；不填则安卓 Chrome 走浏览器识别）
      scoreProxyUrl: '',
      // 是否显示具体分数（默认温和模式，只显示星级与鼓励语）
      showScore: false
    }
  };

  const state = Object.assign({}, defaultState, read('state', {}));
  state.settings = Object.assign({}, defaultState.settings, state.settings || {});
  state.learned = state.learned || {};
  state.weekStars = state.weekStars || {};
  state.wordbook = state.wordbook || [];
  state.courseDone = state.courseDone || {};
  state.listeningDone = state.listeningDone || {};
  state.vocab = Object.assign({ day: 1, learned: {}, mastered: {}, weak: {}, done: {}, session: { date: '', count: 0 } }, state.vocab || {});
  state.vocab.learned = state.vocab.learned || {};
  state.vocab.mastered = state.vocab.mastered || {};
  state.vocab.weak = state.vocab.weak || {};
  state.vocab.done = state.vocab.done || {};
  state.vocab.session = Object.assign({ date: '', count: 0 }, state.vocab.session || {});

  function save() {
    write('state', state);
    scheduleCloudSync();
  }

  /* ---------- 云端同步（Supabase，按用户隔离） ---------- */
  let cloudTimer = null;

  function cloudClient() {
    try {
      return (typeof Auth !== 'undefined' && Auth.ready() && Auth.user()) ? Auth.client() : null;
    } catch (e) { return null; }
  }

  function scheduleCloudSync() {
    const c = cloudClient();
    if (!c) return;
    clearTimeout(cloudTimer);
    cloudTimer = setTimeout(() => syncToCloud(c), 800);
  }

  /** 把当前完整进度写入云端（upsert：按 user_id 覆盖该用户自己的行） */
  async function syncToCloud(c) {
    const user = Auth.user();
    if (!user) return;
    try {
      await c.from('user_progress').upsert({
        user_id: user.id,
        progress: state,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('云端进度同步失败（稍后自动重试）', e);
    }
  }

  /** 登录后从云端拉取该用户进度并覆盖本地；无云端记录时返回 false */
  async function loadFromCloud() {
    const user = Auth.user();
    const c = Auth.client();
    if (!user || !c) return false;
    try {
      const { data } = await c.from('user_progress').select('progress').eq('user_id', user.id).maybeSingle();
      if (data && data.progress) {
        const cloud = data.progress;
        Object.assign(state, cloud);
        state.settings = Object.assign({}, defaultState.settings, cloud.settings || {});
        state.learned = cloud.learned || {};
        state.weekStars = cloud.weekStars || {};
        state.wordbook = cloud.wordbook || [];
        state.courseDone = cloud.courseDone || {};
        state.listeningDone = cloud.listeningDone || {};
        state.vocab = Object.assign({ day: 1, learned: {}, mastered: {}, weak: {}, done: {}, session: { date: '', count: 0 } }, cloud.vocab || {});
        state.vocab.learned = state.vocab.learned || {};
        state.vocab.mastered = state.vocab.mastered || {};
        state.vocab.weak = state.vocab.weak || {};
        state.vocab.done = state.vocab.done || {};
        state.vocab.session = Object.assign({ date: '', count: 0 }, state.vocab.session || {});
        save();
        return true;
      }
    } catch (e) {
      console.warn('云端进度加载失败，使用本地数据', e);
    }
    return false;
  }

  /** 退出登录：确保最后一次进度已同步，然后重置为默认状态 */
  async function resetForLogout() {
    const c = cloudClient();
    if (c) await syncToCloud(c);
    Object.keys(state).forEach(k => delete state[k]);
    Object.assign(state, JSON.parse(JSON.stringify(defaultState)));
    write('state', state);
  }

  return {
    state,
    save,
    loadFromCloud,
    resetForLogout,

    /* ---------- 学习进度 ---------- */
    markLearned(courseId, order) {
      if (!state.learned[courseId]) state.learned[courseId] = [];
      if (!state.learned[courseId].includes(order)) {
        state.learned[courseId].push(order);
        save();
      }
    },
    learnedCount(courseId) {
      return (state.learned[courseId] || []).length;
    },
    totalLearned() {
      return Object.values(state.learned).reduce((sum, arr) => sum + arr.length, 0);
    },

    /* ---------- 课程完成（每日任务：至少 1 节场景课） ---------- */
    markCourseDone() {
      state.courseDone[this.todayString()] = true;
      save();
    },
    courseDoneToday() {
      return !!state.courseDone[this.todayString()];
    },

    /* ---------- 词汇学习 ---------- */
    /** 今天已完成词汇任务则返回完成记录，否则返回 null */
    vocabDoneToday() {
      const t = this.todayString();
      return state.vocab.done[t] || null;
    },
    /** 今天已学词数（进行中进度） */
    vocabCountToday() {
      const t = this.todayString();
      return state.vocab.session && state.vocab.session.date === t ? state.vocab.session.count : 0;
    },
    /** 记录又学了一个新词（会话进度） */
    bumpVocabCount() {
      const t = this.todayString();
      state.vocab.session = { date: t, count: (state.vocab.session && state.vocab.session.date === t ? state.vocab.session.count : 0) + 1 };
      save();
    },

    /* ---------- 慢速听力 ---------- */
    markListeningDone(id) {
      state.listeningDone[id] = true;
      save();
    },
    listeningDone(id) {
      return !!state.listeningDone[id];
    },

    /* ---------- 打卡 ---------- */
    todayString() {
      const d = new Date();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${d.getFullYear()}-${m}-${day}`;
    },
    /** 完成一次打卡：更新连续天数与本周星星 */
    checkin() {
      const today = this.todayString();
      const yesterday = this.daysAgoString(1);
      if (state.lastCheckinDate === today) return { streak: state.streak, today };
      if (state.lastCheckinDate === yesterday) {
        state.streak += 1;
      } else {
        state.streak = 1;
      }
      state.lastCheckinDate = today;
      state.weekStars[today] = true;
      // 清理一周前的记录
      const weekAgo = this.daysAgoString(7);
      Object.keys(state.weekStars).forEach(k => {
        if (k < weekAgo) delete state.weekStars[k];
      });
      save();
      return { streak: state.streak, today };
    },
    daysAgoString(n) {
      const d = new Date(Date.now() - n * 86400000);
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${d.getFullYear()}-${m}-${day}`;
    },
    /** 本周 7 天星星（周一起） */
    weekDays() {
      const now = new Date();
      const monday = new Date(now);
      const dow = (now.getDay() + 6) % 7; // 周一=0
      monday.setDate(now.getDate() - dow);
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const key = `${d.getFullYear()}-${m}-${dd}`;
        days.push({
          label: ['一', '二', '三', '四', '五', '六', '日'][i],
          done: !!state.weekStars[key]
        });
      }
      return days;
    },
    todayChecked() {
      return state.lastCheckinDate === this.todayString();
    },

    /* ---------- 生词本 ---------- */
    addWord(word) {
      if (!word || !word.en) return false;
      if (state.wordbook.some(w => w.en.toLowerCase() === word.en.toLowerCase())) return false;
      state.wordbook.unshift(Object.assign({ addedAt: Date.now() }, word));
      save();
      return true;
    },
    removeWord(en) {
      state.wordbook = state.wordbook.filter(w => w.en.toLowerCase() !== String(en).toLowerCase());
      save();
    },

    /* ---------- 设置 ---------- */
    updateSettings(patch) {
      Object.assign(state.settings, patch);
      save();
    }
  };
})();
