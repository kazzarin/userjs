// ==UserScript==
// @name         Kitsu Category Link
// @namespace    https://github.com/synthtech
// @description  Make category links between explore pages and advanced search more useful
// @version      1.1.2
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    const MEDIA_REGEX = /^https?:\/\/kitsu\.io\/(anime|manga)\/([^\/]+)\/?(?:\?.*)?$/;
    const EXPLORE_REGEX = /^https?:\/\/kitsu\.io\/explore\/(anime|manga)\/([a-zA-Z-]+)(?!category)$/;
    const CATEGORY_REGEX = /^https?:\/\/kitsu\.io\/explore\/(anime|manga)\/category\/([a-zA-Z-]+)\/?([a-zA-Z-]+)?$/;

    // Change links on media pages
    waitForUrl(MEDIA_REGEX, () => {
        waitForElems({
            sel: '.media--category-tag a',
            onmatch(elem) {
                let regex = /(anime|manga)\?categories=([a-zA-Z\-]+)/;
                elem.href = `/explore/${elem.href.match(regex)[1]}/category/${elem.href.match(regex)[2]}`;
            }
        });
    });

    // Change links on explore pages
    waitForUrl(EXPLORE_REGEX, () => {
        waitForElems({
            sel: '.explore-search-info a',
            onmatch(elem) {
                let sort = location.href.match(EXPLORE_REGEX)[2];
                if (sort == 'highest-rated') {
                    elem.href = `/${location.href.match(EXPLORE_REGEX)[1]}?sort=rating`;
                }
            }
        });
    });

    // Change links on category explore pages
    waitForUrl(CATEGORY_REGEX, () => {
        waitForElems({
            sel: '.explore-search-info a',
            onmatch(elem) {
                let newlink = `/${location.href.match(CATEGORY_REGEX)[1]}?categories=${location.href.match(CATEGORY_REGEX)[2]}`;
                if (location.href.match(CATEGORY_REGEX)[3]) {
                    let sort = location.href.match(CATEGORY_REGEX)[3];
                    if (sort == 'newly-released') {
                        newlink += '&sort=date';
                    }
                }
                elem.href = newlink;
            }
        });
    });
})();
