/**
 * js/scorer.js - 跟读机器打分
 *
 * 两级打分策略：
 * 1.【默认】浏览器语音识别（Web Speech API，Chrome/Edge/安卓可用）
 *    + 关键词宽松匹配 → 温和三档鼓励（不打击信心）
 * 2.【可选】讯飞口语评测（配置 AppID/Key/Secret 后生效，需自己的后端代理转发，
 *    避免密钥暴露；前端直调仅建议个人自用时开启）
 *
 * 设计原则：只鼓励、不打分较劲。默认不显示具体数字，用星级 + 鼓励语。
 */

(function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  /** 浏览器识别封装 */
  const Recognizer = {
    supported: !!SR,
    running: false,
    _rec: null,

    start(opts) {
      if (!this.supported) {
        opts.onError && opts.onError('unsupported');
        return;
      }
      if (this.running) this.stop();
      const rec = new SR();
      this._rec = rec;
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onresult = (e) => {
        let interim = '';
        let final = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t;
          else interim += t;
        }
        opts.onResult && opts.onResult({ interim, final });
      };
      rec.onend = () => {
        this.running = false;
        opts.onEnd && opts.onEnd();
      };
      rec.onerror = (e) => {
        this.running = false;
        opts.onError && opts.onError(e.error || 'error');
      };

      this.running = true;
      try {
        rec.start();
      } catch (e) {
        this.running = false;
        opts.onError && opts.onError('start_failed');
      }
    },

    stop() {
      if (this._rec && this.running) {
        try { this._rec.stop(); } catch (e) { /* ignore */ }
      }
    },

    abort() {
      if (this._rec) {
        try { this._rec.abort(); } catch (e) { /* ignore */ }
      }
      this.running = false;
    }
  };

  /** 关键词宽松匹配打分 */
  function matchScore(recognizedText, sentence) {
    const keys = (sentence.keywords || []).map(k => k.toLowerCase());
    if (!keys.length) return { stars: 3, score: 100, ratio: 1, matched: [], detail: '说得真好！' };

    const words = String(recognizedText || '')
      .toLowerCase()
      .split(/[^a-z']+/)
      .filter(Boolean);

    let hit = 0;
    const matched = [];
    keys.forEach(k => {
      const found = words.some(w =>
        w === k || w.startsWith(k) || (w.length > 3 && k.startsWith(w))
      );
      if (found) { hit++; matched.push(k); }
    });

    const ratio = hit / keys.length;
    const score = Math.round(ratio * 100);

    let stars, text, detail;
    if (ratio >= 0.67) {
      stars = 3;
      text = pick(['说得真好！', '发音很标准！', '太棒了，就是这样！']);
      detail = `说到了 ${hit}/${keys.length} 个关键词，非常棒！`;
    } else if (ratio >= 0.33) {
      stars = 2;
      text = pick(['不错！再顺一遍更棒', '很好，发音越来越好了', '继续加油，快说全啦']);
      detail = `说到了 ${hit}/${keys.length} 个关键词，再试一次就能更好`;
    } else {
      stars = 1;
      text = pick(['没关系，再听一遍原音试试', '慢慢来，第一个词先读对', '不着急，跟着原音读一遍']);
      detail = '先听原音，跟着大声读一遍，不用怕错';
    }

    return { stars, score, ratio, matched, text, detail };
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * 讯飞口语评测（可选）。
   * 说明：需要在你的服务器/云函数上放一个代理接口把请求转发给讯飞
   * （rest-api.xfyun.cn/v2/pronunciation），否则 API 密钥会暴露在网页里。
   * 代理接口约定 POST { text, audioBase64 } → 返回讯飞原始 JSON。
   */
  async function xfyunScore(sentence, audioBase64, proxyUrl) {
    if (!proxyUrl) return null;
    try {
      const resp = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sentence.en, audioBase64 })
      });
      if (!resp.ok) return null;
      const data = await resp.json();
      if (data.code !== 0 || !data.data) return null;
      const d = data.data;
      // 讯飞返回总分与准确度/流利度/完整度
      const total = d.total_score || 0;
      let stars = 1, text, detail;
      if (total >= 85) { stars = 3; text = '说得真好！'; }
      else if (total >= 60) { stars = 2; text = '不错！再顺一遍更棒'; }
      else { stars = 1; text = '没关系，再听一遍原音试试'; }
      detail = `准确度 ${d.accuracy_score || '-'} · 流利度 ${d.fluency_score || '-'} · 完整度 ${d.completeness_score || '-'}`;
      return { stars, score: Math.round(total), detail, text, from: 'xfyun' };
    } catch (e) {
      return null;
    }
  }

  /**
   * 【iPhone/安卓通用】WAV 录音器
   * 原理：getUserMedia + AudioContext 直采原始音频（iOS Safari 不支持
   * SpeechRecognition，但支持这种方式），录完转 16kHz 16bit 单声道 WAV，
   * 交给云端代理（讯飞口语评测）打分。
   */
  const WavRecorder = {
    supported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia &&
      (window.AudioContext || window.webkitAudioContext)),
    running: false,
    _ctx: null, _stream: null, _src: null, _proc: null, _chunks: [],

    async start() {
      if (this.running) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      this._stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: false, noiseSuppression: false }
      });
      this._ctx = new AC();
      // iOS 需要在用户手势内 resume
      if (this._ctx.state === 'suspended') await this._ctx.resume();
      this._src = this._ctx.createMediaStreamSource(this._stream);
      // ScriptProcessorNode 虽已标记废弃，但 iOS Safari 至今只支持它，稳妥
      this._proc = this._ctx.createScriptProcessor(4096, 1, 1);
      this._chunks = [];
      this._proc.onaudioprocess = (e) => {
        this._chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };
      // iOS 上必须连到 destination 才会触发回调
      this._src.connect(this._proc);
      this._proc.connect(this._ctx.destination);
      this.running = true;
    },

    /** 停止录音，返回 { wavBase64, duration } */
    async stop() {
      this.running = false;
      if (this._proc) { try { this._proc.disconnect(); } catch (e) { /* ignore */ } this._proc.onaudioprocess = null; }
      if (this._src) { try { this._src.disconnect(); } catch (e) { /* ignore */ } }
      if (this._stream) { this._stream.getTracks().forEach(t => t.stop()); }
      const rate = this._ctx ? this._ctx.sampleRate : 48000;
      if (this._ctx) { try { this._ctx.close(); } catch (e) { /* ignore */ } this._ctx = null; }

      // 合并 chunks
      let len = 0;
      this._chunks.forEach(c => len += c.length);
      const merged = new Float32Array(len);
      let off = 0;
      this._chunks.forEach(c => { merged.set(c, off); off += c.length; });
      this._chunks = [];

      if (!len) throw new Error('没有录到声音，请再试一次');

      // 降采样到 16kHz（讯飞要求）
      const target = 16000;
      let pcm = merged;
      if (rate !== target) {
        const ratio = rate / target;
        const newLen = Math.floor(len / ratio);
        const out = new Float32Array(newLen);
        for (let i = 0; i < newLen; i++) {
          const start = Math.floor(i * ratio);
          const end = Math.min(len, Math.floor((i + 1) * ratio));
          let sum = 0;
          for (let j = start; j < end; j++) sum += merged[j];
          out[i] = sum / (end - start || 1);
        }
        pcm = out;
      }

      // Float32 → Int16
      const int16 = new Int16Array(pcm.length);
      for (let i = 0; i < pcm.length; i++) {
        const s = Math.max(-1, Math.min(1, pcm[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // 加 WAV 头
      const buf = new ArrayBuffer(44 + int16.length * 2);
      const v = new DataView(buf);
      const writeStr = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
      writeStr(0, 'RIFF'); v.setUint32(4, 36 + int16.length * 2, true); writeStr(8, 'WAVE');
      writeStr(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
      v.setUint32(24, target, true); v.setUint32(28, target * 2, true);
      v.setUint16(32, 2, true); v.setUint16(34, 16, true);
      writeStr(36, 'data'); v.setUint32(40, int16.length * 2, true);
      for (let i = 0; i < int16.length; i++) v.setInt16(44 + i * 2, int16[i], true);

      // ArrayBuffer → base64（分段拼接，避免栈溢出）
      const bytes = new Uint8Array(buf);
      let bin = '';
      const STEP = 0x8000;
      for (let i = 0; i < bytes.length; i += STEP) {
        bin += String.fromCharCode.apply(null, bytes.subarray(i, i + STEP));
      }
      return {
        wavBase64: btoa(bin),
        duration: pcm.length / target
      };
    },

    abort() {
      this.running = false;
      if (this._proc) { try { this._proc.disconnect(); } catch (e) { /* ignore */ } this._proc.onaudioprocess = null; }
      if (this._src) { try { this._src.disconnect(); } catch (e) { /* ignore */ } }
      if (this._stream) { this._stream.getTracks().forEach(t => t.stop()); }
      if (this._ctx) { try { this._ctx.close(); } catch (e) { /* ignore */ } this._ctx = null; }
      this._chunks = [];
    }
  };

  /**
   * 云端打分（讯飞口语评测，经自建代理）。
   * 代理约定：POST { text, audioBase64 } → { code:0, data:{ total_score, accuracy_score, fluency_score, integrity_score } }
   */
  async function proxyScore(sentence, wavBase64, proxyUrl) {
    let resp;
    try {
      resp = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sentence.en, audioBase64: wavBase64 })
      });
    } catch (e) {
      throw new Error('连不上打分服务，请检查网络或服务地址');
    }
    if (!resp.ok) throw new Error('打分服务返回 ' + resp.status + '，请检查服务配置');
    const data = await resp.json();
    if (data.code !== 0 || !data.data) {
      throw new Error(data.message || '打分服务返回错误');
    }
    const d = data.data;
    const total = Math.round(Number(d.total_score) || 0);
    const norm = (x) => (x == null ? '-' : Math.round(Number(x) * 20)); // 讯飞英文 5 分制 → 百分制
    let stars, text;
    if (total >= 85) { stars = 3; text = pick(['说得真好！', '发音很标准！', '太棒了，就是这样！']); }
    else if (total >= 60) { stars = 2; text = pick(['不错！再顺一遍更棒', '很好，发音越来越好了', '继续加油，快满分啦']); }
    else { stars = 1; text = pick(['没关系，再听一遍原音试试', '慢慢来，第一个词先读对', '不着急，跟着原音读一遍']); }
    return {
      stars,
      score: total,
      text,
      detail: `准确度 ${norm(d.accuracy_score)} · 流利度 ${norm(d.fluency_score)} · 完整度 ${norm(d.integrity_score)}`,
      from: 'cloud'
    };
  }

  /** 统一入口：开始一次跟读打分 */
  function startPractice(opts) {
    let finalText = '';
    Recognizer.start({
      onResult(r) {
        if (r.final) finalText += r.final;
        opts.onResult && opts.onResult({ interim: r.interim, final: finalText });
      },
      onEnd() {
        opts.onDone && opts.onDone(finalText);
      },
      onError(err) {
        opts.onError && opts.onError(err);
      }
    });
  }

  window.Scorer = {
    Recognizer,
    WavRecorder,
    matchScore,
    xfyunScore,
    proxyScore,
    startPractice,
    supported: Recognizer.supported
  };
})();
