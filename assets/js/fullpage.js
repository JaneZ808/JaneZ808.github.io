/* ==========================================================================
   NOVA · FULLPAGE —— 板块间叠化，板块内原生滚动
   --------------------------------------------------------------------------
   参考站 #worldview 的主 Swiper：effect:'fade' / speed:1000 /
   wrapper transform:none，各屏靠 opacity 叠化，无位移。

   但「板块」才是内容单位：正式专辑有 7 张卡片、高 2.25 屏，
   把板块内部也拆成翻页停点会让同一个板块被反复遮蔽打断。
   因此：
     · 板块内部  -> 完全交还浏览器原生滚动，零脚本动画
     · 板块边界  -> 一次整屏叠化（旧屏淡出+模糊 → 全遮蔽瞬间换位 → 淡入）
     · 分页器     -> 一个板块一个点，板块内滚动不改变当前板块
     · 入场编排   -> 只在跨板块时播一次，板块内沿用 main.js 的观察器

   保留真实文档滚动作为位置状态 => 竖排歌词 / HUD / BGM / 回顶等 fixed
   控件、IntersectionObserver 入场、滚动进度条、锚点、SEO 全部原样工作。
   只作用于 index.html，窄屏与 reduced-motion 自动降级；无第三方依赖。
   ========================================================================== */
(function () {
  'use strict';

  var DOC = document.documentElement;
  /* 页脚顶部超过文档最大滚动位置，无法单独成屏，归入 contact 板块 */
  var SECTION_IDS = ['hero', 'profile', 'music', 'contact'];
  var LABEL = {
    hero: '序 / HERO',
    profile: '个人档案 / PROFILE',
    music: '正式专辑 / MUSIC',
    contact: '聆听与关注 / CONTACT'
  };
  var VEIL_LABEL = {
    hero: 'JANE ZHANG',
    profile: 'PROFILE',
    music: 'STUDIO ALBUMS',
    contact: 'LISTEN & FOLLOW'
  };

  var FADE_OUT = 400;      // 旧屏淡出 + 模糊
  var FADE_IN  = 600;      // 新屏淡入
  var SPEED    = 1000;     // 与 Swiper speed:1000 对齐
  var COOLDOWN = 140;      // 转场结束后的静默期，防触控板连发
  var EDGE     = 4;        // 边界容差（px）
  var GAP_MIN  = 8;        // 板块 top 去重阈值

  var sections = [], cur = 0, on = false;
  var vh = 0, docMax = 0;
  var animating = false, lockUntil = 0, timers = [];
  var nav, dots, nowEl, totalEl, labelEl, veil, veilText, veilNo, wipe;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function byId(s) { return document.getElementById(s); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function active() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && window.innerWidth >= 1024
      && !!byId('hero');
  }

  /* ---------- 板块区间：一个板块 = 一个叠化屏 ---------- */
  function measure() {
    vh = window.innerHeight;
    docMax = Math.max(0, DOC.scrollHeight - vh);
    var raw = [];
    SECTION_IDS.forEach(function (id) {
      var el = byId(id);
      if (!el) return;
      raw.push({
        id: id, key: id, el: el,
        top: clamp(el.getBoundingClientRect().top + window.scrollY, 0, docMax),
        h: el.offsetHeight
      });
    });
    raw.sort(function (a, b) { return a.top - b.top; });

    sections = [];
    raw.forEach(function (s) {
      if (!sections.length || s.top - sections[sections.length - 1].top > GAP_MIN) sections.push(s);
    });

    sections.forEach(function (s, i) {
      /* 板块下界 = 下一板块顶部；最后一个板块延伸到文档底部（含分享条与页脚） */
      s.bottom = (i + 1 < sections.length) ? sections[i + 1].top : DOC.scrollHeight;
      /* 板块内可滚到的最大 scrollY：视口底对齐板块底 */
      s.maxInside = clamp(Math.min(s.top + s.h - vh, s.bottom - vh, docMax), s.top, docMax);
    });
  }

  function sectionAt(y) {
    var i = 0;
    for (var n = 0; n < sections.length; n++) {
      if (y >= sections[n].top - 1) i = n;
    }
    return i;
  }

  /* 板块内部是否还有原生滚动余量 */
  function insideRoom(dir) {
    var s = sections[cur];
    if (!s) return false;
    var y = window.scrollY;
    return dir > 0 ? (y < s.maxInside - EDGE) : (y > s.top + EDGE);
  }

  /* ---------- 分页器 ---------- */
  function renderDots() {
    if (!dots) return;
    dots.textContent = '';
    sections.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fp-dot';
      b.setAttribute('aria-label', '跳转到第 ' + (i + 1) + ' 个板块：' + LABEL[s.key]);
      b.title = LABEL[s.key];
      b.addEventListener('click', function () { go(i); });
      dots.appendChild(b);
    });
    if (totalEl) totalEl.textContent = pad(sections.length);
  }

  function updateUI(noWipe) {
    if (!nav) return;
    var list = dots ? dots.children : [];
    for (var i = 0; i < list.length; i++) {
      list[i].classList.toggle('on', i === cur);
      list[i].setAttribute('aria-current', i === cur ? 'true' : 'false');
    }
    if (nowEl) nowEl.textContent = pad(cur + 1);
    if (labelEl) labelEl.textContent = LABEL[sections[cur] ? sections[cur].key : 'hero'];
    DOC.setAttribute('data-fp-index', String(cur + 1));
    if (!noWipe && wipe) {
      wipe.classList.remove('run');
      void wipe.offsetWidth;
      wipe.classList.add('run');
    }
  }

  /* ---------- 入场编排：只在跨板块时播一次 ---------- */
  var lastEnter = null;
  function reveal(el) {
    if (!el) return;
    if (lastEnter && lastEnter !== el) lastEnter.classList.remove('fp-enter');
    el.classList.remove('fp-enter');
    void el.offsetWidth;
    el.classList.add('in', 'fp-enter');
    var nodes = el.querySelectorAll('.reveal, .album-card, .sec-enter, .rl-left, .rl-right');
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('in');
    lastEnter = el;
  }

  /* ---------- 核心：板块之间整屏叠化，零可见位移 ---------- */
  function go(target, instant) {
    if (!on || !sections.length) return;
    target = clamp(target, 0, sections.length - 1);
    var from = cur;
    if (target === from && !instant) return;
    clearTimers();

    cur = target;
    var s = sections[target];
    var to = s.top;
    /* 反向回到超高板块时落在板块末端，来回浏览保持连续 */
    if (!instant && target < from && s.maxInside > s.top + EDGE) to = s.maxInside;
    to = clamp(to, 0, docMax);

    /* 瞬时模式（初始化 / resize）：直接换位，不播转场 */
    if (instant || !veil || Math.abs(to - window.scrollY) < 2) {
      window.scrollTo({ top: to, behavior: 'instant' });
      updateUI(true);
      reveal(s.el);
      animating = false;
      lockUntil = performance.now() + COOLDOWN;
      return;
    }

    animating = true;
    if (veilText) veilText.textContent = VEIL_LABEL[s.key] || '';
    if (veilNo) veilNo.textContent = pad(target + 1) + ' / ' + pad(sections.length);
    updateUI(true);
    veil.classList.remove('fp-veil-in', 'fp-veil-out');
    void veil.offsetWidth;
    veil.classList.add('fp-veil-in');
    DOC.classList.add('fp-fading');

    later(function () {
      window.scrollTo({ top: to, behavior: 'instant' });
      veil.classList.remove('fp-veil-in');
      veil.classList.add('fp-veil-out');
      DOC.classList.remove('fp-fading');
      reveal(s.el);
    }, FADE_OUT);

    later(function () {
      veil.classList.remove('fp-veil-in', 'fp-veil-out');
      animating = false;
      lockUntil = performance.now() + COOLDOWN;
    }, SPEED);
  }

  function busy() { return animating || performance.now() < lockUntil; }

  /* ---------- 输入 ---------- */
  function onWheel(e) {
    if (!on || e.ctrlKey) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (e.target && e.target.closest && e.target.closest('.fp-scrollable')) return;
    if (animating) { e.preventDefault(); return; }   /* 叠化期间冻结文档，保证换位稳定 */
    if (Math.abs(e.deltaY) < 2) return;
    var dir = e.deltaY > 0 ? 1 : -1;
    if (insideRoom(dir)) return;                     /* 板块内：完全放行原生滚动 */
    e.preventDefault();                             /* 板块边界：接管为一次叠化 */
    if (busy()) return;
    go(cur + dir);
  }

  function keyStep(dir) {
    if (busy()) return;
    if (insideRoom(dir)) {
      window.scrollBy(0, dir * Math.round(vh * .82));   /* 板块内：正常滑动 */
      return;
    }
    go(cur + dir);                                      /* 板块边界：叠化 */
  }

  function onKey(e) {
    if (!on) return;
    var t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    var k = e.key;
    if (k === 'ArrowDown' || k === 'PageDown' ||
        (k === ' ' && (!t || !/^(BUTTON|A)$/.test(t.tagName)))) {
      e.preventDefault(); keyStep(1);
    } else if (k === 'ArrowUp' || k === 'PageUp') {
      e.preventDefault(); keyStep(-1);
    } else if (k === 'Home') {
      e.preventDefault(); go(0);
    } else if (k === 'End') {
      e.preventDefault(); go(sections.length - 1);
    }
  }

  var touchY = 0, touchX = 0;
  function onTouchStart(e) {
    touchY = e.touches[0].clientY;
    touchX = e.touches[0].clientX;
  }
  function onTouchMove(e) {
    if (!on || animating) return;
    var cy = e.touches[0].clientY;
    if (Math.abs(e.touches[0].clientX - touchX) > Math.abs(cy - touchY)) return;
    var dir = (touchY - cy) > 0 ? 1 : -1;
    if (insideRoom(dir)) return;                     /* 板块内：原生滚动 */
    if (e.cancelable) e.preventDefault();            /* 板块边界：交给 touchend 叠化 */
  }
  function onTouchEnd(e) {
    if (!on || busy()) return;
    var dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 46) return;
    var dir = dy > 0 ? 1 : -1;
    if (insideRoom(dir)) return;                     /* 板块内的滑动已经交给原生 */
    go(cur + dir);
  }

  function onClickCapture(e) {
    if (!on) return;
    if (e.target && e.target.closest && e.target.closest('#toTop')) {
      e.preventDefault(); e.stopPropagation(); go(0); return;
    }
    var a = e.target && e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var h = a.getAttribute('href');
    if (!h || h.length < 2 || h === '#') return;
    var target = byId(h.slice(1));
    if (!target) return;
    e.preventDefault(); e.stopPropagation();
    var i = 0;
    for (var n = 0; n < sections.length; n++) {
      if (sections[n].el === target) { i = n; break; }
    }
    go(i);
  }

  /* 原生滚动时只静默同步「当前板块」，不播任何动画 */
  function onScroll() {
    if (!on || animating || !sections.length) return;
    var i = sectionAt(window.scrollY);
    if (i !== cur) { cur = i; updateUI(true); }
  }

  /* ---------- 生命周期 ---------- */
  var rt = 0;
  function rebuild() {
    measure();
    renderDots();
    onScroll();
    updateUI(true);
  }
  function debounceRebuild() {
    clearTimeout(rt);
    rt = setTimeout(rebuild, 180);
  }

  function init() {
    nav = byId('fpNav');
    dots = byId('fpDots');
    nowEl = byId('fpNow');
    totalEl = byId('fpTotal');
    labelEl = byId('fpLabel');
    wipe = byId('fpWipe');
    veil = byId('fpVeil');
    veilText = byId('fpVeilText');
    veilNo = byId('fpVeilNo');
    if (!nav || !active()) return;

    on = true;
    DOC.classList.add('fp-on');
    rebuild();

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClickCapture, true);
    window.addEventListener('resize', debounceRebuild);
    window.addEventListener('load', function () { setTimeout(rebuild, 260); });
    setTimeout(rebuild, 1400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
