// ==UserScript==
// @name         Kitsu Video Looper
// @namespace    https://github.com/synthtech
// @description  Loop videos
// @version      2.0.4
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    waitForElems({
        sel: '.stream-item video',
        onmatch(elem) {
            const vid = elem;
            vid.loop = true;
        },
    });
})();
