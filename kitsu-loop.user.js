// ==UserScript==
// @name         Kitsu Video Looper
// @namespace    https://github.com/synthtech
// @description  Loop videos
// @version      2.0.3
// @author       synthtech
// @require      https://cdn.rawgit.com/fuzetsu/userscripts/477063e939b9658b64d2f91878da20a7f831d98b/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    waitForElems({
        sel: '.stream-item video',
        onmatch(elem) {
            elem.loop = true;
        }
    });
})();
