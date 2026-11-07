/* ============================================================
 *  张靓颖 Jane Zhang · 资料站 — 交互逻辑
 *
 *  主页（index.html）：精简版，每个板块只取最新 6 条，各板块独立版式与入场动画，
 *                      完整内容通过「查看全部」跳转到 all.html?sec=<key>。
 *  全量页（all.html）：<body data-full>，复用同一套渲染函数输出全部内容。
 *
 *  两套页面共用本文件；CSP 为 script-src 'self'，故无任何内联脚本。
 * ============================================================ */
(function () {
  'use strict';

  let bgmAudio = null; // 共享给歌词面板

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- 数据源：内置数据 + 管理端覆盖（见 data-bridge.js） ---------- */
  const DATA = (window.JANEZ_DATA && JANEZ_DATA.getMerged) ? JANEZ_DATA.getMerged() : null;
  const src = (k) => (DATA && DATA[k] !== undefined ? DATA[k] : globalThis[k]);

  /* ---------- 页面模式 ---------- */
  const FULL = document.body.hasAttribute('data-full');
  const LIMIT = 6;                                        // 主页每板块条目上限
  const take = (arr) => (FULL ? arr.slice() : arr.slice(0, LIMIT));
  /* 按字段降序（最新在前）。numeric 使 2025 < 2026，而非纯字符串序。 */
  const newest = (arr, k) => arr.slice().sort((a, b) =>
    String(b[k] || '').localeCompare(String(a[k] || ''), undefined, { numeric: true }));
  /* 按字段升序（最早在前），保留时间轴阅读顺序 */
  const oldest = (arr, k) => arr.slice().sort((a, b) =>
    String(a[k] || '').localeCompare(String(b[k] || ''), undefined, { numeric: true }));
  const pad2 = (n) => String(n).padStart(2, '0');
  /* 错峰延迟：条目过多时收敛，避免末条延迟过久 */
  const dly = (i, step) => Math.min(i, 7) * step;

  /* 板块登记表：主页「查看全部」与 all.html 顶部 tabs 共用 */
  const SECS = [
    { k: 'profile', cn: '个人档案',   en: 'Profile', desc: '完整档案信息，含简介、全部条目与音乐标签。' },
    { k: 'music',   cn: '正式专辑',   en: 'Music',   desc: '出道至今 6 张正式录音室专辑（The One / UPDATE*JANE / 张靓颖@音乐 / 我相信 / 改变 / 第七感），点击封面查看该专辑信息。' },
    { k: 'gallery', cn: '绝世美颜',   en: 'Beauty',  desc: '舞台、红毯与高光时刻精选图集，点击任一张即可放大浏览。' }
  ];

  /* ---------- 限时活动主题（自动到期回滚，无需人工干预） ----------
   * 规则写在 data.js 的 EVENT_THEME（start / end）。
   * 只要当前时间在窗口内就写入 <html data-theme-event>，CSS 端据此
   * 切换生日加载排版与生日头图；过期后 JS 什么都不做，页面自动回到
   * 默认排版与 hero.jpg，无需任何后续操作。
   * ★ 临时资产：本节 + data.js 的 EVENT_THEME + index.html 的 #plWish
   *   + style.css 的 .pl-wish / [data-theme-event] 区块 + hero-birthday.jpg
   * ------------------------------------------------------------- */
  function applyEventTheme() {
    const et = src('EVENT_THEME');
    if (!et || !et.end) return;
    const now = Date.now();
    if (now < Date.parse(et.start) || now > Date.parse(et.end)) return;

    const root = document.documentElement;
    root.setAttribute('data-theme-event', et.key || 'event');

    // 加载动画：临时替换为「1011 生日快乐」
    const pl = $('#plWish');
    if (pl) {
      const d = document.createElement('span');
      d.className = 'pl-wish-d';
      d.textContent = et.wishDate || '';
      const t = document.createElement('span');
      t.className = 'pl-wish-t';
      t.textContent = et.wishText || '';
      pl.replaceChildren(d, t);
      pl.hidden = false;
    }

    // 首屏头图：临时替换为生日海报（preloader 期间被遮挡，无闪图）
    const hero = $('.hero-photo');
    if (hero && et.hero) {
      hero.src = et.hero;
      hero.alt = et.heroAlt || '';
    }
  }

  /* ---------- 渐变色板（用于生成封面视觉） ---------- */
  const PALETTE = [
    ['#8e7bf0', '#2b2258'],
    ['#d8b46c', '#6b4a1e'],
    ['#e2698f', '#5b2140'],
    ['#4fa8c9', '#1c4457'],
    ['#7ac9a0', '#1f5040'],
    ['#c987d8', '#432353'],
    ['#d97a5c', '#5e2a1c'],
    ['#6b8ee0', '#22335e'],
    ['#b8a05c', '#4a3d1a']
  ];
  const grad = (i) => {
    const p = PALETTE[i % PALETTE.length];
    return `--c1:${p[0]};--c2:${p[1]}`;
  };

  /* ================= 渲染：首屏数据 ================= */
  function renderHeroStats() {
    const host = $('#heroStats');
    if (!host) return;
    host.innerHTML = src('PROFILE').stats.map(s => `
      <div class="hs-item">
        <div class="hs-n">${s.n}<small>${s.u}</small></div>
        <div class="hs-l">${s.l}</div>
      </div>`).join('');
  }

  /* ================= 渲染：个人档案 · 照片面板 =================
   * 主页：左面板（前 6 项档案）右照片；
   * 全量：两列定义网格（全部条目）。已移除长传记与标签。 */
  function renderProfile() {
    const P = src('PROFILE');

    if (FULL) {
      const host = $('#rfBody');
      if (!host) return;
      host.innerHTML = `
        <div class="rf-grid">
          ${P.facts.map((f, i) => `
            <div class="rf-cell reveal" style="--d:${dly(i, 70)}ms">
              <span class="rf-k">${f.k}</span>
              <span class="rf-v">${f.v}</span>
            </div>`).join('')}
        </div>`;
      return;
    }

    const fHost = $('#factsTable');
    if (fHost) fHost.innerHTML = take(P.facts).map((f, i) => `
      <li class="fact-row reveal" style="--d:${i * 55}ms">
        <b class="fact-k">${f.k}</b><span class="fact-v">${f.v}</span>
      </li>`).join('');
  }

  /* ================= 渲染：音乐专辑 · 封面方阵 ================= */
  const TYPE_LABEL = { studio: '录音室专辑', ep: '迷你专辑 EP', live: '现场专辑', best: '精选辑' };

  function bindCoverFallback() {
    $$('.ac-img').forEach(img => img.addEventListener('error', () => img.remove(), { once: true }));
  }

  /* gi 为数组原始下标，决定详情页文件名与 COVER_MAP 取值，
     排序发生在 map 之后、不影响对齐；故只能追加不能中间插入。 */
  function renderAlbums(filter) {
    const host = $('#albumGrid');
    if (!host) return;
    const cmap = (window.COVER_MAP && window.COVER_MAP.album) || [];
    const all = src('ALBUMS').map((a, gi) => ({ a, gi })).sort((x, y) =>
      String(y.a.date || '').localeCompare(String(x.a.date || ''), undefined, { numeric: true }));
    const rows = take(all.filter(x => filter === 'all' || x.a.type === filter));

    host.innerHTML = rows.map(({ a, gi }, i) => `
      <a class="album-card reveal" style="--d:${dly(i, 90)}ms" href="albums/album-${gi}.html">
        <div class="ac-cover">
          <div class="ac-art" style="${grad(gi)}" aria-hidden="true">
            <span class="ac-ring"></span>
            <span class="ac-name">${a.name}</span>
          </div>
          ${cmap[gi] ? `<img class="ac-img" src="${cmap[gi]}" alt="${a.name} 专辑封面" loading="lazy" decoding="async">` : ''}
          <span class="ac-type">${TYPE_LABEL[a.type]}</span>
        </div>
        <div class="ac-body">
          <div class="ac-meta">
            <span class="ac-date">${a.date}</span>
            <span>${a.songs ? '· ' + a.songs + ' 首曲目' : ''}</span>
          </div>
          <h3 class="ac-cn">${a.cn}</h3>
          ${FULL ? `
          <p class="ac-desc">${a.desc}</p>
          <div class="ac-foot">
            ${a.award ? `<p class="ac-award">✦ ${a.award}</p>` : ''}
            <p class="ac-label">发行：${a.label}</p>
          </div>` : ''}
        </div>
      </a>`).join('') || '<p style="color:var(--muted)">暂无该分类作品。</p>';

    bindCoverFallback();
  }

  /* ================= 渲染：正式专辑 · 专辑卡片网格
   * 本板块仅展示 6 张正式录音室专辑（排除英文专辑 Past Progressive、迷你 EP、
   * 现场辑、精选辑）；被过滤掉的专辑及其详情页 albums/album-N.html 保留但不再
   * 从本板块渲染。数据层 OSTS / GLOBAL_SONGS / VARIETY 亦保留不渲染。
   *
   * gi = 在原始 ALBUMS 数组中的下标，决定详情页文件名与 COVER_MAP 取值；
   * 过滤发生在 map 之后、排序之前，不影响 gi 与详情页/封面的对齐。 */
  const ALBUM_LIMIT_HOME = 6;  // 首页展示 6 张（实际就 6 张，全量）

  /* 正式专辑视图：仅保留 type === 'studio' 且非英文的录音室专辑。
   * 返回 [{ a, gi }]，gi 为原始下标，用于详情页 URL 与封面映射。 */
  function studioAlbums() {
    return src('ALBUMS')
      .map((a, gi) => ({ a, gi }))
      .filter(x => x.a.type === 'studio' && !x.a.english);
  }

  function renderSingles() {
    const host = $('#singlesList');
    if (!host) return;

    /* 专辑卡片网格（按日期倒序，最新在前） */
    const cmap = (window.COVER_MAP && window.COVER_MAP.album) || [];
    const albums = studioAlbums().sort((x, y) =>
      String(y.a.date || '').localeCompare(String(x.a.date || ''), undefined, { numeric: true }));
    const albumRows = FULL ? albums : albums.slice(0, ALBUM_LIMIT_HOME);

    host.innerHTML = albumRows.map(({ a, gi }, i) => `
      <a class="album-card reveal" style="--d:${dly(i, 90)}ms" href="albums/album-${gi}.html">
        <div class="ac-cover">
          <div class="ac-art" style="${grad(gi)}" aria-hidden="true">
            <span class="ac-ring"></span>
            <span class="ac-name">${a.name}</span>
          </div>
          ${cmap[gi] ? `<img class="ac-img" src="${cmap[gi]}" alt="${a.name} 专辑封面" loading="lazy" decoding="async">` : ''}
          <span class="ac-type">${TYPE_LABEL[a.type]}</span>
          ${a.studioNo ? `<span class="ac-studio-no">Vol.${a.studioNo}</span>` : ''}
          ${a.english ? `<span class="ac-english">EN</span>` : ''}
        </div>
        <div class="ac-body">
          <div class="ac-meta">
            <span class="ac-date">${a.date}</span>
            <span>${a.songs ? '· ' + a.songs + ' 首曲目' : ''}</span>
          </div>
          <h3 class="ac-cn">${a.cn}</h3>
          ${FULL ? `
          <p class="ac-desc">${a.desc}</p>
          <div class="ac-foot">
            ${a.award ? `<p class="ac-award">✦ ${a.award}</p>` : ''}
            <p class="ac-label">发行：${a.label}</p>
          </div>` : ''}
        </div>
      </a>`).join('') || '<p style="color:var(--muted)">暂无该分类作品。</p>';

    bindCoverFallback();
  }

  /* ================= 渲染：绝世美颜 · 3 列网格 + 灯箱（回滚恢复版） =================
   * 大图模式：3 列等宽，每格 1 张，点击放大查看。
   * data-i 携带数组原始下标，灯箱据此索引。 */
  let galleryIndex = 0;

  function renderGallery() {
    const host = $('#galleryGrid');
    if (!host) return;
    const all = src('GALLERY').map((g, gi) => ({ g, gi }));

    host.innerHTML = all.map(({ g, gi }, i) => {
      return `
      <div class="gg-item reveal" data-i="${gi}" style="--d:${dly(i, 70)}ms">
        <div class="gi-art" style="${grad(g.tone)}">
          ${g.img ? `<img class="gi-img" src="${g.img}" alt="${g.title}" loading="lazy" decoding="async">` : ''}
        </div>
      </div>`;
    }).join('');

    $$('#galleryGrid .gg-item').forEach(el =>
      el.addEventListener('click', () => openLightbox(Number(el.dataset.i))));

    $$('#galleryGrid .gi-img').forEach(img => {
      const done = () => img.classList.add('ready');
      if (img.complete && img.naturalWidth > 0) done();
      else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', () => img.remove(), { once: true });
      }
    });
  }

  function openLightbox(i) {
    galleryIndex = i;
    const lb = $('#lightbox');
    if (!lb) return;
    const g = src('GALLERY')[i];
    if (g.img) {
      $('#lbArt').classList.add('has-img');
      const im = document.createElement('img');
      im.className = 'lb-img';
      im.src = g.img;
      im.alt = g.title;
      im.addEventListener('error', () => im.remove(), { once: true });
      $('#lbArt').replaceChildren(im);
    } else {
      $('#lbArt').classList.remove('has-img');
      $('#lbArt').setAttribute('style', grad(g.tone));
      $('#lbArt').replaceChildren();
    }
    lb.classList.add('show');
    document.body.classList.add('locked');
  }

  function closeLightbox() {
    const lb = $('#lightbox');
    if (!lb) return;
    lb.classList.remove('show');
    document.body.classList.remove('locked');
  }

  function stepLightbox(d) {
    const n = src('GALLERY').length;
    galleryIndex = (galleryIndex + d + n) % n;
    openLightbox(galleryIndex);
  }

  function initLightbox() {
    const lb = $('#lightbox');
    if (!lb) return;
    $('.lb-close', lb).addEventListener('click', closeLightbox);
    $('.lb-prev', lb).addEventListener('click', () => stepLightbox(-1));
    $('.lb-next', lb).addEventListener('click', () => stepLightbox(1));
    lb.addEventListener('click', e => {
      if (e.target.id === 'lightbox') closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('show')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
  }

  /* ================= 渲染：平台直达 ================= */
  const PLAT_EN = { 'QQ音乐': 'QQ MUSIC', '网易云音乐': 'NETEASE MUSIC', '酷狗音乐': 'KUGOU MUSIC', '微博': 'WEIBO' };
  function renderPlatforms() {
    const host = $('#platformGrid');
    if (host) {
      host.innerHTML = src('PLATFORMS').map((p, i) => `
        <a class="contact-card reveal ct-float" href="${p.url}" target="_blank" rel="noopener noreferrer nofollow" style="--d:${i * 95}ms">
          <span class="cc-name">${p.name}</span>
          <span class="cc-en">${PLAT_EN[p.name] || ''}</span>
          <span class="cc-arrow">前往 →</span>
        </a>`).join('');
    }
    const fl = $('#footerPlatLinks');
    if (fl) fl.innerHTML = src('PLATFORMS').map(p =>
      `<a href="${p.url}" target="_blank" rel="noopener noreferrer nofollow">${p.name} →</a>`).join('');
  }

  /* ================= 计数回填：data-count → 各数据源实际条数 ================= */
  function fillCounts() {
    const N = {
      music: studioAlbums().length,
      gallery: src('GALLERY').length
    };
    $$('[data-count]').forEach(el => {
      const v = N[el.getAttribute('data-count')];
      if (v !== undefined) el.textContent = v;
    });
  }

  /* ================= 全量页：标题 + tabs + 区块显隐 ================= */
  function buildFull(sec) {
    // 兼容旧 URL：已删除的板块统一落到档案页
    if (sec === 'news' || sec === 'tour' || sec === 'album' || sec === 'singles' || sec === 'ost' || sec === 'global') {
      window.location.replace('all.html?sec=profile');
      return;
    }
    const meta = SECS.find(s => s.k === sec) || SECS[0];
    const head = $('#fullHead');
    if (head) head.innerHTML = `
      <span class="sh-en">${meta.en}</span>
      <h1 class="sh-cn">${meta.cn}</h1>
      <p class="full-desc">${meta.desc}</p>`;
    const tabs = $('#fullTabs');
    if (tabs) tabs.innerHTML = SECS.map(s =>
      `<a class="full-tab${s.k === meta.k ? ' is-on' : ''}" href="all.html?sec=${s.k}">${s.cn}</a>`).join('');
    $$('.f-sec').forEach(s => { s.hidden = s.getAttribute('data-sec') !== meta.k; });
    // 设置全屏壁纸背景
    const bgMap = { profile: 'gallery-5.jpg', music: 'gallery-9.jpg', gallery: 'gallery-8.jpg' };
    const shell = $('.full-shell');
    if (shell && bgMap[meta.k]) {
      shell.style.setProperty('--sec-bg', `linear-gradient(135deg, rgba(18,16,24,.85), rgba(26,22,36,.80)), url('../img/${bgMap[meta.k]}')`);
    }
  }

  /* ================= 滚动显现 =================
   * .reveal / .sec-enter / [data-rv] 均被观察；靠 .in 触发入场。
   * 各板块自行定义起始 transform / clip-path / filter，
   * .reveal.in 只负责复位 opacity 与 transform。
   * 三重保障：IO 观察 → 首屏 1s 兜底 → scroll 事件兜底。 */
  const REVEAL_SEL = '.reveal, .sec-enter, [data-rv]';
  let io;
  let scrollT;
  function revealInViewport() {
    $$(REVEAL_SEL + ':not(.in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        el.classList.add('in');
      }
    });
  }
  function observeReveal() {
    if (!('IntersectionObserver' in window)) {
      $$(REVEAL_SEL).forEach(el => el.classList.add('in'));
      return;
    }
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    $$(REVEAL_SEL + ':not(.in)').forEach(el => io.observe(el));
    // 首屏 1s 后兜底：确保视口内元素已入场
    setTimeout(revealInViewport, 1000);
    // scroll 兜底：IO 未及时触发时由 scroll 补上
    window.addEventListener('scroll', () => {
      clearTimeout(scrollT);
      scrollT = setTimeout(revealInViewport, 80);
    }, { passive: true });
  }

  /* ================= 专辑筛选 ================= */
  function bindFilters() {
    const fb = $('#albumFilter');
    if (!fb) return;
    fb.addEventListener('click', e => {
      const b = e.target.closest('.fb');
      if (!b) return;
      $$('#albumFilter .fb').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderAlbums(b.dataset.t);
    });
  }

  /* ================= 导航状态 ================= */
  function initNav() {
    const header = $('#header');
    const navs = $$('#nav .nl');
    const bar = $('#progressBar');
    const sections = navs.map(a => $(a.getAttribute('href'))).filter(Boolean);

    function onScroll() {
      const y = window.scrollY;
      if (header) header.classList.toggle('solid', y > 40);
      const toTop = $('#toTop');
      if (toTop) toTop.classList.toggle('show', y > 600);
      if (bar) {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
      }
      let idx = -1;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= 140) idx = i;
      });
      navs.forEach((n, i) => n.classList.toggle('active', i === idx));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!navs.length) return;
    navs.forEach(n => n.addEventListener('click', () => {
      const nb = $('#nav');
      if (nb) nb.classList.remove('open');
      const mb = $('#menuBtn');
      if (mb) mb.classList.remove('on');
    }));
    const mb = $('#menuBtn');
    if (mb) mb.addEventListener('click', function () {
      this.classList.toggle('on');
      const nb = $('#nav');
      if (nb) nb.classList.toggle('open');
    });
  }

  /* ================= 主题切换 ================= */
  function initTheme() {
    const saved = localStorage.getItem('zly-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    const btn = $('#themeBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('zly-theme', next);
    });
  }

  /* ================= 界面（静态默认值，改样式直接编辑 CSS） ================= */
  const SECTION_IDS = ['profile', 'music', 'gallery', 'contact'];
  function applyUi() {
    let ui = (window.JANEZ_DATA && JANEZ_DATA.getUiMerged) ? JANEZ_DATA.getUiMerged() : {};
    const root = document.documentElement;
    // 主题
    if (ui.theme) root.setAttribute('data-theme', ui.theme);
    // 主色
    if (ui.accent) root.style.setProperty('--accent', ui.accent);
    // 字号
    if (ui.fontScale && ui.fontScale !== 100) root.style.fontSize = (16 * ui.fontScale / 100) + 'px';
    // 板块显隐
    if (ui.visibleSections) {
      SECTION_IDS.forEach(id => {
        const sec = document.getElementById(id);
        if (!sec) return;
        const show = ui.visibleSections[id] !== false;
        sec.style.display = show ? '' : 'none';
      });
    }
    // 文案覆盖
    if (ui.texts && typeof ui.texts === 'object') {
      if (ui.texts.heroQuote) { const el = $('.hero-quote'); if (el) el.textContent = '“' + ui.texts.heroQuote + '”'; }
      const secDesc = { profile: '#profile .sh-desc', music: '#music .sh-desc' };
      Object.keys(secDesc).forEach(k => {
        if (ui.texts[k + 'Desc']) { const el = $(secDesc[k]); if (el) el.textContent = ui.texts[k + 'Desc']; }
      });
    }
  }

  /* ================= 背景音乐《不知道说什么》 =================
   * 三层自动播放策略（Chrome autoplay policy 内的最大化）：
   * ① 直接有声播放（老浏览器/已授权站点设置）
   * ② 失败 → muted 起播（政策必允许）+ 首次任意交互瞬间取消静音
   * ③ 配套：右下角唱片按钮 + 底部桌面歌词字幕条（随曲逐句高亮） */
  function initBgm() {
    const audio = $('#bgm');
    const btn = $('#bgmBtn');
    if (!audio || !btn) return;
    bgmAudio = audio; // 共享给导航歌词条

    const sync = () => btn.classList.toggle('is-playing', !audio.paused);

    /* ---- 按钮控制 ---- */
    btn.addEventListener('click', () => {
      if (audio.paused) { audio.muted = false; audio.play().catch(() => {}); }
      else audio.pause();
    });

    /* ---- 三层自动播放 ---- */
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      audio.muted = false;
      audio.play().then(() => {}).catch(() => {});
    };

    const pr = audio.play(); // ① 有声直放
    if (pr && pr.catch) {
      pr.then(() => { /* 直接成功 */ })
        .catch(() => {
          // ② muted 起播（政策允许），等首次交互出声
          audio.muted = true;
          const pr2 = audio.play();
          if (pr2 && pr2.catch) pr2.catch(() => {});
          ['pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel'].forEach(ev =>
            document.addEventListener(ev, unlock, { capture: true, passive: true }));
        });
    }

    audio.addEventListener('play', sync);
    audio.addEventListener('pause', sync);

    renderSideLyrics();
    initSideLyrics();
  }

  /* ================= 右侧竖排歌词条 =================
   * 在 #sideLyrics / #slTrack 内渲染全部歌词句，竖排从下到上，
   * 当前句金色高亮并自动滚动到视野中央；纯自动播放，无点击交互。 */
  function renderSideLyrics() {
    const track = $('#slTrack');
    if (!track) return;
    const LRC = (window.JANEZ_LRC || []).filter(x => !x[2]); // 跳过制作信息
    if (!LRC.length) return;

    track.innerHTML = LRC.map((item, i) =>
      `<span class="sl-line" data-t="${item[0]}" data-i="${i}">${item[1]}</span>`
    ).join('');
  }

  function initSideLyrics() {
    const audio = bgmAudio || $('#bgm');
    const track = $('#slTrack');
    if (!audio || !track) return;
    const lines = $$('.sl-line', track);
    if (!lines.length) return;

    let cur = -1;
    const update = () => {
      let idx = -1;
      for (let i = 0; i < lines.length; i++) {
        const t = Number(lines[i].dataset.t || 0);
        if (t <= audio.currentTime + 0.05) idx = i; else break;
      }
      if (idx === cur) return;
      cur = idx;
      lines.forEach((el, i) => el.classList.toggle('on', i === idx));
      if (idx >= 0) {
        const el = lines[idx];
        const top = el.offsetTop - track.clientHeight / 2 + el.clientHeight / 2;
        track.scrollTo({ top, behavior: 'smooth' });
      }
    };

    audio.addEventListener('timeupdate', update);
  }

  /* ================= 初始化 ================= */
  function init() {
    applyEventTheme(); // 限时活动主题须最先执行，且在 applyUi() 之前
    fillCounts();

    if (FULL) {
      buildFull(new URLSearchParams(location.search).get('sec') || 'profile');
    } else {
      renderHeroStats();
    }

    renderProfile();
    renderSingles();
    renderGallery();
    renderPlatforms();

    bindFilters();
    initNav();
    initTheme();
    initBgm();
    initLightbox();
    applyUi();
    observeReveal();
    renderSideLyrics();
    initSideLyrics();

    const toTop = $('#toTop');
    if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // 载入动画结束（全量页无首屏大图，缩短等待）
    const done = () => { const p = $('#preloader'); if (p) p.classList.add('done'); };
    window.addEventListener('load', () => setTimeout(done, FULL ? 180 : 500));
    setTimeout(done, FULL ? 1100 : 2600);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
