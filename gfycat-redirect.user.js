// ==UserScript==
// @name         Gfycat Redirect
// @namespace    https://github.com/synthtech
// @description  Redirect gfycat pages to source video
// @version      1.0
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://gfycat.com/*
// @match        *://www.redgifs.com/*
// @match        *://www.gifdeliverynetwork.com/*
// @grant        none
// ==/UserScript==

(() => {
    waitForElems({
        sel: 'video',
        stop: true,
        onmatch(player) {
            if (player) {
                for (let node of player.childNodes) {
                    if (node.type === 'video/mp4' && !node.src.includes('-mobile')) {
                        location.replace(node.src);
                    }
                }
            }
        }
    });
})();
