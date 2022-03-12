// ==UserScript==
// @name         AniList MAL Links
// @namespace    https://github.com
// @description  Add links to MAL on media pages
// @version      2.6.0
// @license      0BSD
// @author       Zarin
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const store = new Map();
    const regex = /\/(anime|manga)\/([0-9]+)(\/.*)?/;

    const linkProps = {
        target: '_blank',
        rel: 'noopener noreferrer',
        id: 'mal-link',
    };

    const labelProps = {
        className: 'adult-label',
        textContent: 'MAL',
        style: {
            background: '#2e51a2',
        },
        id: 'mal-label',
    };

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

    // TODO: Create reusable elem only once on script load
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
                const link = await newElem('a', linkProps);
                const label = await newElem('div', labelProps, { [dataAttr]: '' });
                link.href = `https://myanimelist.net/${media}/${malId}`;
                link.appendChild(label);
                elem.appendChild(link);
            }
        } else if (checkLink) {
            checkLink.remove();
        }
    }

    async function watchElem(watch, func) {
        const mut = new MutationObserver(async (_mutations, observer) => {
            const elem = document.querySelector(watch);
            if (elem) {
                observer.disconnect();
                await func(elem);
            }
        });
        mut.observe(document.body, { subtree: true, childList: true });
    }

    async function routeWatch() {
        const app = document.getElementById('app');
        if (app.__vue__) {
            app.__vue__.$router.afterEach((newRoute) => {
                if (regex.test(newRoute.path)) {
                    watchElem('.media .header .content > h1', getLink);
                }
            });
        } else {
            setTimeout(routeWatch, 300);
        }
    }

    if (regex.test(location.pathname)) {
        watchElem('.media .header .content > h1', getLink);
    }

    routeWatch();
})();
