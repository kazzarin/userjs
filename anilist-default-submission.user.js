// ==UserScript==
// @name         AniList Default Submission
// @namespace    https://github.com
// @description  Set default submission category when navigating to your submissions
// @version      1.1.1
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==

/* global VM */

(() => {
    const regex = /\/user\/([a-zA-Z0-9]+)\/submissions/;
    const type = 'manga';

    function clickHandler(e) {
        if (regex.test(e.target?.href)) {
            VM.observe(document.body, () => {
                const node = document.querySelector('.submissions');
                if (node) {
                    node.__vue__.setPage(type);
                    return true;
                }
                return false;
            });
        }
    }

    VM.observe(document.body, () => {
        const node = document.querySelector('.user .nav-wrap .nav.container');
        if (node) {
            node.addEventListener('click', clickHandler);
        }
    });
})();
