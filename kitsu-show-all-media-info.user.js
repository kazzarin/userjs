// ==UserScript==
// @name         Kitsu Show All Media Info
// @namespace    https://github.com
// @description  Show all media information in sidebar
// @version      1.0.3
// @author       Zarin
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    waitForElems({
        sel: '.media--information .more-link',
        onmatch(elem) {
            elem.click();
        },
    });
})();
