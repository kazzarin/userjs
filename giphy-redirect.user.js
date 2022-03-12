// ==UserScript==
// @name         Giphy Redirect
// @namespace    https://github.com
// @description  Redirect giphy pages to gif
// @version      1.1.1
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://giphy.com/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /giphy\.com\/gifs\/.*/;

    waitForUrl(REGEX, () => {
        waitForElems({
            sel: 'video',
            stop: true,
            onmatch(elem) {
                if (elem.poster) {
                    const gif = elem.poster.replace('/giphy_s.gif', '/source.gif');
                    location.assign(gif);
                }
            },
        });
    });
})();
