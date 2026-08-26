/**
 * js/auth.js - 用户认证（Supabase）
 *
 * - 用户名 + 密码注册/登录（密码由 Supabase 服务端 bcrypt 加盐哈希存储）
 * - JWT 会话由 SDK 自动持久化到 localStorage，刷新/重开浏览器保持登录
 * - 未配置 SUPABASE_CONFIG 时，Auth.ready() 返回 false，应用回退为「单机模式」
 */
const Auth = (function () {
  const cfg = typeof SUPABASE_CONFIG !== 'undefined' ? SUPABASE_CONFIG : { url: '', anonKey: '' };
  const configured = cfg && typeof cfg.url === 'string' && cfg.url.indexOf('http') === 0 && cfg.anonKey;

  let client = null;
  let currentUser = null;
  let listeners = [];

  if (configured && window.supabase) {
    client = window.supabase.createClient(cfg.url, cfg.anonKey);
  }

  /** 恢复已保存的会话（应用启动时调用） */
  async function init() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    currentUser = data && data.session ? data.session.user : null;
    return currentUser;
  }

  /** 监听登录状态变化（登录/登出/token 刷新都会触发） */
  function onAuthChange(cb) {
    if (!client) return;
    listeners.push(cb);
    client.auth.onAuthStateChange((_event, session) => {
      currentUser = session ? session.user : null;
      listeners.forEach(fn => fn(currentUser, _event));
    });
  }

  /** 注册：用户名 + 密码（需在 Supabase 后台开启 Username 登录方式） */
  async function register(username, password) {
    if (!client) return { error: '尚未配置 Supabase（见 README）' };
    const { data, error } = await client.auth.signUp({ username, password });
    if (error) return { error: friendly(error.message) };
    return { data };
  }

  /** 登录 */
  async function login(username, password) {
    if (!client) return { error: '尚未配置 Supabase（见 README）' };
    const { data, error } = await client.auth.signInWithPassword({ username, password });
    if (error) return { error: friendly(error.message) };
    return { data };
  }

  /** 退出登录 */
  async function logout() {
    if (client) await client.auth.signOut();
    currentUser = null;
  }

  function friendly(msg) {
    const m = String(msg || '');
    if (m.indexOf('Invalid login credentials') >= 0) return '用户名或密码不对，再试试';
    if (m.indexOf('already registered') >= 0 || m.indexOf('already exists') >= 0) return '这个用户名已经被注册了';
    if (m.indexOf('at least 6 characters') >= 0) return '密码至少要 6 位';
    if (m.indexOf('Username') >= 0 && m.indexOf('not enabled') >= 0) return '还没在 Supabase 后台开启「用户名登录」，见 README';
    return m;
  }

  return {
    ready: () => !!client,
    configured,
    user: () => currentUser,
    /** 当前用户名（优先 user_metadata，其次 email） */
    username: () => (currentUser && (currentUser.user_metadata && currentUser.user_metadata.username) || currentUser.email || '') || '',
    init,
    onAuthChange,
    register,
    login,
    logout,
    /** 底层 client（供 Store 云端同步用） */
    client: () => client
  };
})();
