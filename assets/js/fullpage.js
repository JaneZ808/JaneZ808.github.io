/* ==========================================================================
   NOVA · FULLPAGE —— 与参考站同款「整屏叠化翻页」(swiper-fade)
   --------------------------------------------------------------------------
   参考站运行时实测参数：
     new Swiper('.main-swiper-page', { direction:'vertical', effect:'fade',
                                       speed:1000, ... })
     .swiper-fade / wrapper transform:none / 各 panel 绝对叠放靠 opacity 切换
     .m-worldview.blur { filter: blur(...) } —— 转场叠加轻微模糊
   因此「翻页」不是上下滑动，而是：旧屏淡出 + 轻微模糊/缩放 -> 全遮蔽
   瞬间换位 -> 新屏淡入 + 分层揭示。全程零可见位移。

   实现要点：
   · 保留真实文档滚动作为「位置状态」=> position:fixed 的竖排歌词 / HUD /
     BGM / 回顶按钮、IntersectionObserver 入场、滚动进度条、锚点、SEO 全部原样
     工作，没有任何 fixed 叠层，也不会让观察器失效
   · 一次滚轮 = 一次转场；转场由 veil 遮蔽层驱动，遮蔽期间才做 scrollTo
   · 每个板块顶部是停点；超高板块按整视口步长补停点，保证 7 张专辑不丢
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
  var VEIL_LABEL = {
    hero: 'JANE ZHANG',
    profile: 'PROFILE',
    music: 'STUDIO ALBUMS',
    contact: 'LISTEN & FOLLOW',
    footer: 'ARCHIVE'
  };

  var FADE_OUT = 400;        // 旧屏淡出 + 模糊（参考站 speed 1000 的前半）
  var FADE_IN  = 600;        // 新屏淡入 + 分层揭示（后半）
  var SPEED    = 1000;       // 与 Swiper speed:1000 对齐
  var COOLDOWN = 140;        // 转场结束后的静默期，防触控板连发
  var MIN_GAP  = 80;         // 停点最小间距

  var stops = [], idx = 0, on = false;
  var animating = false, lockUntil = 0, timers = [];
  var nav, dots, nowEl, totalEl, labelEl, veil, veilText, veilNo, wipe;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function q(s) { return document.querySelector(s); }
  function byId(s) { return document.getElementById(s); }
  function active() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && window.innerWidth >= 1024
      && !!byId('hero');
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

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
      void wipe.offsetWidth;
      wipe.classList.add('run');
    }
  }

  /* ---------- 入场编排：目标屏内容分层揭示（每次翻页重播） ---------- */
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

  /* ---------- 核心：整屏叠化 (fade)，无任何可见位移 ---------- */
  function go(target, instant) {
    if (!on || !stops.length) return;
    target = clamp(target, 0, stops.length - 1);
    if (target === idx && !instant) return;
    clearTimers();

    var to = stops[target].y;
    var key = stops[target].key;
    idx = target;

    // 瞬时模式（初始化 / resize / 无障碍）：直接换位，不播转场
    if (instant || !veil || Math.abs(to - window.scrollY) < 2) {
      window.scrollTo({ top: to, behavior: 'instant' });
      updateUI(true);
      reveal(stops[target].el);
      animating = false;
      lockUntil = performance.now() + COOLDOWN;
      return;
    }

    animating = true;
    if (veilText) veilText.textContent = VEIL_LABEL[key] || '';
    if (veilNo) veilNo.textContent = pad(target + 1) + ' / ' + pad(stops.length);
    updateUI(true);                          // 序号 / 分页器与幕上目标屏同时切换
    veil.classList.remove('fp-veil-in', 'fp-veil-out');
    void veil.offsetWidth;                    // 强制重排，保证每次重播
    veil.classList.add('fp-veil-in');         // 阶段一：旧屏淡出 + 模糊
    DOC.classList.add('fp-fading');

    // 阶段二：全遮蔽瞬间换位（此时 veil 不透明，位移不可见）
    later(function () {
      window.scrollTo({ top: to, behavior: 'instant' });
      veil.classList.remove('fp-veil-in');
      veil.classList.add('fp-veil-out');     // 阶段三：新屏淡入
      DOC.classList.remove('fp-fading');
      reveal(stops[target].el);              // 分层揭示与淡入同步
    }, FADE_OUT);

    // 收尾
    later(function () {
      veil.classList.remove('fp-veil-in', 'fp-veil-out');
      animating = false;
      lockUntil = performance.now() + COOLDOWN;
    }, SPEED);
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
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (e.target && e.target.closest && e.target.closest('.fp-scrollable')) return;
    e.preventDefault();
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
    var top = e.target && e.target.closest && e.target.closest('#toTop');
    if (top) {
      e.preventDefault(); e.stopPropagation();
      go(0);
      return;
    }
    var a = e.target && e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var h = a.getAttribute('href');
    if (!h || h.length < 2 || h === '#') return;
    var target = byId(h.slice(1));
    if (!target) return;
    e.preventDefault(); e.stopPropagation();
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
    veil = byId('fpVeil');
    veilText = byId('fpVeilText');
    veilNo = byId('fpVeilNo');
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
    setTimeout(function () { buildStops(true); }, 1400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
