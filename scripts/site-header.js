/*
 * Shared site header — injected into every page so the markup lives in one place.
 *
 * Usage on each page (place where the header should render, top of <body>):
 *   <script src="./scripts/site-header.js"></script>
 *   ...or from a subdirectory:
 *   <script src="../scripts/site-header.js"></script>
 *
 * The base path back to site root is derived from this script's own src
 * (the substring before "scripts/"), so links stay path-relative no matter
 * how deep the page is nested.
 */
(function () {
    var script = document.currentScript;
    var src = script ? script.getAttribute('src') || '' : '';
    var idx = src.indexOf('scripts/');
    var base = idx >= 0 ? src.substring(0, idx) : './';
    if (base === '') base = './';

    var navLinks = [
        { href: 'tricks/',    label: 'Tricks',         key: 'tricks' },
        { href: 'settings/',  label: 'Settings Rando', key: 'settings' },
        { href: 'nospoiler/', label: '\'spoiler free\' Log Search',     key: 'nospoiler' }
    ];

    var pathSegments = window.location.pathname.split('/').filter(function (s) { return s.length > 0; });

    function isCurrent(key) {
        return pathSegments.indexOf(key) !== -1;
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    var navHtml = navLinks.map(function (l) {
        var current = isCurrent(l.key) ? ' aria-current="page"' : '';
        return '<a href="' + escapeHtml(base + l.href) + '"' + current + '>' + escapeHtml(l.label) + '</a>';
    }).join('');

    var headerHtml =
        '<header class="site-header">' +
            '<a class="site-brand" href="' + escapeHtml(base) + '">' +
                '<span class="brand-mark" aria-hidden="true"></span>' +
                '<span class="brand-text">soh.tools</span>' +
            '</a>' +
            '<nav class="site-nav" aria-label="Primary">' + navHtml + '</nav>' +
        '</header>';

    var wrapper = document.createElement('div');
    wrapper.innerHTML = headerHtml;
    var headerEl = wrapper.firstChild;

    if (script && script.parentNode) {
        script.parentNode.insertBefore(headerEl, script);
    } else {
        document.body.insertBefore(headerEl, document.body.firstChild);
    }
})();
