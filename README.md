# 笑小英口语练习 · 网页版 v2.0

面向"会一点单词但不敢开口、听力困难"人群的英语开口练习 H5，纯静态零依赖，浏览器打开即用。
由微信小程序版改造而来，语音能力不再依赖微信插件，个人主体零门槛。

**v2.0 新架构**：首页 = 今日任务汇总；底部四大板块 = 词汇积累 / 慢速听力 / 场景课程 / 生词本。
30 天学习闭环：每天 1 节场景课程 + 背单词（默认 20 个，可自设 5-50），双任务完成即可打卡。

## 快速开始

**本地预览**（任选其一）：

```bash
# 方式一：Python
cd open-english-web
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765

# 方式二：Node
cd open-english-web
npx serve .
```

**部署上线**：整个 `open-english-web/` 目录是纯静态文件，可部署到任何静态托管（GitHub Pages / CloudStudio / 腾讯云 COS / 任意服务器）。

## 功能清单（v2.0）

| 板块 | 功能 |
|---|---|
| 登录/注册 | 用户名+密码注册登录（bcrypt 加盐哈希），登录后进度云端同步，顶部显示用户名+退出 |
| 首页 | 今日任务汇总：场景课程 ≥1 节 + 单词今日目标（默认 20，可自设）双进度，双完成可打卡 |
| 词汇积累 | **不背单词式流程**：英文 + 4 个中文选项 → 选对进待复习 / 选错进未掌握 → 无论对错都展示详细解释（音标、全部词性词义、例句）→ 学习穿插历史未掌握词 → 无未掌握时打乱选项最终复习 → **中译英**（看中文、听发音、开口说、机器判分）→ 每词可加入生词本 |
| 慢速听力 | 30 段 80-120 词长对话，主题与课程刻意错位（值机/海关/超市/药店等）；**三步法**：盲听 → 英文字幕 → 中英对照；逐句播放、点句重听、**轻点任意英文单词加入生词本** |
| 场景课程 | 30 节完整礼貌句型（面向有英语基础者），每节 5-7 句，跟读录音 + 机器打分（星级+鼓励语） |
| 生词本 | 学习/听力中收藏的词集中管理，一键开始 10 题四选一复习 |
| 小英老师 | 对话式 AI：查词给单词卡、翻译、讲语法；可加生词本 |
| 打卡 | 课程+单词双完成触发打卡：连续天数、本周星星 |
| 我的 | 学习统计（掌握/待复习/开口句数/课程/听力/生词）、设置（今日目标、打分地址、AI Key） |

**词汇内容**：30 天 × 20 词 = 600 词，四级词汇精选，偏向旅行/日常交流场景。

## 用户注册登录（可选，推荐开启）

登录后**学习进度自动同步到云端**，每个账号只看到自己的进度，换手机/换浏览器登录同一账号即可恢复。

> 不配置也可以直接用（单机模式），但进度只存本机浏览器，清缓存会丢。

**配置步骤（约 10 分钟，全程网页操作）：**

1. 注册 [supabase.com](https://supabase.com)（免费，500MB 数据库 + 5 万月活足够家用）→ 新建项目，
   记下区域选离你近的（如 `Singapore` / `ap-southeast-1`），等 1-2 分钟项目创建完成
2. 左侧菜单 **Authentication → Sign In / Up**，把 **Username** 登录方式**开启**
3. 左侧菜单 **Project Settings → API**，复制 **Project URL** 和 **anon public key**
4. 打开 `js/config.js`，把两个值填进引号里：

```js
const SUPABASE_CONFIG = {
  url: 'https://你的项目.supabase.co',
  anonKey: 'eyJhbGciOi...（一大串）'
};
```

5. **建表**（放进度用）：左侧 **SQL Editor → New query**，粘贴 `supabase-setup.sql` 内容运行一次即可
6. 重新部署网页，打开即是登录页：注册 → 自动进入主界面；以后打开自动保持登录。

**说明**：
- 密码由 Supabase 服务端用 **bcrypt 加盐哈希**存储，数据库里没有明文密码，网页端也拿不到
- 登录状态用 **JWT token** 记住，SDK 自动持久化，刷新/重开浏览器不掉线
- 顶部会显示当前用户名和「退出登录」按钮
- 学习进度在每次操作后自动同步（防抖 0.8 秒），按账号隔离

## 机器打分说明

**iPhone 用户必看**：iPhone 所有浏览器都不支持浏览器语音识别，打分必须走下面的
「云端打分（讯飞）」方案；不配置时 iPhone 只能听原音跟读，无法打分。

**默认方案（开箱即用，仅安卓/Chrome）**：浏览器语音识别（Web Speech API）
+ 关键词宽松匹配 → 温和三档鼓励（★ 说得好 / ★★ 不错 / ★★★ 真棒）。
默认不显示具体分数，只显示星级和鼓励语，避免打击长辈信心（可在设置中改为显示分数）。

**云端打分（讯飞口语评测，iPhone 必配，安卓效果也更好）**：

1. 注册讯飞开放平台（xfyun.cn）→ 实名认证 → 领取语音评测免费额度
   （默认每天 500 次免费，新用户实名认证送 1 万次/年，个人练习足够）
2. 创建应用，拿到 `AppID / APIKey / APISecret` 三个密钥
3. 部署打分代理云函数（代码在 `score-proxy/` 目录）：
   - 腾讯云函数 SCF：控制台新建函数 → 运行环境 Node.js 16+ → 上传 `score-proxy` 目录
     （先 `npm install` 打包 zip，或直接用控制台"文件夹上传"）→ 触发器选 API 网关 → 拿到访问 URL
   - 或微信云开发 CloudBase：云函数 → 新建 → 上传 `score-proxy` → 开启"云接入"
   - 在函数环境变量里填：`XFYUN_APPID` / `XFYUN_APIKEY` / `XFYUN_APISECRET`
4. 打开网页 →「我的」→「设置」→「打分服务地址」粘贴云函数 URL → 保存

配置后打分升级为专业评测：**准确度 / 流利度 / 完整度**三维度（讯飞 5 分制换算百分制），
iPhone（Safari/Chrome 均可）和安卓都能用。

> 语音/录音需在 **https 或 localhost** 下访问（浏览器安全限制）。
> 密钥只存在云函数环境变量里，网页端只有代理地址，无泄露风险。

## 小英老师配置（可选，不配也能用）

未配置时使用内置"离线小英老师"（常用旅行词库 + 兜底回复）。
想要真正的 AI 对话：打开网页 →「我的」→「设置」，填入：

1. **API Key**：DeepSeek（deepseek.com 注册充值，几块钱能用很久）
2. **接口地址**：`https://api.deepseek.com/v1/chat/completions`（默认已填）
3. **模型名**：`deepseek-chat`（默认已填）

也支持通义千问（`https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`，模型 `qwen-turbo`）
或 OpenAI（`https://api.openai.com/v1/chat/completions`）。
Key 只存在浏览器 localStorage，不会上传。

## 数据与更新

内容已全量生产，**改内容无需改代码**：

- **场景课程 30 节**：`js/data-courses.js`（`COURSES_DATA`，场景：餐厅/酒店/交通/购物/社交/银行/医疗/通讯/求助/生活）
- **词汇 600 词（30 天 × 20）**：`js/data-vocab-a.js` / `b` / `c`（`VOCAB_PART_A/B/C`），由 `js/data-vocab.js`（`Vocab`）聚合，`makeOptions()` 自动生成四选一（同主题干扰项优先）
- **慢速听力 30 段**：`js/data-listening.js`（`LISTENING_DATA`，主题与课程刻意错位）
- **聚合层**：`js/data.js`（`CONTENT`）负责把内容包合入课程/听力查询接口

> ⚠️ **加载顺序（重要）**：`index.html` 中内容包脚本（data-courses / data-vocab-* / data-listening）
> 必须**在聚合层 `data.js` 之前**加载，否则课程/听力内容为空。新增内容包文件时注意插在 data.js 前面。

- 学习进度/打卡/生词本存浏览器 localStorage，登录后**同时自动同步到 Supabase 云端**（按账号隔离）。

## 打包成安卓 App（可选）

网页版跑通后，可用 [Capacitor](https://capacitorjs.com) 或 uni-app 将 `open-english-web` 打包成 APK：
`npm i -g @capacitor/cli && cap init && cap add android && cap sync`，然后 Android Studio 构建 APK，
直接发给家人安装（无需上架）。
iOS 不上架只能 TestFlight（99$/年，90 天需重签），更推荐 iPhone 上用"添加到主屏幕"。

## 文件结构

```
open-english-web/
├── index.html          入口（注意脚本加载顺序，见上）
├── icon.png            站点图标（小鸟）
├── css/style.css       全局样式（设计令牌：主绿 #2E9E6B 系列）
├── js/
│   ├── config.js       Supabase 部署配置（URL + anon key，部署时填）
│   ├── auth.js         用户认证（Supabase：注册/登录/登出/会话）
│   ├── data-courses.js     内容包：30 节场景课程
│   ├── data-vocab-a.js     内容包：词汇 Day 1-10
│   ├── data-vocab-b.js     内容包：词汇 Day 11-20
│   ├── data-vocab-c.js     内容包：词汇 Day 21-30
│   ├── data-vocab.js       词汇聚合层（Vocab：选项生成/查词/词表）
│   ├── data-listening.js   内容包：30 段慢速听力
│   ├── data.js             数据聚合层（CONTENT：课程/听力查询 + 导航定义）
│   ├── store.js        localStorage 状态管理 + 云端进度同步
│   ├── tts.js          浏览器朗读（三档语速）
│   ├── scorer.js       机器打分（浏览器识别 / WAV 录音 + 云端讯飞评测）
│   ├── ai.js           小英老师（在线 LLM / 离线兜底）
│   └── app.js          路由 + 全部页面 + 交互（v2.0 四板块）
├── supabase-setup.sql  Supabase 建表 SQL（用户进度表 + 行级安全策略）
└── score-proxy/        打分代理云函数（腾讯云函数/CloudBase 部署，见上文）
```
