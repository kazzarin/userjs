// ==UserScript==
// @name         Kitsu Character Link
// @namespace    https://github.com/synthtech
// @description  Link characters to MAL pages
// @version      1.1
// @author       synthtech
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(() => {
    const API = 'https://kitsu.io/api/edge';

    let App = {
        cache: {},
        checkImage(elem, cb) {
            let regex = /images\/([0-9]+)\//;
            if (elem.src && elem.src.match(regex)) {
                cb(elem.src.match(regex)[1]);
            } else if (elem.hasAttribute('data-src') && elem.getAttribute('data-src').match(regex)) {
                cb(elem.getAttribute('data-src').match(regex)[1]);
            } else {
                cb(null);
            }
        },
        getMalId(id, cb) {
            let self = this;
            if (self.cache.hasOwnProperty(id)) {
                cb(self.cache[id]);
            } else {
                fetch(`${API}/characters/${id}?fields[characters]=malId`, {
                    headers: new Headers({
                        'Accept': 'application/vnd.api+json'
                    })
                })
                .then(response => { return response.json() })
                .then(({data}) => {
                    let malId = data.attributes.malId;
                    self.cache[id] = malId;
                    cb(malId);
                })
            }
        }
    };

    // Favorite characters on profile
    waitForElems({
        sel: '.favorite-characters-panel img',
        onmatch(elem) {
            App.checkImage(elem, id => {
                id && App.getMalId(id, malId => {
                    if (malId) {
                        let link = elem.parentNode.parentNode;
                        link.href = `https://myanimelist.net/character/${malId}`;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                    }
                });
            });
        }
    });

    // Waifu/husbando
    waitForElems({
        sel: '.waifu-wrapper img',
        onmatch(elem) {
            App.checkImage(elem, id => {
                id && App.getMalId(id, malId => {
                    if (malId) {
                        let name = document.querySelector('.waifu-name');
                        let link = document.createElement('a');
                        link.textContent = name.textContent;
                        link.style.fontFamily = 'inherit';
                        link.href = `https://myanimelist.net/character/${malId}`;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        name.textContent = '';
                        name.appendChild(link);
                    }
                });
            });
        }
    });

    // Character list on media pages
    waitForElems({
        sel: '.character-grid .character-image img',
        onmatch(elem) {
            App.checkImage(elem, id => {
                id && App.getMalId(id, malId => {
                    if (malId) {
                        let link = elem.parentNode.parentNode;
                        link.href = `https://myanimelist.net/character/${malId}`;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                    }
                });
            });
        }
    })
})();
