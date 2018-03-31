// ==UserScript==
// @name         Bookwalker Poster
// @namespace    https://github.com/synthtech
// @description  Create link to full-size poster images
// @version      1.1.1
// @author       synthtech
// @require      https://cdn.rawgit.com/fuzetsu/userscripts/477063e939b9658b64d2f91878da20a7f831d98b/wait-for-elements/wait-for-elements.js
// @match        *://bookwalker.jp/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/bookwalker\.jp\/de[a-z0-9\-]+\/$/;

    waitForUrl(REGEX, () => {
        let poster = document.querySelector('meta[property="og:image"]').content;
        waitForElems({
            sel: '.main-cover .main-larger',
            stop: true,
            onmatch(elem) {
                let link = document.createElement('a');
                link.href = poster;
                link.target = '_blank';
                link.text = 'View Original Image';
                link.className = 'main-larger-text';
                elem.appendChild(link);
            }
        })
    });
})();
