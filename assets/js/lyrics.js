/* ============================================================
 * 歌词页引擎：《不知道说什么》· 张靓颖
 * 数据来自共享 lrc-data.js（window.JANEZ_LRC）；
 * 逐行高亮滚动 → 点击行跳转进度 → 进度条拖拽。
 * DOMContentLoaded 后初始化，防脚本置于 body 尾部时的时序问题。
 * ============================================================ */
(function () {
  'use strict';

  function boot() {
    var LRC = window.JANEZ_LRC || [];
    var box = document.querySelector('#lyrics');
    if (!LRC.length || !box) return;
    if (!document.querySelector('#track')) return;

    var $ = function (s) { return document.querySelector(s); };
    var audio = new Audio('assets/audio/buzhidao-shuoshenme.mp3');
    audio.preload = 'auto';

    var track = $('#track');
    var playBtn = $('#playBtn');
    var iconPlay = $('#iconPlay');
    var iconPause = $('#iconPause');
    var tCur = $('#tCur');
    var tDur = $('#tDur');

    /* ---------- 渲染歌词行 ---------- */
    var lines = LRC.map(function (item) {
      var el = document.createElement('div');
      el.className = 'line' + (item[2] ? ' meta-line' : '');
      el.textContent = item[1];
      box.appendChild(el);
      return { t: item[0], el: el, meta: !!item[2] };
    });

    /* ---------- 工具 ---------- */
    function fmt(s) {
      s = Math.max(0, Math.floor(s || 0));
      return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
    }
    function setPlayed(p) {
      track.style.setProperty('--p', p);
      track.classList.add('played');
    }
    function setActive(idx, scroll) {
      lines.forEach(function (l, i) {
        l.el.classList.toggle('on', i === idx);
        l.el.classList.toggle('past', i < idx);
      });
      if (scroll && idx >= 0) {
        var el = lines[idx].el;
        var top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.42;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }

    /* ---------- 播放控制 ---------- */
    function play() {
      var pr = audio.play();
      if (pr && pr.catch) pr.catch(function () { /* 被拦则等用户点 */ });
    }
    function toggle() {
      if (audio.paused) play(); else audio.pause();
    }
    function refreshBtn() {
      var playing = !audio.paused;
      playBtn.classList.toggle('playing', playing);
      iconPlay.style.display = playing ? 'none' : '';
      iconPause.style.display = playing ? '' : 'none';
    }

    playBtn.addEventListener('click', toggle);
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Space') { e.preventDefault(); toggle(); }
    });

    /* ---------- 进度 ---------- */
    audio.addEventListener('loadedmetadata', function () { tDur.textContent = fmt(audio.duration); });
    audio.addEventListener('timeupdate', function () {
      tCur.textContent = fmt(audio.currentTime);
      if (audio.duration) setPlayed(audio.currentTime / audio.duration);
      var cur = -1;
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].t <= audio.currentTime + 0.05) cur = i; else break;
      }
      setActive(cur, true);
    });
    audio.addEventListener('play', refreshBtn);
    audio.addEventListener('pause', refreshBtn);

    /* 进度条点按 / 拖拽 */
    var dragging = false;
    function seekFromEvent(e) {
      var r = track.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      if (audio.duration) audio.currentTime = p * audio.duration;
      setPlayed(p);
    }
    track.addEventListener('pointerdown', function (e) {
      dragging = true;
      track.setPointerCapture(e.pointerId);
      seekFromEvent(e);
    });
    track.addEventListener('pointermove', function (e) { if (dragging) seekFromEvent(e); });
    track.addEventListener('pointerup', function () { dragging = false; });

    /* 歌词行点击跳转 */
    lines.forEach(function (l, i) {
      if (l.meta) return;
      l.el.addEventListener('click', function () {
        audio.currentTime = l.t;
        if (audio.paused) play();
        setActive(i, true);
      });
    });

    /* ---------- 主题 ---------- */
    var saved = null;
    try { saved = localStorage.getItem('zly-theme'); } catch (e) {}
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    $('#themeBtn').addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('zly-theme', next); } catch (e) {}
    });

    play(); // 进页即播（被拦则点播放键，用户手势必成功）
    setActive(0, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
