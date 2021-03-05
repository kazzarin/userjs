// ==UserScript==
// @name         AniList MAL Links
// @namespace    https://github.com/synthtech
// @description  Add links to MAL on media pages
// @version      2.1
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/anilist\.co\/(anime|manga)\/([0-9]+)(\/.*)?$/;

    const linkProps = {
        target: '_blank',
        rel: 'noopener noreferrer',
        id: 'mal-link',
    };

    const imgProps = {
        src: 'https://cdn.myanimelist.net/images/favicon.ico',
        style: {
            height: '1.9rem',
            paddingLeft: '5px',
            verticalAlign: 'top',
        },
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

    async function getLink(elem) {
        const [, media, id] = location.href.match(REGEX);
        const malId = await checkStore(parseInt(id));
        const checkLink = document.querySelector('#mal-link');
        if (malId) {
            if (checkLink) {
                checkLink.href = `https://myanimelist.net/${media}/${malId}`;
            } else {
                const link = await newElem('a', linkProps);
                const icon = await newElem('img', imgProps);
                link.href = `https://myanimelist.net/${media}/${malId}`;
                link.appendChild(icon);
                elem.appendChild(link);
            }
        } else if (checkLink) {
            checkLink.remove();
        }
    }

    waitForUrl(REGEX, () => {
        waitForElems({
            sel: '.media .header .content > h1',
            onmatch: async (elem) => {
                await getLink(elem);
            },
        });
    });
})();
