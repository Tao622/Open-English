/**
 * js/ai.js - 小英老师（AI 助手）
 *
 * 两级模式：
 * 1.【在线】在"我的 → 设置"里填入大模型 API Key（OpenAI 兼容接口：
 *    DeepSeek / 通义千问 / OpenAI 均可）→ 直接浏览器调用，返回单词卡/翻译/语法讲解
 * 2.【离线】未配置 Key 时，用内置"离线小英老师"兜底：
 *    查内置词库、简单翻译、鼓励话术，保证全流程可演示
 */

const AI = (function () {
  const SYSTEM_PROMPT = [
    '你是"小英老师"，一位温柔耐心的英语口语老师，服务对象是五十岁以上的中国长辈。',
    '她们词汇量不大、害怕开口，你要用最简单的中文讲解，多用鼓励。',
    '回答要求：',
    '1. 如果是查单词：先返回 JSON 块 {"type":"word","word":"单词","phonetic":"音标","cn":"中文释义","example":"简单英文例句（附中文）"}，',
    '   再补一两句中文讲解。',
    '2. 如果是翻译：直接给译文，再把生词挑出来用单词卡给出。',
    '3. 如果是语法/用法问题：用大白话讲，举一个生活中能用到的例子。',
    '4. 每次回答尽量在 4 句中文以内，别用术语，语气温暖。'
  ].join('\n');

  /* ---------- 内置词库（离线模式用） ---------- */
  const WORD_BANK = [
    { en: 'hello', phonetic: '/həˈloʊ/', cn: '你好', example: 'Hello, how are you? 你好，你好吗？' },
    { en: 'thank', phonetic: '/θæŋk/', cn: '谢谢', example: 'Thank you very much. 非常感谢。' },
    { en: 'sorry', phonetic: '/ˈsɑːri/', cn: '对不起；不好意思', example: 'Sorry, could you repeat that? 不好意思，您能再说一遍吗？' },
    { en: 'table', phonetic: '/ˈteɪbl/', cn: '桌子；位子', example: 'A table for two, please. 请给我两个人的位子。' },
    { en: 'window', phonetic: '/ˈwɪndoʊ/', cn: '窗户；靠窗', example: 'A table by the window, please. 请给我靠窗的位子。' },
    { en: 'menu', phonetic: '/ˈmenjuː/', cn: '菜单', example: 'Can I have the menu, please? 请给我看一下菜单好吗？' },
    { en: 'tea', phonetic: '/tiː/', cn: '茶', example: "I'd like a cup of tea. 请给我一杯茶。" },
    { en: 'repeat', phonetic: '/rɪˈpiːt/', cn: '重复；再说一遍', example: 'Could you repeat that? 您能再说一遍吗？' },
    { en: 'flight', phonetic: '/flaɪt/', cn: '航班', example: 'My flight is at 9 o\'clock. 我的航班是 9 点的。' },
    { en: 'check-in', phonetic: '/ˈtʃek ɪn/', cn: '值机；办理入住', example: 'Where is the check-in counter? 值机柜台在哪里？' },
    { en: 'breakfast', phonetic: '/ˈbrekfəst/', cn: '早餐', example: 'What time is breakfast? 早餐几点开始？' },
    { en: 'reservation', phonetic: '/ˌrezərˈveɪʃn/', cn: '预订', example: 'I have a reservation. 我订过房间了。' },
    { en: 'subway', phonetic: '/ˈsʌbweɪ/', cn: '地铁', example: 'How do I get to the subway? 去地铁站怎么走？' },
    { en: 'far', phonetic: '/fɑːr/', cn: '远的', example: 'Is it far from here? 离这里远吗？' }
  ];

  const FALLBACK_REPLIES = [
    '这个问题我记在小本本上了～ 等我连上网络小英老师，就能给你查得更仔细。现在你可以先用上面的单词卡记一记！',
    '别着急，慢慢说。你刚才说的这句话，可以先试着拆分：先读第一个单词，再读第二个，连起来就是整句啦。',
    '小英老师还没联网，不过你可以先去「跟读练习」里大声读几句，读错了也没关系，敢开口就赢啦！'
  ];

  /* ---------- 离线模式 ---------- */
  function offlineReply(text) {
    const t = String(text || '').trim().toLowerCase();

    // 1. 查单词
    const word = WORD_BANK.find(w => t === w.en.toLowerCase() || t.includes(w.en.toLowerCase()));
    if (word) {
      return {
        type: 'word',
        word: word,
        text: `这个词读作 ${word.phonetic}，意思是「${word.cn}」。平时这样用：${word.example}`
      };
    }

    // 2. 翻译类
    if (t.includes('翻译') || t.includes('怎么说')) {
      return { type: 'text', text: '离线模式下我只会几个常用词。你可以先去「设置」里填一个大模型 API Key（很便宜，几块钱能用很久），我就能帮你翻译任何句子了。' };
    }

    // 3. 鼓励/兜底
    return {
      type: 'text',
      text: FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
    };
  }

  /* ---------- 在线模式（OpenAI 兼容接口直调） ---------- */
  async function onlineAsk(history, text) {
    const s = Store.state.settings;
    if (!s.llmApiKey) return null;

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    history.slice(-8).forEach(m => {
      messages.push({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text });
    });
    messages.push({ role: 'user', content: text });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);

    try {
      const resp = await fetch(s.llmBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + s.llmApiKey
        },
        body: JSON.stringify({
          model: s.llmModel,
          messages,
          temperature: 0.7,
          max_tokens: 600
        }),
        signal: controller.signal
      });
      clearTimeout(timer);

      if (!resp.ok) {
        const err = await resp.text().catch(() => '');
        console.warn('LLM error', resp.status, err);
        return { error: `API 返回 ${resp.status}，请检查 Key 或接口地址` };
      }
      const data = await resp.json();
      const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';

      // 解析单词卡 JSON
      const jsonMatch = content.match(/\{[\s\S]*?"type"\s*:\s*"word"[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          const w = JSON.parse(jsonMatch[0]);
          const clean = content.replace(jsonMatch[0], '').replace(/```/g, '').trim();
          return {
            type: 'word',
            word: { en: w.word, phonetic: w.phonetic, cn: w.cn, example: w.example },
            text: clean || `单词 ${w.word} 的讲解在这里～`
          };
        } catch (e) { /* fallthrough */ }
      }
      return { type: 'text', text: content.trim() };
    } catch (e) {
      clearTimeout(timer);
      console.warn('LLM fetch error', e);
      return { error: '请求失败：' + (e.name === 'AbortError' ? '超时了，请重试' : '网络问题，请检查网络或接口地址') };
    }
  }

  /** 统一入口 */
  async function ask(history, text) {
    const online = await onlineAsk(history, text);
    if (online && !online.error) return online;
    if (online && online.error) return { type: 'text', text: online.error + '。' + offlineReply(text).text };
    return offlineReply(text);
  }

  return { ask, WORD_BANK };
})();
