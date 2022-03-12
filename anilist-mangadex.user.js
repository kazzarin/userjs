// ==UserScript==
// @name         AniList MangaDex Links
// @namespace    https://github.com
// @description  Add links to MangaDex search on manga pages
// @version      1.2.0
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/anilist\.co\/(anime|manga)\/[0-9]+(\/.*)?$/;

    const labelProps = {
        className: 'adult-label',
        textContent: 'MD',
        style: {
            background: '#ff6740',
            cursor: 'pointer',
        },
        id: 'md-label',
    };

    async function newElem(type, props, attrs) {
        const elem = document.createElement(type);
        if (props) {
            Object.entries(props).forEach((attr) => {
                const [k, v] = attr;
                if (k === 'style') {
                    Object.entries(v).forEach((prop) => {
                        const [l, w] = prop;
                        elem.style[l] = w;
                    });
                } else {
                    elem[k] = v;
                }
            });
        }
        if (attrs) {
            Object.entries(attrs).forEach((attr) => {
                const [k, v] = attr;
                elem.setAttribute(k, v);
            });
        }
        return elem;
    }

    function clickHandler() {
        const title = document.querySelector('.sidebar .data').__vue__.media.title.userPreferred;
        const queryUrl = `https://mangadex.org/titles?q=${encodeURIComponent(title)}`;
        window.open(queryUrl, '_blank', 'noopener,noreferrer');
    }

    async function createLink(elem) {
        const [, media] = location.href.match(REGEX);
        const checkLink = document.querySelector('#md-label');

        if (media === 'anime') {
            if (checkLink) {
                checkLink.removeEventListener('click', clickHandler);
                checkLink.remove();
            }
        } else if (media === 'manga') {
            if (!checkLink) {
                const dataAttr = document.querySelector('.header-wrap').__vue__.$options._scopeId;
                const label = await newElem('div', labelProps, { [dataAttr]: '' });
                label.addEventListener('click', clickHandler);
                elem.appendChild(label);
            }
        }
    }

    waitForUrl(REGEX, () => {
        waitForElems({
            sel: '.media .header .content > h1',
            stop: true,
            onmatch: async (elem) => {
                await createLink(elem);
            },
        });
    });
})();
