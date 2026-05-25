// Shared share popup — Clipboard API + Web Share API.
// One AbortController owns every listener; close() detaches them all in one shot.
// Icon path is derived from this script's own src so the module is depth-agnostic.
(function () {
    var script = document.currentScript;
    var src = script ? script.getAttribute('src') || '' : '';
    var idx = src.indexOf('scripts/');
    var rootPrefix = idx >= 0 ? src.substring(0, idx) : './';
    if (rootPrefix === '') rootPrefix = './';
    var SHARE_ICON_SRC = rootPrefix + 'img/share-arrow.svg';

    var escapeHtml = (window.SohUtil && window.SohUtil.escapeHtml) || function (s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    window.ShareModule = (() => {
        const POPUP_ID = 'share-popup-root';
        let abortController = null;
        let returnFocusEl = null;

        function close() {
            const existing = document.getElementById(POPUP_ID);
            if (existing) existing.remove();
            if (abortController) {
                abortController.abort();
                abortController = null;
            }
            document.body.classList.remove('share-popup-open');
            if (returnFocusEl && document.contains(returnFocusEl)) {
                try { returnFocusEl.focus(); } catch (_) { /* element may be unfocusable */ }
            }
            returnFocusEl = null;
        }

        async function copyToClipboard(text) {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return;
            }
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.top = '-1000px';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            ta.remove();
            if (!ok) throw new Error('execCommand copy failed');
        }

        async function handleCopy(text, btn) {
            const original = btn.textContent;
            try {
                await copyToClipboard(text);
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(close, 900);
            } catch (err) {
                console.error('Clipboard write failed', err);
                btn.textContent = 'Copy failed';
                btn.classList.add('failed');
                setTimeout(() => {
                    btn.textContent = original;
                    btn.classList.remove('failed');
                }, 1800);
            }
        }

        async function handleNativeShare(url) {
            try {
                await navigator.share({ url });
                close();
            } catch (err) {
                if (err && err.name !== 'AbortError') {
                    console.error('Native share failed', err);
                }
            }
        }

        function show(shareUrl) {
            close();
            returnFocusEl = document.activeElement;

            abortController = new AbortController();
            const signal = abortController.signal;
            const hasNativeShare = typeof navigator.share === 'function';

            const root = document.createElement('div');
            root.id = POPUP_ID;
            root.className = 'share-popup-backdrop';
            root.innerHTML = `
                <div class="share-popup" role="dialog" aria-modal="true" aria-label="Share this link">
                    <img class="share-popup-icon" src="${escapeHtml(SHARE_ICON_SRC)}" alt="" />
                    <button type="button" class="popup-close-x" aria-label="Close">&times;</button>
                    <input id="share-url" type="text" value="${escapeHtml(shareUrl)}" readonly class="share-url-input" aria-label="Share URL" />
                    <div class="popup-actions">
                        ${hasNativeShare ? '<button type="button" class="popup-btn share-btn" data-action="share">Share&hellip;</button>' : ''}
                        <button type="button" class="popup-btn copy-btn" data-action="copy">Copy link</button>
                    </div>
                </div>
            `;

            document.body.appendChild(root);
            document.body.classList.add('share-popup-open');

            const input = root.querySelector('#share-url');
            const copyBtn = root.querySelector('[data-action="copy"]');
            const shareBtn = root.querySelector('[data-action="share"]');
            const closeX = root.querySelector('.popup-close-x');

            requestAnimationFrame(() => {
                input.focus();
                input.select();
            });

            closeX.addEventListener('click', close, { signal });
            copyBtn.addEventListener('click', () => handleCopy(shareUrl, copyBtn), { signal });
            if (shareBtn) {
                shareBtn.addEventListener('click', () => handleNativeShare(shareUrl), { signal });
            }

            let downOnBackdrop = false;
            root.addEventListener('mousedown', (e) => {
                downOnBackdrop = (e.target === root);
            }, { signal });
            root.addEventListener('click', (e) => {
                if (e.target === root && downOnBackdrop) close();
            }, { signal });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.stopPropagation();
                    close();
                }
            }, { signal });
        }

        return { show, close };
    })();
})();
