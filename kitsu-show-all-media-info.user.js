// ==UserScript==
// @name         Kitsu Show All Media Info
// @namespace    https://github.com/synthtech
// @description  Show all media information in sidebar
// @version      1.0
// @author       synthtech
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    waitForElems({
        sel: '.media--information .more-link',
        onmatch(elem) {
            elem.click();
        }
    });
})();
