// ==UserScript==
// @name         Kitsu Library Link
// @namespace    https://github.com
// @description  Forces library parameters in the header link
// @version      1.0.3
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    const MEDIA = 'manga';
    const STATUS = 'current';
    const REGEX = /\/users\/([a-zA-Z0-9_]+)\/library$/;

    const App = {
        openLink(link) {
            const newLink = `/users/${link.match(REGEX)[1]}/library?media=${MEDIA}&status=${STATUS}`;
            location.href = newLink;
        },
    };

    waitForElems({
        sel: '#kitsu-navbar #exCollapsingNavbar2 li:first-child a',
        stop: true,
        onmatch(elem) {
            const link = elem.href;
            if (link.match(REGEX)) {
                elem.addEventListener('click', () => { App.openLink(link); }, { once: true, passive: true });
            }
        },
    });
})();
