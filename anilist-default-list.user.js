// ==UserScript==
// @name         AniList Default List
// @namespace    https://github.com/synthtech
// @description  Set default list when navigating from header
// @version      1.0.3
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const regex = /\/user\/([a-zA-Z0-9]+)\/(animelist|mangalist)/;
    const list = {
        anime: 'Watching',
        manga: 'Reading',
    };

    function clickHandler(e) {
        if (regex.test(e.target?.href)) {
            const [,, media] = e.target.href.match(regex);
            const [type] = media.split('list');
            waitForElems({
                sel: '.filters-wrap',
                onmatch(elem) {
                    elem.__vue__.setSectionFilter(list[type]);
                },
                stop: true,
            });
        }
    }

    waitForElems({
        sel: '#nav .links',
        onmatch(elem) {
            elem.addEventListener('click', clickHandler);
        },
    });
})();
