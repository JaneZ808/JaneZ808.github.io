/* ============================================================
 *  张靓颖 Jane Zhang · 资料站 — 数据桥接（纯静态，无账号）
 *  主页 main.js 渲染时通过本模块读取数据。
 *  内容全部内置在 data.js；要改内容/文案，直接编辑 data.js 源码。
 *  无登录注册、无管理端、无本地覆盖——所见即源码。
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- 内置数据（全部来自 data.js 全局常量） ---------- */
  function getMerged() {
    return {
      EVENT_THEME, PROFILE, NEWS, TIMELINE, ALBUMS, OSTS, GLOBAL_SONGS,
      TOURS, AWARDS, SCREENS, VARIETY, GALLERY, PLATFORMS
    };
  }

  /* ---------- 界面默认值（无管理端，统一用默认主题） ---------- */
  const UI_DEFAULTS = {
    theme: null,
    accent: '',
    fontScale: 100,
    visibleSections: {},
    texts: {}
  };
  function getUiMerged() {
    return Object.assign({}, UI_DEFAULTS);
  }

  window.JANEZ_DATA = {
    getMerged, getUiMerged,
    UI_DEFAULTS
  };
})();
