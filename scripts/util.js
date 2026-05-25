// Shared utilities exposed on window.SohUtil.
// Loaded before any page-specific script that needs them.
(function () {
    window.SohUtil = window.SohUtil || {};

    window.SohUtil.escapeHtml = function (s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };
})();
