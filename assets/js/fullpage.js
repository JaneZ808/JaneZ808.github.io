/* ==========================================================================
   NOVA · FULLPAGE —— 与参考站同款「滚轮一次切一屏」垂直翻页
   --------------------------------------------------------------------------
   设计要点：
   · 不搬动 DOM、不包 stage，用真实文档滚动 + rAF 自定义缓动驱动
     => position:fixed 的歌词条 / HUD / BGM / 回顶按钮全部原样工作
     => IntersectionObserver 入场、scroll 进度条、锚点、SEO 全部原样工作
   · 每个板块顶部是一个停点；超过 1.6 屏的板块额外补一个「底部停点」，
     保证 7 张专辑等长内容不会被翻页跳过
   · 只作用于 index.html（检测 #hero），窄屏与 reduced-motion 自动降级
   · 不引入任何第三方库，CSP script-src 'self' 可直接加载
   ========================================================================== */
(function () {
  'use strict';

  var DOC = document.documentElement;
  var IDS = ['hero', 'profile', 'music', 'contact'];
  var LABEL = {
    hero: '序 / HERO',
    profile: '个人档案 / PROFILE',
    music: '正式专辑 / MUSIC',
    contact: '聆听与关注 / CONTACT',
    footer: '资料归档 / ARCHIVE'
  };
  var SPEED = 900;          // 与 Swiper speed 同量级
  var COOLDOWN = 170;       // 动画结束后的静默期，防触控板连发
  var MIN_GAP = 80;         // 停点最小间距

  var stops = [], idx = 0, on = false;
  var animating = false, lockUntil = 0, raf = 0;
  var nav, dots, nowEl, totalEl, labelEl, wipe;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function q(s) { return document.querySelector(s); }
  function byId(s) { return document.getElementById(s); }
  function active() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && window.innerWidth >= 1024
      && !!byId('hero');
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- 停点计算 ---------- */
  function buildStops(silent) {
    var vh = window.innerHeight;
    var max = Math.max(0, DOC.scrollHeight - vh);
    var raw = [];

    IDS.forEach(function (id) {
      var el = byId(id);
      if (!el) return;
      var top = clamp(el.getBoundingClientRect().top + window.scrollY, 0, max);
      var h = el.offsetHeight;
      raw.push({ y: top, el: el, key: id });
      // 板块高于一屏时，按「整视口」步长往下补停点，保证相邻视口连续覆盖，
      // 不会把卡片或文字从中间跳过（tail = 能看到板块底部的最后位置）。
      if (h > vh * 1.05) {
        var tail = top + h - vh;
        var y = top;
        while (y + vh < tail - 2 && y + vh < max) {
          y += vh;
          raw.push({ y: y, el: el, key: id });
        }
      }
    });
    raw.push({ y: max, el: byId('footer'), key: 'footer' });

    raw.sort(function (a, b) { return a.y - b.y; });
    stops = [];
    raw.forEach(function (p) {
      if (!stops.length || p.y - stops[stops.length - 1].y >= MIN_GAP) stops.push(p);
    });

    // 停在当前位置最近的一屏，避免 resize 后状态错乱
    var best = 0, bd = Infinity;
    stops.forEach(function (p, i) {
      var d = Math.abs(p.y - window.scrollY);
      if (d < bd) { bd = d; best = i; }
    });
    idx = best;
    renderDots();
    updateUI(silent !== false);
    return stops;
  }

  /* ---------- 分页器 ---------- */
  function renderDots() {
    if (!dots) return;
    dots.textContent = '';
    stops.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fp-dot';
      b.setAttribute('aria-label', '跳转到第 ' + (i + 1) + ' 屏：' + LABEL[p.key]);
      b.title = LABEL[p.key];
      b.addEventListener('click', function () { go(i); });
      dots.appendChild(b);
    });
    if (totalEl) totalEl.textContent = pad(stops.length);
  }

  function updateUI(noWipe) {
    if (!nav) return;
    var list = dots ? dots.children : [];
    for (var i = 0; i < list.length; i++) {
      list[i].classList.toggle('on', i === idx);
      list[i].setAttribute('aria-current', i === idx ? 'true' : 'false');
    }
    if (nowEl) nowEl.textContent = pad(idx + 1);
    if (labelEl) labelEl.textContent = LABEL[stops[idx] ? stops[idx].key : 'hero'];
    DOC.setAttribute('data-fp-index', String(idx + 1));
    if (!noWipe && wipe) {
      wipe.classList.remove('run');
      void wipe.offsetWidth;               // 强制重排以重播动画
      wipe.classList.add('run');
    }
  }

  /* ---------- 入场编排：切到的那一屏内容重新分层揭示 ---------- */
  var lastEnter = null;
  function reveal(el) {
    if (!el) return;
    if (lastEnter && lastEnter !== el) lastEnter.classList.remove('fp-enter');
    el.classList.remove('fp-enter');
    void el.offsetWidth;                 // 强制重排，让每次翻页都重播入场
    el.classList.add('in', 'fp-enter');
    var nodes = el.querySelectorAll('.reveal, .album-card, .sec-enter, .rl-left, .rl-right');
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('in');
    lastEnter = el;
  }

  /* ---------- 核心：一屏一屏滑动 ---------- */
  function go(target, instant) {
    if (!on || !stops.length) return;
    target = clamp(target, 0, stops.length - 1);
    if (target === idx && !instant) return;
    var from = window.scrollY;
    var to = stops[target].y;
    var dist = Math.abs(to - from);
    idx = target;
    updateUI(!!instant);
    reveal(stops[target].el);

    if (raf) cancelAnimationFrame(raf);
    if (instant || dist < 2) {
      window.scrollTo({ top: to, behavior: 'instant' });
      animating = false;
      lockUntil = performance.now() + COOLDOWN;
      return;
    }

    animating = true;
    var dur = SPEED * clamp(0.55 + 0.45 * dist / window.innerHeight, 0.55, 1.12);
    var t0 = performance.now();
    (function frame(now) {
      var p = clamp((now - t0) / dur, 0, 1);
      window.scrollTo({ top: from + (to - from) * ease(p), behavior: 'instant' });
      if (p < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        animating = false;
        lockUntil = performance.now() + COOLDOWN;
      }
    })(t0);
  }

  function step(dir) {
    if (animating || performance.now() < lockUntil) return;
    var pl = byId('preloader');
    if (pl && !pl.classList.contains('done')) return;
    go(idx + dir);
  }

  /* ---------- 输入：滚轮 / 触摸 / 键盘 / 锚点 ---------- */
  function onWheel(e) {
    if (!on || e.ctrlKey) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;   // 横向手势放行
    if (e.target && e.target.closest && e.target.closest('.fp-scrollable')) return;
    e.preventDefault();                                     // 接管纵向滚动
    if (Math.abs(e.deltaY) < 2) return;
    step(e.deltaY > 0 ? 1 : -1);
  }

  var touchY = 0, touchX = 0;
  function onTouchStart(e) {
    touchY = e.touches[0].clientY;
    touchX = e.touches[0].clientX;
  }
  function onTouchMove(e) {
    if (!on) return;
    if (Math.abs(e.touches[0].clientX - touchX) > Math.abs(e.touches[0].clientY - touchY)) return;
    if (e.cancelable) e.preventDefault();
  }
  function onTouchEnd(e) {
    if (!on) return;
    var dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 46) return;
    go(idx + (dy > 0 ? 1 : -1));
  }

  function onKey(e) {
    if (!on) return;
    var t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    var k = e.key;
    if (k === 'ArrowDown' || k === 'PageDown' ||
        (k === ' ' && (!t || !/^(BUTTON|A)$/.test(t.tagName)))) {
      e.preventDefault(); step(1);
    } else if (k === 'ArrowUp' || k === 'PageUp') {
      e.preventDefault(); step(-1);
    } else if (k === 'Home') {
      e.preventDefault(); go(0);
    } else if (k === 'End') {
      e.preventDefault(); go(stops.length - 1);
    }
  }

  function onClickCapture(e) {
    if (!on) return;

    // 回到顶部按钮：拦掉 main.js 的 smooth scroll，改走翻页动画
    var top = e.target && e.target.closest && e.target.closest('#toTop');
    if (top) {
      e.preventDefault();
      e.stopPropagation();
      go(0);
      return;
    }
    // 站内锚点（页脚快速导航 / SCROLL 提示）映射到对应屏
    var a = e.target && e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var h = a.getAttribute('href');
    if (!h || h.length < 2 || h === '#') return;
    var target = byId(h.slice(1));
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    var i = 0;
    for (var n = 0; n < stops.length; n++) {
      if (stops[n].el === target) { i = n; break; }
    }
    go(i);
  }

  /* ---------- 生命周期 ---------- */
  var rt = 0;
  function debounceRebuild() {
    clearTimeout(rt);
    rt = setTimeout(function () { buildStops(true); }, 180);
  }

  function init() {
    nav = byId('fpNav');
    dots = byId('fpDots');
    nowEl = byId('fpNow');
    totalEl = byId('fpTotal');
    labelEl = byId('fpLabel');
    wipe = byId('fpWipe');
    if (!nav || !active()) return;      // 非首页 / 窄屏 / 无障碍：完全不接管

    on = true;
    DOC.classList.add('fp-on');
    buildStops(true);

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClickCapture, true);
    window.addEventListener('resize', debounceRebuild);
    window.addEventListener('load', function () { setTimeout(function () { buildStops(true); }, 260); });
    // 专辑卡片由 main.js 渲染后高度才稳定，再校正一次
    setTimeout(function () { buildStops(true); }, 1400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
