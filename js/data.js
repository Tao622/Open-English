/**
 * js/data.js - 数据聚合层（网页版）
 *
 * 职责：
 * 1. 定义 CONTENT 课程查询接口（课程列表 / 单课 / 每日一句）
 * 2. 聚合 data-courses.js 的 30 节场景课程
 * 3. 定义场景中文名与底部导航
 */

const CONTENT = {
  version: '2.0.0',
  courses: {
    // 兼容旧版兜底：首课结构完整，其余由 COURSES_DATA 覆盖/补充
  },

  /** 课程展示列表 */
  getCourseList(scene) {
    const map = this.courses;
    let ids = Object.keys(map);
    if (scene && scene !== 'all') {
      ids = ids.filter(id => map[id].scene === scene);
    }
    ids.sort((a, b) => (map[a].day || 0) - (map[b].day || 0));
    return ids.map(id => ({
      id,
      title: map[id].title,
      icon: map[id].icon,
      scene: map[id].scene,
      day: map[id].day,
      duration: map[id].duration,
      coreSentence: map[id].coreSentence,
      sentenceCount: map[id].sentences.length
    }));
  },

  getCourse(id) {
    return this.courses[id] || null;
  },

  /** 每日一句（按天轮换，来自首课） */
  getDailySentence() {
    const day = new Date().getDate();
    const course = this.courses['restaurant-day01'];
    if (!course) return { en: 'Good morning!', cn: '早上好！' };
    const s = course.sentences[(day - 1) % course.sentences.length];
    return { en: s.en, cn: s.cn };
  }
};

/* ---------- 聚合 30 节场景课程内容包 ---------- */
if (typeof COURSES_DATA !== 'undefined') {
  Object.assign(CONTENT.courses, COURSES_DATA);
}

// 清理旧版占位课程（已由完整 30 课取代，场景体系不再包含 airport/directions）
['airport-day08', 'hotel-day15', 'directions-day22'].forEach(id => {
  delete CONTENT.courses[id];
});

/* ---------- 聚合 30 段慢速听力内容包 ---------- */
if (typeof LISTENING_DATA !== 'undefined') {
  CONTENT.listening = LISTENING_DATA;
} else {
  CONTENT.listening = {};
}

/** 听力列表 */
CONTENT.getListeningList = function () {
  const map = this.listening;
  return Object.keys(map)
    .map(id => ({
      id,
      title: map[id].title,
      icon: map[id].icon,
      scene: map[id].scene,
      day: map[id].day,
      duration: map[id].duration,
      sentenceCount: map[id].dialogue.length,
      wordCount: map[id].dialogue.reduce((sum, s) => sum + s.en.split(/\s+/).length, 0)
    }))
    .sort((a, b) => (a.day || 0) - (b.day || 0));
};

/** 单段听力 */
CONTENT.getListening = function (id) {
  return this.listening[id] || null;
};

/** 场景中文名（10 场景 + 全部） */
const SCENE_NAMES = {
  all: '全部',
  restaurant: '餐厅',
  hotel: '酒店',
  transport: '交通',
  shopping: '购物',
  social: '社交',
  bank: '银行',
  medical: '医疗',
  telecom: '通讯',
  help: '求助',
  life: '生活'
};

/**
 * 底部导航定义
 * 首页 = 今日任务汇总页；四大板块 = 词汇积累 / 慢速听力 / 场景课程 / 生词本
 */
const TABS = [
  { id: 'home', label: '首页', icon: '🏠' },
  { id: 'vocab', label: '词汇', icon: '📚' },
  { id: 'listening', label: '听力', icon: '👂' },
  { id: 'courses', label: '课程', icon: '💬' },
  { id: 'wordbook', label: '生词', icon: '📖' }
];
