/* 站内分享：纯链接 + 同源脚本，兼容 index.html 的严格 CSP。
 * 微博 / QQ 空间走外链跳转（导航不受 script-src 限制）；
 * 复制链接用 navigator.clipboard，移动端优先 Web Share API。 */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-share]');
    if (!btn) return;
    var kind = btn.getAttribute('data-share');
    if (kind !== 'copy') return;
    e.preventDefault();
    var url = btn.getAttribute('data-url') || location.href;
    var title = btn.getAttribute('data-title') || document.title;
    var old = btn.textContent;

    function done(ok) {
      btn.textContent = ok ? '链接已复制' : '请手动复制链接';
      btn.classList.add('is-done');
      setTimeout(function () {
        btn.textContent = old;
        btn.classList.remove('is-done');
      }, 2200);
    }

    if (navigator.share && /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)) {
      navigator.share({ title: title, url: url }).then(function () { done(true); })
        .catch(function () { copy(url).then(done); });
    } else {
      copy(url).then(done);
    }
  });

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; })
        .catch(function () { return legacy(text); });
    }
    return Promise.resolve(legacy(text));
  }

  function legacy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    ta.remove();
    return ok;
  }
})();
