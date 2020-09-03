// ==UserScript==
// @name         AniList MangaDex Links
// @namespace    https://github.com/synthtech
// @description  Add links to MangaDex search on manga pages
// @version      1.0.2
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/anilist\.co\/(anime|manga)\/[0-9]+(\/.*)?$/;

    waitForUrl(REGEX, () => {
        const media = location.href.match(REGEX)[1];
        waitForElems({
            sel: '.header .content h1',
            stop: true,
            onmatch(elem) {
                const title = elem.textContent;
                const checkLink = elem.querySelector('.mangadex-link');

                if (media === 'anime') {
                    if (checkLink) {
                        checkLink.remove();
                    }
                } else if (media === 'manga') {
                    if (checkLink) {
                        checkLink.href = `https://mangadex.org/quick_search/${title}`;
                    } else {
                        const link = document.createElement('a');
                        const icon = document.createElement('img');
                        link.href = `https://mangadex.org/quick_search/${title}`;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        link.className = 'mangadex-link';
                        icon.src = 'https://mangadex.org/favicon-96x96.png';
                        icon.style.height = '1.9rem';
                        icon.style.paddingLeft = '5px';
                        icon.style.verticalAlign = 'top';
                        link.appendChild(icon);
                        elem.appendChild(link);
                    }
                }
            }
        })
    });
})();
