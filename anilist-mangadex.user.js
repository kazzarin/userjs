// ==UserScript==
// @name         AniList MangaDex Links
// @namespace    https://github.com
// @description  Add links to MangaDex search on manga pages
// @version      1.3.1
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==

/* global VM */

(() => {
    const regex = /\/(anime|manga)\/[0-9]+(\/.*)?/;

    function clickHandler() {
        const title = document.querySelector('.sidebar .data').__vue__.media.title.userPreferred;
        const queryUrl = `https://mangadex.org/titles?q=${encodeURIComponent(title)}`;
        window.open(queryUrl, '_blank', 'noopener,noreferrer');
    }

    function createLink(elem) {
        const [, media] = location.pathname.match(regex);
        const checkLink = document.querySelector('#md-label');

        if (media === 'anime') {
            if (checkLink) {
                checkLink.removeEventListener('click', clickHandler);
                checkLink.remove();
            }
        } else if (media === 'manga') {
            if (!checkLink) {
                const dataAttr = document.querySelector('.header-wrap').__vue__.$options._scopeId;
                const label = VM.hm('div', {
                    className: 'adult-label',
                    id: 'md-label',
                    [dataAttr]: '',
                    style: 'background: #ff6740;cursor: pointer;',
                }, 'MD');
                label.addEventListener('click', clickHandler);
                elem.appendChild(label);
            }
        }
    }

    function watchElem() {
        VM.observe(document.body, () => {
            const node = document.querySelector('.media .header .content > h1');
            if (node) {
                createLink(node);
                return true;
            }
            return false;
        });
    }

    function routeWatch() {
        const app = document.getElementById('app');
        if (app.__vue__) {
            app.__vue__.$router.afterEach((newRoute) => {
                if (regex.test(newRoute.path)) {
                    watchElem();
                }
            });
        } else {
            setTimeout(routeWatch, 300);
        }
    }

    if (regex.test(location.pathname)) {
        watchElem();
    }

    routeWatch();
})();
