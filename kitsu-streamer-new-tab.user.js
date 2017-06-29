// ==UserScript==
// @name         Kitsu Streamer New Tab
// @description  Open streaming links in new tabs
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(function() {
    var REGEX = /^https?:\/\/kitsu\.io\/(anime|manga)\/([^\/]+)\/?(?:\?.*)?$/;

    // Modify streaming links
    waitForUrl(REGEX, function() {
        waitForElems({
            sel: '.where-to-watch-widget a',
            stop: false,
            onmatch: function(stream) {
                stream.target = '_blank';
                stream.rel = 'noopener';
            }
        });
    });
})();
