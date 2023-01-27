// ==UserScript==
// @name         Kitsu Character Link
// @namespace    https://github.com
// @description  Link characters to MAL pages
// @version      2.0.1
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @match        https://kitsu.io/*
// @grant        none
// ==/UserScript==

/* global VM, waitForElems */

(() => {
    function getCharId(elem) {
        const regex = /images\/(\d+)\//;
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
        if (store) return new Map(JSON.parse(store));
        const newStore = new Map();
        localStorage.setItem('kitsu-character', JSON.stringify(Array.from(newStore.entries())));
        return newStore;
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
            if (store.has(id)) return store.get(id);
        }
        return fetchMalId(id);
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
                    const link = VM.hm('a', {
                        href: `https://myanimelist.net/character/${mal}`,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        style: 'font-family: inherit;',
                    }, name.textContent);
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
