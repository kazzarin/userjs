// ==UserScript==
// @name         AniList MAL Links
// @namespace    https://github.com/synthtech
// @description  Add links to MAL on media pages
// @version      2.5.1
// @author       synthtech
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
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

    async function getStore() {
        const store = sessionStorage.getItem('anilist-mal');
        if (!store) {
            const newStore = new Map();
            sessionStorage.setItem('anilist-mal', JSON.stringify(Array.from(newStore.entries())));
            return newStore;
        }
        return new Map(JSON.parse(store));
    }

    async function updateStore(data) {
        const store = await getStore();
        const [k, v] = data;
        store.set(k, v);
        sessionStorage.setItem('anilist-mal', JSON.stringify(Array.from(store.entries())));
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
        const malId = data.Media.idMal;
        updateStore([id, malId]);
        return malId;
    }

    async function checkStore(id) {
        const store = await getStore();
        if (store) {
            if (store.has(id)) {
                return store.get(id);
            }
        }
        const malId = await fetchId(id);
        return malId;
    }

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

    function watchElem(watch, func) {
        const mut = new MutationObserver(async (_mutations, observer) => {
            const elem = document.querySelector(watch);
            if (elem) {
                observer.disconnect();
                await func(elem);
            }
        });
        mut.observe(document.body, { subtree: true, childList: true });
    }

    async function routeWatch(elem) {
        elem.__vue__.$watch('$route', (newRoute) => {
            if (regex.test(newRoute.path)) {
                watchElem('.media .header .content > h1', getLink);
            }
        });
    }

    if (regex.test(location.pathname)) {
        watchElem('.media .header .content > h1', getLink);
    }

    const app = document.getElementById('app');
    if (app) {
        routeWatch(app);
    } else {
        watchElem('#app', routeWatch);
    }
})();
