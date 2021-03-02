// ==UserScript==
// @name         AniList MAL Links
// @namespace    https://github.com/synthtech
// @description  Add links to MAL on media pages
// @version      1.0.2
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/anilist\.co\/(anime|manga)\/([0-9]+)(\/.*)?$/;

    async function getStore() {
        const store = sessionStorage.getItem('anilist-mal');
        if (!store) {
            const newStore = [];
            sessionStorage.setItem('anilist-mal', JSON.stringify(newStore));
            return newStore;
        }
        return JSON.parse(store);
    }

    async function updateStore(data) {
        const store = await getStore();
        store.push(data);
        sessionStorage.setItem('anilist-mal', JSON.stringify(store));
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
        updateStore({ anilist: id, mal: malId });
        return malId;
    }

    async function checkStore(id) {
        const store = await getStore();
        if (store) {
            const idList = store.map((item) => item.anilist);
            const match = idList.indexOf(id);
            if (store[match]) {
                const malId = store[match].mal;
                return malId;
            }
        }
        const malId = await fetchId(id);
        return malId;
    }

    async function getLink(elem) {
        const [, media, id] = location.href.match(REGEX);

        const malId = await checkStore(parseInt(id));

        const checkLink = elem.querySelector('.mal-link');
        if (malId) {
            if (checkLink) {
                checkLink.href = `https://myanimelist.net/${media}/${malId}`;
            } else {
                const link = document.createElement('a');
                const icon = document.createElement('img');
                link.href = `https://myanimelist.net/${media}/${malId}`;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = 'mal-link';
                icon.src = 'https://cdn.myanimelist.net/images/favicon.ico';
                icon.style.height = '1.9rem';
                icon.style.paddingLeft = '5px';
                icon.style.verticalAlign = 'top';
                link.appendChild(icon);
                elem.appendChild(link);
            }
        } else if (checkLink) {
            checkLink.remove();
        }
    }

    waitForUrl(REGEX, () => {
        waitForElems({
            sel: '.header .content h1',
            stop: true,
            onmatch(elem) {
                getLink(elem);
            },
        });
    });
})();
