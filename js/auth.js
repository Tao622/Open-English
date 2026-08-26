/**
 * js/auth.js - 用户认证（Supabase）
 *
 * - 用户名 + 密码注册/登录（用户名仅限字母/数字，如 xiaoying、13800001111）
 * - 系统自动补全为「用户名@user.local」存入 Supabase（.local 为保留域名，仅作账号身份证，无需真实邮箱）
 * - 密码由 Supabase 服务端 bcrypt 加盐哈希存储；JWT 会话自动持久化到 localStorage，刷新保持登录
 * - 前提：Supabase 后台关闭邮件验证（Confirm email），否则注册后收不到确认信
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

  /**
   * 用户名格式校验：仅允许字母/数字（3-20 位），如 xiaoying、13800001111。
   * 校验通过后自动补全为「用户名@user.local」存进 Supabase——格式必然合法，
   * 而 .local 是保留域名、不真实存在，仅当「账号身份证」用。
   */
  function usernameLike(s) {
    return typeof s === 'string' && /^[A-Za-z0-9]{3,20}$/.test(s.trim());
  }

  /** 用户名 → Supabase 邮箱格式（无需真实邮箱） */
  function toEmail(username) {
    return username.trim().toLowerCase() + '@user.local';
  }

  /** 显示名：去掉自动补全的邮箱尾巴（妈妈看到的是自己填的用户名） */
  function displayName(u) {
    if (!u) return '';
    const name = (u.user_metadata && u.user_metadata.username) || u.email || '';
    return String(name).split('@')[0];
  }

  /** 注册：用户名 + 密码（密码由 Supabase 服务端 bcrypt 加盐哈希存储） */
  async function register(username, password) {
    if (!client) return { error: '尚未配置 Supabase（见 README）' };
    if (!usernameLike(username)) return { error: '用户名只能由字母或数字组成（3-20 位），如 xiaoying、13800001111' };
    const name = username.trim();
    const { data, error } = await client.auth.signUp({
      email: toEmail(name),
      password,
      options: { data: { username: name } }
    });
    if (error) return { error: friendly(error.message) };
    return { data };
  }

  /** 登录 */
  async function login(username, password) {
    if (!client) return { error: '尚未配置 Supabase（见 README）' };
    if (!usernameLike(username)) return { error: '用户名只能由字母或数字组成（3-20 位），如 xiaoying、13800001111' };
    const { data, error } = await client.auth.signInWithPassword({ email: toEmail(username), password });
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
    if (m.indexOf('already registered') >= 0 || m.indexOf('already exists') >= 0) return '这个用户名已经被注册了，换一个试试';
    if (m.indexOf('at least 6 characters') >= 0) return '密码至少要 6 位';
    return m;
  }

  return {
    ready: () => !!client,
    configured,
    user: () => currentUser,
    /** 当前账号名（用户名） */
    username: () => displayName(currentUser),
    init,
    onAuthChange,
    register,
    login,
    logout,
    /** 底层 client（供 Store 云端同步用） */
    client: () => client
  };
})();
