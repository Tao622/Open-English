/**
 * score-proxy - 口语打分代理云函数（腾讯云函数 SCF / 微信云开发 CloudBase 通用）
 *
 * 作用：
 *   前端录音(WAV) → 本函数 → 讯飞语音评测(流式版) → 返回准确度/流利度/完整度
 *   讯飞密钥只存在云函数环境变量里，不会暴露在网页上。
 *
 * 环境变量（部署后在云函数配置里填）：
 *   XFYUN_APPID      讯飞开放平台 AppID
 *   XFYUN_APIKEY     讯飞 APIKey
 *   XFYUN_APISECRET  讯飞 APISecret
 *
 * 接口约定：
 *   POST JSON { text: '英文句子', audioBase64: 'WAV 文件 base64' }
 *   → { code: 0, data: { total_score, accuracy_score, fluency_score, integrity_score } }
 *   出错 → { code: 1, message: '错误说明' }
 */

const crypto = require('crypto');
const WebSocket = require('ws');

const HOST_URL = 'wss://ise-api.xfyun.cn/v2/open-ise';
const FRAME_SIZE = 1280;      // 讯飞建议 40ms 一帧（16k*16bit ≈ 1280 字节）
const FRAME_INTERVAL = 40;    // 发帧间隔 ms

/* ---------- 讯飞鉴权 URL ---------- */
function getAuthUrl(apiKey, apiSecret) {
  const u = new URL(HOST_URL);
  const date = new Date().toUTCString();
  const signatureOrigin = `host: ${u.host}\ndate: ${date}\nGET ${u.pathname} HTTP/1.1`;
  const signatureSha = crypto.createHmac('sha256', apiSecret).update(signatureOrigin).digest('base64');
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;
  const authorization = Buffer.from(authorizationOrigin).toString('base64');
  return `${HOST_URL}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${u.host}`;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ---------- 调讯飞语音评测 ---------- */
async function evaluate(appid, apiKey, apiSecret, text, audioBuffer) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, arg) => { if (!settled) { settled = true; clearTimeout(timer); try { ws.close(); } catch (e) {} fn(arg); } };

    const ws = new WebSocket(getAuthUrl(apiKey, apiSecret));
    const timer = setTimeout(() => finish(reject, new Error('评测超时，请重试')), 30000);

    ws.on('open', async () => {
      try {
        // 第一帧：业务参数 + 试题文本
        ws.send(JSON.stringify({
          common: { app_id: appid },
          business: {
            sub: 'ise',
            ent: 'en_vip',            // 英文
            category: 'read_sentence', // 句子朗读
            aue: 'raw',                // 音频格式：未压缩 PCM/WAV
            tte: 'utf-8',
            ttp_skip: true,
            cmd: 'ssb'
          },
          data: {
            status: 0,
            text: Buffer.from(text, 'utf8').toString('base64')
          }
        }));
        await sleep(FRAME_INTERVAL);

        // 音频帧
        for (let off = 0; off < audioBuffer.length; off += FRAME_SIZE) {
          const chunk = audioBuffer.subarray(off, off + FRAME_SIZE);
          const isLast = off + FRAME_SIZE >= audioBuffer.length;
          ws.send(JSON.stringify({
            data: {
              status: isLast ? 2 : 1,
              audio: chunk.toString('base64')
            }
          }));
          await sleep(FRAME_INTERVAL);
        }
        // 兜底结束帧（音频恰好整帧时上面最后一帧已带 status=2，这里幂等）
        ws.send(JSON.stringify({ data: { status: 2, audio: '' } }));
      } catch (e) {
        finish(reject, e);
      }
    });

    let resultXml = '';
    ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw.toString()); } catch (e) { return; }
      if (msg.code !== 0) {
        return finish(reject, new Error(`讯飞返回错误 ${msg.code}: ${msg.message || ''}`));
      }
      const d = msg.data || {};
      if (d.data) resultXml += Buffer.from(d.data, 'base64').toString('utf8');
      if (d.status === 2) {
        finish(resolve, resultXml);
      }
    });

    ws.on('error', (e) => finish(reject, new Error('无法连接讯飞服务：' + e.message)));
  });
}

/* ---------- 解析讯飞结果 XML（英文评测分数为 5 分制） ---------- */
function parseScores(xml) {
  const pick = (name) => {
    const m = xml.match(new RegExp(name + '="([\\d.]+)"'));
    return m ? parseFloat(m[1]) : null;
  };
  return {
    total_score: pick('total_score'),
    accuracy_score: pick('accuracy_score'),
    fluency_score: pick('fluency_score'),
    integrity_score: pick('integrity_score')
  };
}

/* ---------- HTTP 响应封装（带 CORS，浏览器才能直接调） ---------- */
function httpResp(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  };
}

/* ---------- 入口（SCF 与 CloudBase 云接入兼容） ---------- */
async function handle(event) {
  // 浏览器跨域预检
  const method = (event.httpMethod || event.method || 'POST').toUpperCase();
  if (method === 'OPTIONS') return httpResp(204, '');

  // 解析请求体（云接入/网关给的是字符串，本地测试可能直接给对象）
  let body = event.body || event;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      return httpResp(200, { code: 1, message: '请求体不是合法 JSON' });
    }
  }

  const { text, audioBase64 } = body || {};
  if (!text || !audioBase64) {
    return httpResp(200, { code: 1, message: '缺少 text 或 audioBase64 参数' });
  }

  const appid = process.env.XFYUN_APPID;
  const apiKey = process.env.XFYUN_APIKEY;
  const apiSecret = process.env.XFYUN_APISECRET;
  if (!appid || !apiKey || !apiSecret) {
    return httpResp(200, { code: 1, message: '云函数未配置讯飞密钥，请在环境变量里填 XFYUN_APPID / XFYUN_APIKEY / XFYUN_APISECRET' });
  }

  try {
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    if (audioBuffer.length < 1000) {
      return httpResp(200, { code: 1, message: '录音太短，请说完再点「说完了」' });
    }
    // WAV 头（44 字节）直接跳过，讯飞要纯 PCM
    let pcm = audioBuffer;
    if (audioBuffer.length > 44 && audioBuffer[0] === 0x52 && audioBuffer[1] === 0x49) {
      pcm = audioBuffer.subarray(44);
    }
    const xml = await evaluate(appid, apiKey, apiSecret, text, pcm);
    const scores = parseScores(xml);
    if (scores.total_score == null) {
      return httpResp(200, { code: 1, message: '没听清你读的内容，靠近麦克风再试一次' });
    }
    return httpResp(200, { code: 0, data: scores });
  } catch (e) {
    return httpResp(200, { code: 1, message: e.message || '评测失败，请重试' });
  }
}

// 腾讯云函数 SCF 入口
exports.main_handler = handle;
// 微信云开发 / CloudBase 云函数入口
exports.main = handle;

module.exports = { main_handler: exports.main_handler, main: exports.main };
