/**
 * js/data-vocab.js - 词汇聚合层
 * 聚合 data-vocab-a/b/c.js（Day 1-30，共 600 词），提供：
 *  - 按天取词 getDay(day)
 *  - 四选一选项生成 makeOptions(word, day)：正确项 + 3 个同主题干扰项，顺序打乱
 *  - 全量词表 allWords()（生词本复习 / 搜索用）
 */

const Vocab = (function () {
  'use strict';

  // 聚合 30 天词汇
  const DAYS = Object.assign({}, VOCAB_PART_A, VOCAB_PART_B, VOCAB_PART_C);

  function getDay(day) {
    return DAYS[day] || null;
  }

  function days() {
    return Object.keys(DAYS).map(Number).sort((a, b) => a - b);
  }

  /** 洗牌（Fisher-Yates） */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /** 词的完整中文释义（多词性合并，如 "v. 介绍；引见" / "n. 愉快；荣幸"） */
  function cnOf(word) {
    return word.defs.map(d => `${d.p} ${d.c}`).join('  ');
  }

  /** 简短中文释义（选项用，不含词性，如 "介绍；引见"） */
  function cnShort(word) {
    return word.defs.map(d => d.c).join('；');
  }

  /**
   * 生成四选一选项
   * @param {object} word 目标词
   * @param {number} day  所在天（用于同主题干扰项）
   * @returns {{ options: string[], correct: string, correctIndex: number }}
   */
  function makeOptions(word, day) {
    const correct = cnShort(word);
    const pool = [];
    const dayData = getDay(day);

    // 1. 同主题干扰项优先（同一天的其他词）
    if (dayData) {
      dayData.words.forEach(w => {
        if (w.en !== word.en && pool.indexOf(cnShort(w)) === -1) pool.push(cnShort(w));
      });
    }
    // 2. 同主题不足则从全局补（防止选项重复/不足 3 个）
    if (pool.length < 3) {
      const seen = {};
      pool.forEach(p => { seen[p] = true; });
      days().forEach(d => {
        const dd = getDay(d);
        if (!dd || d === day) return;
        for (let i = 0; i < dd.words.length && pool.length < 3; i++) {
          const c = cnShort(dd.words[i]);
          if (!seen[c]) { seen[c] = true; pool.push(c); }
        }
      });
    }

    const wrongs = shuffle(pool).slice(0, 3);
    const options = shuffle([correct].concat(wrongs));
    return {
      options,
      correct,
      correctIndex: options.indexOf(correct)
    };
  }

  /** 全量词表（含 day / topic 标记） */
  function allWords() {
    const list = [];
    days().forEach(d => {
      const dd = getDay(d);
      dd.words.forEach(w => list.push(Object.assign({ day: d, topic: dd.topic }, w)));
    });
    return list;
  }

  /** 按英文精确查词 */
  function find(en) {
    const key = String(en).toLowerCase();
    const list = allWords();
    for (let i = 0; i < list.length; i++) {
      if (list[i].en.toLowerCase() === key) return list[i];
    }
    return null;
  }

  return { getDay, days, makeOptions, cnOf, cnShort, allWords, find, shuffle };
})();
