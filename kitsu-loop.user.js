// ==UserScript==
// @name         Kitsu Video Looper
// @description  Loop videos
// @version      2.0.1
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(function() {
    waitForElems({
        sel: ".stream-item video",
        onmatch: function(elem) {
            elem.setAttribute("loop", true);
        }
    });
})();
