// ==UserScript==
// @name         Kitsu Show All Media Info
// @namespace    https://github.com/synthtech
// @description  Show all media information in sidebar
// @version      1.0.1
// @author       synthtech
// @require      https://cdn.rawgit.com/fuzetsu/userscripts/477063e939b9658b64d2f91878da20a7f831d98b/wait-for-elements/wait-for-elements.js
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
