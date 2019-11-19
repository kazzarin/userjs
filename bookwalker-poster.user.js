// ==UserScript==
// @name         Bookwalker Poster
// @namespace    https://github.com/synthtech
// @description  Add links to cover images
// @version      1.2
// @author       synthtech
// @require      https://gitcdn.xyz/cdn/fuzetsu/userscripts/ab01548c6ebdead7781307d02e9882b1e8fe64dd/wait-for-elements/wait-for-elements.js
// @match        *://*.bookwalker.jp/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/(r18\.)?bookwalker\.jp\/de[a-z0-9\-]+\/$/;

    waitForUrl(REGEX, () => {
        const poster = document.querySelector('.main-cover .main-cover-inner img').src;
        waitForElems({
            sel: '.main-cover .main-larger',
            stop: true,
            onmatch(elem) {
                const link = document.createElement('a');
                link.href = poster;
                link.target = '_blank';
                link.text = 'View Cover Image';
                link.className = 'main-larger-text';
                elem.appendChild(link);
            }
        })
    });
})();
