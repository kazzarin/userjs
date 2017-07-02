// ==UserScript==
// @name         Kitsu Streamer New Tab
// @namespace    https://github.com/synthtech
// @description  Open streaming links in new tabs
// @version      1.1
// @author       synthtech
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/kitsu\.io\/(anime|manga)\/([^\/]+)\/?(?:\?.*)?$/;

    waitForUrl(REGEX, () => {
        waitForElems({
            sel: '.where-to-watch-widget a',
            onmatch(elem) {
                elem.target = '_blank';
                elem.rel = 'noopener';
            }
        });
    });
})();
