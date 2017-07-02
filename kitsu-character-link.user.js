// ==UserScript==
// @name         Kitsu Character Link
// @description  Link characters to MAL pages
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var API = 'https://kitsu.io/api/edge';

    var App = {
        cache: {},
        checkImage: function(elem, cb) {
            var regex = /images\/([0-9]+)\//;
            if (elem.src && elem.src.match(regex)) {
                cb(elem.src.match(regex)[1]);
            } else if (elem.hasAttribute('data-src') && elem.getAttribute('data-src').match(regex)) {
                cb(elem.getAttribute('data-src').match(regex)[1]);
            } else {
                cb(null);
            }
        },
        getMalId: function(id, cb) {
            var self = this;
            if (self.cache.hasOwnProperty(id)) {
                cb(self.cache[id]);
            } else {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: API + '/characters/' + id + '?fields[characters]=malId',
                    headers: {
                        'Accept': 'application/vnd.api+json'
                    },
                    onload: function(response) {
                        try {
                            var json = JSON.parse(response.responseText);
                            var malId = json.data.attributes.malId;
                            self.cache[id] = malId;
                            cb(malId);
                        } catch (err) {
                            console.log('Failed to parse character API results');
                        }
                    },
                    onerror: function() {
                        console.log('Failed to get Kitsu character data');
                    }
                });
            }
        }
    };

    // Favorite characters on profile
    waitForElems({
        sel: '.favorite-characters-panel img',
        stop: false,
        onmatch: function(character) {
            App.checkImage(character, function(id) {
                if (id) {
                    App.getMalId(id, function(malId) {
                        if (malId) {
                            var link = character.parentElement.parentElement;
                            link.href = 'https://myanimelist.net/character/' + malId;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                        }
                    });
                }
            });
        }
    });

    // Waifu/husbando
    waitForElems({
        sel: '.waifu-wrapper img',
        stop: false,
        onmatch: function(waifu) {
            App.checkImage(waifu, function(id) {
                if (id) {
                    App.getMalId(id, function(malId) {
                        if (malId) {
                            var name = document.querySelector('.waifu-name');
                            var link = document.createElement('a');
                            link.textContent = name.textContent;
                            link.style.fontFamily = 'inherit';
                            link.href = 'https://myanimelist.net/character/' + malId;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                            name.textContent = '';
                            name.appendChild(link);
                        }
                    });
                }
            });
        }
    });

    // Character list on media pages
    waitForElems({
        sel: '.character-grid .character-image img',
        stop: false,
        onmatch: function (character) {
            App.checkImage(character, function(id) {
                if (id) {
                    App.getMalId(id, function(malId) {
                        if (malId) {
                            var link = character.parentElement.parentElement;
                            link.href = 'https://myanimelist.net/character/' + malId;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                        }
                    });
                }
            });
        }
    })
})();
