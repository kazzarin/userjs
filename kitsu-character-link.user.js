// ==UserScript==
// @name         Kitsu Character Link
// @namespace    https://github.com/synthtech
// @description  Link characters to MAL pages
// @version      1.1.3
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(() => {
    const API = 'https://kitsu.io/api/edge';

    const App = {
        cache: {},
        checkImage(elem, cb) {
            const regex = /images\/([0-9]+)\//;
            if (elem.src && elem.src.match(regex)) {
                cb(elem.src.match(regex)[1]);
            } else if (elem.hasAttribute('data-src') && elem.getAttribute('data-src').match(regex)) {
                cb(elem.getAttribute('data-src').match(regex)[1]);
            } else {
                cb(null);
            }
        },
        getMalId(id, cb) {
            const self = this;
            if (Object.prototype.hasOwnProperty.call(self.cache, id)) {
                cb(self.cache[id]);
            } else {
                fetch(`${API}/characters/${id}?fields[characters]=malId`, {
                    headers: new Headers({
                        Accept: 'application/vnd.api+json',
                    }),
                })
                    .then((response) => response.json())
                    .then(({ data }) => {
                        const { malId } = data.attributes;
                        self.cache[id] = malId;
                        cb(malId);
                    });
            }
        },
    };

    // Favorite characters on profile
    waitForElems({
        sel: '.favorite-characters-panel img',
        onmatch(elem) {
            App.checkImage(elem, (id) => {
                if (id) {
                    App.getMalId(id, (malId) => {
                        if (malId) {
                            const link = elem.parentNode.parentNode;
                            link.href = `https://myanimelist.net/character/${malId}`;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                        }
                    });
                }
            });
        },
    });

    // Waifu/husbando
    waitForElems({
        sel: '.about-stat .waifu-wrapper img',
        onmatch(elem) {
            App.checkImage(elem, (id) => {
                if (id) {
                    App.getMalId(id, (malId) => {
                        if (malId) {
                            const name = document.querySelector('.waifu-name');
                            const link = document.createElement('a');
                            link.textContent = name.textContent;
                            link.style.fontFamily = 'inherit';
                            link.href = `https://myanimelist.net/character/${malId}`;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                            name.textContent = '';
                            name.appendChild(link);
                        }
                    });
                }
            });
        },
    });

    // Character list on media pages
    waitForElems({
        sel: '.character-grid .character-image img',
        onmatch(elem) {
            App.checkImage(elem, (id) => {
                if (id) {
                    App.getMalId(id, (malId) => {
                        if (malId) {
                            const link = elem.parentNode.parentNode;
                            link.href = `https://myanimelist.net/character/${malId}`;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                        }
                    });
                }
            });
        },
    });
})();
