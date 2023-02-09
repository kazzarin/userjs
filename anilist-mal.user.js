// ==UserScript==
// @name         AniList MAL Links
// @namespace    https://github.com
// @description  Add links to MAL on media pages
// @version      2.7.4
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/index.js
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==

/* global VM */

(() => {
    const store = new Map();
    const regex = /\/(anime|manga)\/(\d+)(\/.*)?/;

    async function updateStore(data) {
        const [k, v] = data;
        store.set(k, v);
    }

    async function fetchId(id) {
        const res = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: 'query media($id: Int) { Media(id: $id) { idMal } }',
                variables: { id },
            }),
        });
        const { data } = await res.json();
        const malId = data.Media?.idMal;
        updateStore([id, malId]);
        return malId;
    }

    async function checkStore(id) {
        if (store) {
            if (store.has(id)) {
                return store.get(id);
            }
        }
        const malId = await fetchId(id);
        return malId;
    }

    // TODO: Split this up and add more URL checks before checking storage
    async function getLink(elem) {
        const [, media, id] = location.pathname.match(regex);
        const malId = await checkStore(parseInt(id));
        const checkLink = document.querySelector('#mal-link');
        if (malId) {
            if (checkLink) {
                checkLink.href = `https://myanimelist.net/${media}/${malId}`;
            } else {
                const dataAttr = document.querySelector('.header-wrap').__vue__.$options._scopeId;
                const label = VM.hm('div', {
                    className: 'adult-label',
                    id: 'mal-label',
                    [dataAttr]: '',
                    style: 'background: #2e51a2;',
                }, 'MAL');
                const link = VM.hm('a', {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    id: 'mal-link',
                    href: `https://myanimelist.net/${media}/${malId}`,
                }, label);
                elem.appendChild(link);
            }
        } else if (checkLink) {
            checkLink.remove();
        }
    }

    function watchElem() {
        VM.observe(document.body, () => {
            const node = document.querySelector('.media .header .content > h1');
            if (node) {
                getLink(node);
                return true;
            }
            return false;
        });
    }

    function routeWatch() {
        const app = document.getElementById('app');
        if (app?.__vue__) {
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
