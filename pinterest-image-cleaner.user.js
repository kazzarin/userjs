// ==UserScript==
// @name         Pinterest Image Cleaner
// @namespace    https://github.com/synthtech
// @description  Removes links on images
// @version      1.1.1
// @author       synthtech
// @require      https://cdn.rawgit.com/fuzetsu/userscripts/477063e939b9658b64d2f91878da20a7f831d98b/wait-for-elements/wait-for-elements.js
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
