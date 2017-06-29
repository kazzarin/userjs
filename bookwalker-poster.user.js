// ==UserScript==
// @name         Bookwalker Poster
// @description  Create link to full-size poster images
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://bookwalker.jp/*
// @grant        none
// ==/UserScript==

(function() {
    var REGEX = /^https?:\/\/bookwalker\.jp\/de[a-z0-9\-]+\/$/;

    // Create link
    waitForUrl(REGEX, function() {
        var poster = document.querySelector('meta[property="og:image"]').content;
        waitForElems({
            sel: '.main-cover .main-larger',
            stop: true,
            onmatch: function(elem) {
                var link = document.createElement('a');
                link.href = poster;
                link.target = '_blank';
                link.text = 'View Original Image';
                link.className = 'main-larger-text';
                elem.appendChild(link);
            }
        })
    });
})();
