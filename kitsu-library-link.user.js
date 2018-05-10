// ==UserScript==
// @name         Kitsu Library Link
// @namespace    https://github.com/synthtech
// @description  Forces library parameters in the header link
// @version      1.0.1
// @author       synthtech
// @require      https://cdn.rawgit.com/fuzetsu/userscripts/477063e939b9658b64d2f91878da20a7f831d98b/wait-for-elements/wait-for-elements.js
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
