// ==UserScript==
// @name         AniList MangaDex Links
// @namespace    https://github.com/synthtech
// @description  Add links to MangaDex search on manga pages
// @version      1.1.0
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/anilist\.co\/(anime|manga)\/[0-9]+(\/.*)?$/;

    async function newElem(type, props) {
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
        return elem;
    }

    async function createLink(elem) {
        const [, media] = location.href.match(REGEX);
        const checkLink = document.querySelector('#md-link');

        if (media === 'anime') {
            if (checkLink) checkLink.remove();
        } else if (media === 'manga') {
            const title = encodeURIComponent(elem.textContent.trim());

            if (checkLink) checkLink.href = `https://mangadex.org/titles/#${title}`;
            else {
                const link = await newElem('a', {
                    href: `https://mangadex.org/titles/#${title}`,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    id: 'md-link',
                });
                const icon = await newElem('img', {
                    src: 'https://mangadex.org/icons/favicon-32x32.png',
                    style: {
                        height: '1.9rem',
                        paddingLeft: '5px',
                        verticalAlign: 'top',
                    },
                });
                link.appendChild(icon);
                elem.appendChild(link);
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
