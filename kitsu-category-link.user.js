// ==UserScript==
// @name         Kitsu Category Link
// @description  Make category links between explore pages and advanced search more useful
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(function() {
    var MEDIA_REGEX = /^https?:\/\/kitsu\.io\/(anime|manga)\/([^\/]+)\/?(?:\?.*)?$/;
    var EXPLORE_REGEX = /^https?:\/\/kitsu\.io\/explore\/(anime|manga)\/([a-zA-Z-]+)(?!category)$/;
    var CATEGORY_REGEX = /^https?:\/\/kitsu\.io\/explore\/(anime|manga)\/category\/([a-zA-Z-]+)\/?([a-zA-Z-]+)?$/;

    // Change links on media pages
    waitForUrl(MEDIA_REGEX, function() {
        waitForElems({
            sel: '.media--category-tag a',
            stop: false,
            onmatch: function(tag) {
                var regex = /(anime|manga)\?categories=([a-zA-Z\-]+)/;
                tag.href = '/explore/' + tag.href.match(regex)[1] + '/category/' + tag.href.match(regex)[2];
            }
        });
    });

    // Change links on explore pages
    waitForUrl(EXPLORE_REGEX, function() {
        waitForElems({
            sel: '.explore-search-info a',
            stop: false,
            onmatch: function(link) {
                var sort = location.href.match(EXPLORE_REGEX)[2];
                if (sort == 'highest-rated') {
                    link.href = '/' + location.href.match(EXPLORE_REGEX)[1] + '?sort=rating';
                }
            }
        });
    });

    // Change links on category explore pages
    waitForUrl(CATEGORY_REGEX, function() {
        waitForElems({
            sel: '.explore-search-info a',
            stop: false,
            onmatch: function(link) {
                var newlink = '/' + location.href.match(CATEGORY_REGEX)[1] + '?categories=' + location.href.match(CATEGORY_REGEX)[2];
                if (location.href.match(CATEGORY_REGEX)[3]) {
                    var sort = location.href.match(CATEGORY_REGEX)[3];
                    if (sort == 'newly-released') {
                        newlink += '&sort=date';
                    }
                }
                link.href = newlink;
            }
        });
    });
})();
