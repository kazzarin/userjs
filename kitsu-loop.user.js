// ==UserScript==
// @name         Kitsu Video Looper
// @namespace    https://github.com/synthtech
// @description  Loop videos
// @version      2.0.2
// @author       synthtech
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    waitForElems({
        sel: '.stream-item video',
        onmatch(elem) {
            elem.loop = true;
        }
    });
})();
