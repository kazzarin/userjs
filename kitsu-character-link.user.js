// ==UserScript==
// @name         Kitsu Character Link
// @namespace    https://github.com
// @description  Link characters to MAL pages
// @version      2.0.0
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    async function getCharId(elem) {
        const regex = /images\/([0-9]+)\//;
        if (elem.src && elem.src.match(regex)) {
            return elem.src.match(regex)[1];
        }
        if (elem.hasAttribute('data-src') && elem.getAttribute('data-src').match(regex)) {
            return elem.getAttribute('data-src').match(regex)[1];
        }
        return null;
    }

    async function getStore() {
        const store = localStorage.getItem('kitsu-character');
        if (!store) {
            const newStore = new Map();
            localStorage.setItem('kitsu-character', JSON.stringify(Array.from(newStore.entries())));
            return newStore;
        }
        return new Map(JSON.parse(store));
    }

    async function updateStore(data) {
        const store = await getStore();
        const [k, v] = data;
        store.set(k, v);
        localStorage.setItem('kitsu-character', JSON.stringify(Array.from(store.entries())));
    }

    async function fetchMalId(id) {
        // Note: graphql api doesn't contain the malid
        const res = await fetch(`https://kitsu.io/api/edge/characters/${id}?fields[characters]=malId`, {
            headers: { Accept: 'application/vnd.api+json' },
        });
        if (res.ok) {
            const { data } = await res.json();
            const { malId } = data.attributes;
            updateStore([id, malId]);
            return malId;
        }
        return null;
    }

    async function checkStore(id) {
        const store = await getStore();
        if (store) {
            if (store.has(id)) {
                return store.get(id);
            }
        }
        return fetchMalId(id);
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

    // Waifu/husbando
    waitForElems({
        sel: '.about-stat .waifu-wrapper img',
        onmatch: async (elem) => {
            const id = await getCharId(elem);
            if (id) {
                const mal = await checkStore(parseInt(id));
                if (mal) {
                    const name = document.querySelector('.waifu-name');
                    const link = await newElem('a', {
                        textContent: name.textContent,
                        style: {
                            fontFamily: 'inherit',
                        },
                        href: `https://myanimelist.net/character/${mal}`,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                    });
                    name.textContent = '';
                    name.appendChild(link);
                }
            }
        },
    });

    // Favorite characters on profile
    waitForElems({
        sel: '.favorite-characters-panel img',
        onmatch: async (elem) => {
            const id = await getCharId(elem);
            if (id) {
                const mal = await checkStore(parseInt(id));
                if (mal) {
                    const link = elem.parentNode.parentNode;
                    link.href = `https://myanimelist.net/character/${mal}`;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                }
            }
        },
    });

    // Character list on media pages
    waitForElems({
        sel: '.character-grid .character-image img',
        onmatch: async (elem) => {
            const id = await getCharId(elem);
            if (id) {
                const mal = await checkStore(parseInt(id));
                if (mal) {
                    const link = elem.parentNode.parentNode;
                    link.href = `https://myanimelist.net/character/${mal}`;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                }
            }
        },
    });
})();
