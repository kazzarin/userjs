// ==UserScript==
// @name         AniList Default Submission
// @namespace    https://github.com
// @description  Set default submission category when navigating to your submissions
// @version      1.0.1
// @author       Zarin
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const regex = /\/user\/([a-zA-Z0-9]+)\/submissions/;
    const type = 'manga';

    function clickHandler(e) {
        if (regex.test(e.target?.href)) {
            waitForElems({
                sel: '.submissions',
                onmatch(elem) {
                    elem.__vue__.setPage(type);
                },
                stop: true,
            });
        }
    }

    waitForElems({
        sel: '.user .nav-wrap .nav.container',
        onmatch(elem) {
            elem.addEventListener('click', clickHandler);
        },
    });
})();
