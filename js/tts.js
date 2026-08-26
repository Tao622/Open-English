/**
 * js/tts.js - 浏览器朗读封装（SpeechSynthesis）
 * 支持三档语速：0.5x / 0.75x / 1x（慢速听力用）
 * 免费、零依赖、离线可用（依赖系统英文语音）
 */

const TTS = (function () {
  let voices = [];

  function loadVoices() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return voices;
  }

  // 部分浏览器异步加载 voices
  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  /** 挑选英文女声，找不到就用任意 en 语音 */
  function pickVoice() {
    const list = loadVoices();
    const en = list.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
    if (!en.length) return null;
    // 优先常见的自然女声
    const preferred = ['Samantha', 'Google US English', 'Microsoft Aria', 'Microsoft Zira', 'Female', 'Karen', 'Moira', 'Tessa'];
    for (const name of preferred) {
      const hit = en.find(v => v.name.includes(name));
      if (hit) return hit;
    }
    return en[0];
  }

  function speak(text, opts) {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) { resolve(); return; }
      window.speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      const v = pickVoice();
      if (v) u.voice = v;
      u.rate = (opts && opts.rate) || 1; // 0.5 = 慢速
      u.pitch = 1.02;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);

      // 兜底：Safari 等偶尔不触发 onend
      const total = Math.max(1500, (text.length / 12) * 1000 / (u.rate || 1));
      setTimeout(resolve, total);
    });
  }

  function stop() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  /** 语速档位定义 */
  const SPEED_OPTIONS = [
    { label: '0.5x 很慢', rate: 0.5 },
    { label: '0.75x 慢速', rate: 0.75 },
    { label: '1x 正常', rate: 1 }
  ];

  return { speak, stop, loadVoices, SPEED_OPTIONS };
})();
