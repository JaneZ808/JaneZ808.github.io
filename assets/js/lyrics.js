/* ============================================================
 * 歌词页引擎：《不知道说什么》· 张靓颖
 * LRC 内嵌解析 → 逐行高亮滚动 → 点击行跳转进度 → 进度条拖拽
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- LRC 数据（时间轴单位：秒） ---------- */
  var LRC = [
    [0, '不知道说什么 - 张靓颖', 1],
    [0, '词 Lyric by：李聪@无实物艺术团', 1],
    [0, '曲 Song written by：彭飞@无实物艺术团', 1],
    [1, '编曲 Arrangement by：李吉吉/彭飞', 1],
    [1, '制作人 Song producer：彭飞@无实物艺术团', 1],
    [2, '和音 Backing vocals：张靓颖/彭飞', 1],
    [2, '键盘 Keyboard：李吉吉/李弘博 VonKa Lee', 1],
    [3, '吉他 Guitars：饭饭Sean Fan', 1],
    [3, '弦乐编写/弦乐 String arrangement/Strings by：彭飞@无实物艺术团', 1],
    [4, '录音棚 Recording studio：Studio21A', 1],
    [4, '录音师 Recording engineer：许卓恺@studio21A', 1],
    [4, '混音师 Mixing engineer：赵靖@SBMS Beijing', 1],
    [5, '母带处理工程师：赵靖@SBMS Beijing', 1],
    [5, '词曲版权管理：Sony Music Publishing China', 1],
    [6, '广告别煽情感人'],
    [10, '听不得过敏口吻'],
    [17, '保持恒定的体温'],
    [21, '像半神以亚健康生存'],
    [26, '飞蚊症的心'],
    [29, '飞呀飞'],
    [32, '无表情'],
    [34, '模拟容器般容忍'],
    [36, '只是过载的神经'],
    [40, '急需回去请勿打扰的房间'],
    [45, '隔离晨昏和眼神'],
    [47, '甚至懒得晚餐'],
    [49, '我只想一个人'],
    [53, '（做一根秒针）'],
    [55, '不知道 不需要'],
    [56, '不想配合某一种气氛'],
    [59, '（或一盏路灯）'],
    [60, '不提问 不讨论'],
    [62, '不想困在旋转的门'],
    [64, '（做无感的人）'],
    [66, '不选择 不分析'],
    [67, '只字片语都不屑胜任'],
    [70, '不想解释 不想感动 不想费神'],
    [75, '不想无休无止成为某人'],
    [82, '讲究完每套合身'],
    [86, '身体有立场消沉'],
    [93, '拿捏回复的尺寸'],
    [97, '再拿不稳 多一颗灰尘'],
    [102, '多动症的心'],
    [106, '飞呀飞'],
    [108, '追赶的'],
    [110, '哪里比夜色安稳'],
    [113, '所以过载的神经'],
    [116, '急需回去请勿打扰的房间'],
    [121, '隔离晨昏和眼神'],
    [124, '甚至懒得晚餐'],
    [125, '我只想一个人'],
    [132, '（做一根秒针）'],
    [134, '不奇怪 不意外'],
    [135, '不想探寻 哪一段传闻'],
    [138, '（或一盏路灯）'],
    [139, '不动心 不动身'],
    [141, '不动用 本面目示人'],
    [143, '（做无感的人）'],
    [145, '不爱上 不原谅'],
    [146, '事不关己就没有纷争'],
    [149, '滚滚红尘已不值得'],
    [151, '让我脸上多一道皱纹'],
    [157, '不知道该说点什么'],
    [162, '解闷 或者 解恨'],
    [167, '没力气承认'],
    [170, '对这世界和你 想阅后即焚'],
    [173, '我已如此 残忍'],
    [177, '（做一根秒针）'],
    [178, '不知道 不需要'],
    [179, '不想配合某一种气氛'],
    [182, '（或一盏路灯）'],
    [183, '不提问 不讨论'],
    [184, '不想困在旋转的门'],
    [187, '（做无感的人）'],
    [188, '不选择 不分析'],
    [190, '只字片语 都不屑胜任'],
    [193, '不想解释 不想感动 不想费神'],
    [197, '不想无休无止成为某人'],
    [198, '（做一根秒针）'],
    [199, '不奇怪 不意外'],
    [201, '不想探寻 哪一段传闻'],
    [203, '（或一盏路灯）'],
    [205, '不动心 不动身'],
    [206, '不动用本面目示人'],
    [209, '（做无感的人）'],
    [210, '不爱上 不原谅'],
    [212, '事不关己就没有纷争'],
    [215, '滚滚红尘 已不值得'],
    [217, '让我脸上多一道皱纹'],
    [222, '再不要什么 让我精神'],
    [228, '什么都不配 让我兴奋'],
    [233, '什么都不说 才算迷人']
  ];

  var $ = function (s) { return document.querySelector(s); };
  var audio = new Audio('assets/audio/buzhidao-shuoshenme.mp3');
  audio.preload = 'auto';

  var box = $('#lyrics');
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
    if (pr && pr.catch) pr.catch(function () { /* 自动播放被拦，等用户点 */ });
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
    /* 找当前行 */
    var cur = -1;
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].t <= audio.currentTime + 0.05) cur = i;
      else break;
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

  /* ---------- 自动播放（歌词页直接进，用户来这页就是听歌的） ---------- */
  play();

  setActive(0, false);
})();
