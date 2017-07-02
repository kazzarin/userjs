// ==UserScript==
// @name         Kitsu Admin
// @namespace    https://github.com/synthtech
// @description  Minor changes to rails admin for convenience
// @version      1.1
// @author       synthtech
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/api/admin/*
// @grant        none
// ==/UserScript==

(() => {
    // Show full history message
    waitForElems({
        sel: '#history tbody tr td:last-child',
        onmatch({style}) {
            style.whiteSpace = 'normal';
        }
    });

    // Open "show in app" link in new tab
    waitForElems({
        sel: '.show_in_app_member_link a',
        onmatch(elem) {
            elem.target = '_blank';
        }
    });
})();
