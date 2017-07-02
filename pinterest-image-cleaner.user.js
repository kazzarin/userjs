// ==UserScript==
// @name         Pinterest Image Cleaner
// @namespace    https://github.com/synthtech
// @description  Removes links on images
// @version      1.1
// @author       synthtech
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://www.pinterest.com/pin/*
// @grant        none
// ==/UserScript==

(() => {
    waitForElems({
        sel: '.GrowthUnauthPinImage',
        stop: true,
        onmatch(elem) {
            let link = elem.firstChild;
            while (link.firstChild) elem.insertBefore(link.firstChild, link);
            elem.removeChild(link);
        }
    });
})();
