// ==UserScript==
// @name         AniList Default List
// @namespace    https://github.com
// @description  Set default list when navigating from header
// @version      1.1.3
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/index.js
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==

/* global VM */

(() => {
    const regex = /\/user\/(\w+)\/(animelist|mangalist)/;
    const list = {
        anime: 'Watching',
        manga: 'Reading',
    };

    function clickHandler(e) {
        if (regex.test(e.target?.href)) {
            const [,, media] = e.target.href.match(regex);
            const [type] = media.split('list');
            VM.observe(document.body, () => {
                const node = document.querySelector('.filters-wrap');
                if (node) {
                    node.__vue__.setSectionFilter(list[type]);
                    return true;
                }
                return false;
            });
        }
    }

    VM.observe(document.body, () => {
        const node = document.querySelector('#nav .links');
        if (node) {
            node.addEventListener('click', clickHandler);
            return true;
        }
        return false;
    });
})();
