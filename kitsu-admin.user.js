// ==UserScript==
// @name         Kitsu Admin
// @namespace    https://github.com/synthtech
// @description  Minor changes to rails admin for convenience
// @version      1.1.1
// @author       synthtech
// @require      https://cdn.rawgit.com/fuzetsu/userscripts/477063e939b9658b64d2f91878da20a7f831d98b/wait-for-elements/wait-for-elements.js
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
