// ==UserScript==
// @name         Kitsu Admin
// @description  Small changes to rails admin for convenience
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/api/admin/*
// @grant        none
// ==/UserScript==

(function() {
    // Show full history message
    waitForElems({
        sel: '#history tbody tr td:last-child',
        stop: false,
        onmatch: function(elem) {
            elem.style.whiteSpace = 'normal';
        }
    });

    // Open "show in app" link in new tab
    waitForElems({
        sel: '.show_in_app_member_link a',
        stop: false,
        onmatch: function(elem) {
            elem.target = '_blank';
        }
    });
})();
