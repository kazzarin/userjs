// ==UserScript==
// @name         Giphy Redirect
// @namespace    https://github.com/synthtech
// @description  Redirect giphy pages to gif
// @version      1.0
// @author       synthtech
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
                const gif = elem.poster.replace('/giphy_s.gif', '/giphy.gif');
                location.replace(gif);
            }
        })
    });
})();
