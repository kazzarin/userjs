// ==UserScript==
// @name         AniList MAL Links
// @namespace    https://github.com/synthtech
// @description  Add links to MAL on media pages
// @version      1.0.1
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/anilist\.co\/(anime|manga)\/([0-9]+)(\/.*)?$/;

    const App = {
        cache: {},
        getMalId(id, media, cb) {
            let self = this;
            let cacheId = `${media}-${id}`;
            if (self.cache.hasOwnProperty(cacheId)) {
                cb(self.cache[cacheId]);
            } else {
                fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        query: `query media($id: Int, $type: MediaType) { Media(id: $id, type: $type) { idMal } }`,
                        variables: { id, 'type': media.toUpperCase() }
                    })
                })
                .then(res => { return res.json() })
                .then(({data}) => {
                    let malId = data.Media.idMal;
                    self.cache[cacheId] = malId;
                    cb(malId);
                })
            }
        }
    };

    waitForUrl(REGEX, () => {
        const media = location.href.match(REGEX)[1];
        waitForElems({
            sel: '.header .content h1',
            stop: true,
            onmatch(elem) {
                const id = location.href.match(REGEX)[2];

                App.getMalId(id, media, malId => {
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
                    } else {
                        if (checkLink) {
                            checkLink.remove();
                        }
                    }
                });
            }
        })
    });
})();
