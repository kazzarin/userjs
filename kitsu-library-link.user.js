// ==UserScript==
// @name         Kitsu Library Link
// @namespace    https://github.com/synthtech
// @description  Sets the library parameters in the header link
// @version      1.0
// @author       synthtech
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    const MEDIA = 'manga';
    const STATUS = 'current';
    const REGEX = /\/users\/([a-zA-Z0-9_]+)\/library$/;

    let App = {
        openLink(link) {
            let newLink = `/users/${link.match(REGEX)[1]}/library?media=${MEDIA}&status=${STATUS}`;
            location.href = newLink;
        }
    };

    waitForElems({
        sel: '#kitsu-navbar #exCollapsingNavbar2 li:first-child a',
        stop: true,
        onmatch(elem) {
            let link = elem.href;
            if (link.match(REGEX)) {
                elem.addEventListener('click', () => { App.openLink(link) }, { once: true, passive: true });
            }
        }
    });
})();
