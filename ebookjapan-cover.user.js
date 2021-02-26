// ==UserScript==
// @name         eBookJapan Cover
// @namespace    https://github.com/synthtech
// @description  Add links to cover images
// @version      1.0
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://ebookjapan.yahoo.co.jp/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/ebookjapan\.yahoo\.co\.jp\/books\/([0-9]+)(\/.*)?$/;

    function addCoverLink() {
        const elem = document.querySelector('.book-main__cover');
        const link = document.createElement('a');
        link.href = elem.querySelector('img').src;
        link.target = '_blank';
        link.text = 'View Cover Image';
        link.className = 'btn';
        elem.appendChild(link);
    }

    waitForUrl(REGEX, () => {
        // Need to wait for the framework to load properly
        waitForElems({
            sel: '#__nuxt:not([data-server-rendered="true"])',
            stop: true,
            onmatch() {
                addCoverLink();
            },
        });
    });
})();
