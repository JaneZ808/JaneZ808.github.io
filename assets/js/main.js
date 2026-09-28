/* ============================================================
 *  张靓颖 Jane Zhang · 资料站 — 交互逻辑
 * ============================================================ */
(function () {
  'use strict';

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- 数据源：内置数据 + 管理端覆盖（见 data-bridge.js） ---------- */
  const DATA = (window.JANEZ_DATA && JANEZ_DATA.getMerged) ? JANEZ_DATA.getMerged() : null;
  const src = (k) => (DATA && DATA[k] !== undefined ? DATA[k] : globalThis[k]);


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
    const P = src('PROFILE');
    $('#heroStats').innerHTML = P.stats.map(s => `
      <div class="hs-item">
        <div class="hs-n">${s.n}<small>${s.u}</small></div>
        <div class="hs-l">${s.l}</div>
      </div>`).join('');
  }

  /* ================= 渲染：最新动态 ================= */
  function renderNews() {
    $('#newsGrid').innerHTML = src('NEWS').map(n => `
      <article class="news-card reveal">
        <div class="nc-top">
          <span class="nc-tag">${n.tag}</span>
          <span class="nc-date">${n.date}</span>
        </div>
        <h3 class="nc-title">${n.title}</h3>
        <p class="nc-desc">${n.desc}</p>
      </article>`).join('');
  }

  /* ================= 渲染：个人档案 ================= */
  function renderProfile() {
    const P = src('PROFILE');
    $('#pcIntro').textContent = P.intro;
    $('#pcTags').innerHTML = (P.tags && P.tags.length ? P.tags : ['流行 Pop', 'R&B', '爵士 Jazz', '灵魂乐 Soul', '海豚音', 'OST 女王'])
      .map(t => `<span>${t}</span>`).join('');
    $('#factsTable').innerHTML = P.facts.map((f, i) => `
      <li class="fact-row reveal rl-right" style="transition-delay:${i * 55}ms">
        <b class="fact-k">${f.k}</b><span class="fact-v">${f.v}</span>
      </li>`).join('');
    observeReveal();
  }

  /* ================= 渲染：音乐专辑 ================= */
  const TYPE_LABEL = { studio: '录音室专辑', ep: '迷你专辑 EP', live: '现场专辑', best: '精选辑' };

  function bindCoverFallback() {
    $$('.ac-img').forEach(img => {
      img.addEventListener('error', () => img.remove(), { once: true });
    });
  }

  function renderAlbums(filter) {
    const all = src('ALBUMS').map((a, gi) => ({ a, gi }))
      .sort((x, y) => (x.a.date || '').localeCompare(y.a.date || '', undefined, { numeric: true }));
    const cmap = (window.COVER_MAP && window.COVER_MAP.album) || [];
    const html = all.map(({ a, gi }) => {
      if (filter !== 'all' && a.type !== filter) return '';
      const cover = cmap[gi] || '';
      return `
      <a class="album-card reveal" style="animation-delay:${gi * 60}ms" href="albums/album-${gi}.html">
        <div class="ac-cover">
          <div class="ac-art" style="${grad(gi)}" aria-hidden="true">
            <span class="ac-ring"></span>
            <span class="ac-name">${a.name}</span>
          </div>
          ${cover ? `<img class="ac-img" src="${cover}" alt="${a.name} 专辑封面" loading="lazy" decoding="async">` : ''}
          <span class="ac-type">${TYPE_LABEL[a.type]}</span>
        </div>
        <div class="ac-body">
          <div class="ac-meta">
            <span class="ac-date">${a.date}</span>
            <span>${a.songs ? '· ' + a.songs + ' 首曲目' : ''}</span>
          </div>
          <h3 class="ac-cn">${a.cn}</h3>
          <p class="ac-desc">${a.desc}</p>
          <div class="ac-foot">
            ${a.award ? `<p class="ac-award">✦ ${a.award}</p>` : ''}
            <p class="ac-label">发行：${a.label}</p>
          </div>
        </div>
      </a>`;
    }).filter(Boolean).join('');
    $('#albumGrid').innerHTML = html || '<p style="color:var(--muted)">暂无该分类作品。</p>';
    bindCoverFallback();
    observeReveal();
  }

  /* ================= 渲染：影视金曲 ================= */
  function renderOST() {
    const all = src('OSTS').map((o, gi) => ({ o, gi }))
      .sort((x, y) => (x.o.year || '9999').localeCompare(y.o.year || '9999', undefined, { numeric: true }));
    const cmap = (window.COVER_MAP && window.COVER_MAP.ost) || [];
    $('#ostList').innerHTML = all.map(({ o, gi }) => {
      const cover = cmap[gi] || '';
      return `
      <a class="ost-card reveal" href="osts/ost-${gi}.html" style="animation-delay:${gi * 45}ms">
        <div class="oc-cover">
          <div class="ac-art" style="${grad(gi)}" aria-hidden="true">
            <span class="ac-ring"></span>
            <span class="ac-name">${o.song}</span>
          </div>
          ${cover ? `<img class="ac-img" src="${cover}" alt="${o.song} 封面" loading="lazy" decoding="async">` : ''}
        </div>
        <div class="oc-body">
          <div class="oc-song">${o.song}</div>
          <div class="oc-work">${o.work}</div>
          <div class="oc-year">${o.year}</div>
        </div>
      </a>`;
    }).join('');
    bindCoverFallback();
    observeReveal();
  }

  /* ================= 渲染：国际作品 ================= */
  function renderGlobal() {
    const all = src('GLOBAL_SONGS').map((g, gi) => ({ g, gi }))
      .sort((x, y) => (x.g.year || '9999').localeCompare(y.g.year || '9999', undefined, { numeric: true }));
    const cmap = (window.COVER_MAP && window.COVER_MAP.global) || [];
    $('#globalGrid').innerHTML = all.map(({ g, gi }) => {
      const cover = cmap[gi] || '';
      return `
      <div class="ost-card reveal" style="animation-delay:${gi * 45}ms">
        <div class="oc-cover">
          <div class="ac-art" style="${grad(gi)}" aria-hidden="true">
            <span class="ac-ring"></span>
            <span class="ac-name">${g.name}</span>
          </div>
          ${cover ? `<img class="ac-img" src="${cover}" alt="${g.name} 封面" loading="lazy" decoding="async">` : ''}
        </div>
        <div class="oc-body">
          <div class="oc-song">${g.name}</div>
          <div class="oc-work">${g.work || ''}</div>
          <div class="oc-year">${g.year}</div>
        </div>
      </div>`;
    }).join('');
    bindCoverFallback();
    observeReveal();
  }

  /* ================= 渲染：巡演 ================= */
  function renderTours() {
    $('#tourList').innerHTML = src('TOURS').map(t => `
      <div class="tour-item reveal ${t.name === '追' ? 'current' : ''}">
        <div>
          <div class="ti-name">${t.name}${t.name === '追' ? '<span class="ti-badge">进行中</span>' : ''}</div>
          <div class="ti-en">${t.en}</div>
        </div>
        <p class="ti-note">${t.note}</p>
        <div class="ti-year">${t.year}</div>
      </div>`).join('');
  }

  /* ================= 渲染：荣誉 ================= */
  function renderAwards(cat) {
    const all = src('AWARDS');
    const list = cat === 'all' ? all : all.filter(a => a.cat === cat);
    $('#awardList').innerHTML = list.map((a, i) => `
      <div class="award-item reveal" style="animation-delay:${i * 40}ms">
        <span class="aw-year">${a.year}</span>
        <span class="aw-name">${a.name}</span>
      </div>`).join('');
    observeReveal();
  }

  /* ================= 渲染：影视与综艺 ================= */
  function renderScreen() {
    $('#screenList').innerHTML = src('SCREENS').map(s => `
      <div class="screen-item reveal">
        <span class="si-cat">${s.cat}</span>
        <div>
          <div class="si-title">${s.title}</div>
          <div class="si-role">${s.role} · ${s.note}</div>
        </div>
        <span class="si-year">${s.year}</span>
      </div>`).join('');
    $('#varietyList').innerHTML = src('VARIETY').map(v => `
      <div class="variety-item reveal">
        <span class="vi-year">${v.year}</span>
        <span class="vi-name">${v.name}</span>
        <span class="vi-role">${v.role}</span>
      </div>`).join('');
  }

  /* ================= 渲染：图集 & 灯箱 ================= */
  let galleryIndex = 0;

  function renderGallery() {
    $('#galleryGrid').innerHTML = src('GALLERY').map((g, i) => `
      <div class="gallery-item reveal" data-i="${i}" style="animation-delay:${i * 50}ms">
        <div class="gi-art" style="${grad(g.tone)}">
          ${g.img ? `<img class="gi-img" src="${g.img}" alt="${g.title}" loading="lazy" decoding="async">` : ''}
        </div>
      </div>`).join('');

    $$('#galleryGrid .gallery-item').forEach(el => {
      el.addEventListener('click', () => openLightbox(Number(el.dataset.i)));
    });

    // 图片加载完成后渐显；失败时移除，露出底层渐变兜底
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
    const g = src('GALLERY')[i];
    const lb = $('#lightbox');
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
    $('#lightbox').classList.remove('show');
    document.body.classList.remove('locked');
  }

  function stepLightbox(d) {
    const n = src('GALLERY').length;
    galleryIndex = (galleryIndex + d + n) % n;
    openLightbox(galleryIndex);
  }

  /* ================= 渲染：平台直达 ================= */
  const PLAT_EN = { 'QQ音乐': 'QQ MUSIC', '网易云音乐': 'NETEASE MUSIC', '酷狗音乐': 'KUGOU MUSIC', '微博': 'WEIBO' };
  function renderPlatforms() {
    $('#platformGrid').innerHTML = src('PLATFORMS').map(p => `
      <a class="contact-card reveal" href="${p.url}" target="_blank" rel="noopener noreferrer nofollow">
        <span class="cc-name">${p.name}</span>
        <span class="cc-en">${PLAT_EN[p.name] || ''}</span>
        <span class="cc-arrow">前往 →</span>
      </a>`).join('');
    const fl = $('#footerPlatLinks');
    if (fl) fl.innerHTML = src('PLATFORMS').map(p =>
      `<a href="${p.url}" target="_blank" rel="noopener noreferrer nofollow">${p.name} →</a>`).join('');
  }

  /* ================= 渲染：关键词跑马灯 ================= */
  function renderMarquee() {
    const track = $('#marqueeTrack');
    if (!track) return;
    const P = src('PROFILE');
    const words = (P && P.tags && P.tags.length ? P.tags : ['流行 Pop', 'R&B', '爵士 Jazz', '灵魂乐 Soul', '海豚音', 'OST 女王']);
    const seq = words.map(w => `<span class="mq-item">${w}</span><i class="mq-dot">✦</i>`).join('');
    track.innerHTML = seq + seq; // 复制一份实现无缝循环
  }

  /* ================= 滚动显现 ================= */
  let io;
  function observeReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('in'));
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
    }, { threshold: .12, rootMargin: '0px 0px -60px 0px' });
    $$('.reveal:not(.in)').forEach(el => io.observe(el));
  }

  /* ================= 导航状态 ================= */
  function initNav() {
    const header = $('#header');
    const navs = $$('#nav .nl');
    const sections = navs.map(a => $(a.getAttribute('href'))).filter(Boolean);
    const bar = $('#progressBar');

    function onScroll() {
      const y = window.scrollY;
      header.classList.toggle('solid', y > 40);
      $('#toTop').classList.toggle('show', y > 600);

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';

      let idx = -1;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= 140) idx = i;
      });
      navs.forEach((n, i) => n.classList.toggle('active', i === idx));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    navs.forEach(n => n.addEventListener('click', () => {
      $('#nav').classList.remove('open');
      $('#menuBtn').classList.remove('on');
    }));

    $('#menuBtn').addEventListener('click', function () {
      this.classList.toggle('on');
      $('#nav').classList.toggle('open');
    });
  }

  /* ================= 主题切换 ================= */
  function initTheme() {
    const saved = localStorage.getItem('zly-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    $('#themeBtn').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('zly-theme', next);
    });
  }

  /* ================= 界面（静态默认值，改样式直接编辑 CSS） ================= */
  const SECTION_IDS = ['news', 'profile', 'music', 'tour', 'awards', 'screen', 'gallery', 'contact'];
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
      const secDesc = { news: '#news .sh-desc', profile: '#profile .sh-desc', music: '#music .sh-desc', awards: '#awards .sh-desc' };
      Object.keys(secDesc).forEach(k => { if (ui.texts[k + 'Desc']) { const el = $(secDesc[k]); if (el) el.textContent = ui.texts[k + 'Desc']; } });
    }
  }

  /* ================= 灯箱事件 ================= */
  function initLightbox() {
    $('.lb-close').addEventListener('click', closeLightbox);
    $('.lb-prev').addEventListener('click', () => stepLightbox(-1));
    $('.lb-next').addEventListener('click', () => stepLightbox(1));
    $('#lightbox').addEventListener('click', e => {
      if (e.target.id === 'lightbox') closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (!$('#lightbox').classList.contains('show')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
  }

  /* ================= 初始化 ================= */
  function init() {
    renderHeroStats();
    renderNews();
    renderProfile();
    renderAlbums('all');
    renderOST();
    renderGlobal();
    renderTours();
    renderAwards('all');
    renderScreen();
    renderGallery();
    renderPlatforms();
    renderMarquee();

    // 筛选
    $('#albumFilter').addEventListener('click', e => {
      const b = e.target.closest('.fb');
      if (!b) return;
      $$('#albumFilter .fb').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderAlbums(b.dataset.t);
    });
    $('#awardFilter').addEventListener('click', e => {
      const b = e.target.closest('.fb');
      if (!b) return;
      $$('#awardFilter .fb').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderAwards(b.dataset.c);
    });

    initNav();
    initTheme();
    initLightbox();
    applyUi();
    observeReveal();

    $('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // 载入动画结束
    window.addEventListener('load', () => {
      setTimeout(() => $('#preloader').classList.add('done'), 500);
    });
    setTimeout(() => $('#preloader').classList.add('done'), 2600);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
