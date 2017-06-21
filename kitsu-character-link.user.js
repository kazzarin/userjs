// ==UserScript==
// @name         Kitsu Character Link
// @description  Link characters to MAL pages
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var SCRIPT_NAME = 'Kitsu Character Link';
    var API = 'https://kitsu.io/api/edge';

    var Util = {
        log: function() {
            var args = [].slice.call(arguments);
            args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: #233c7b;');
            console.log.apply(console, args);
        },
        q: function(query, context) {
            return (context || document).querySelector(query);
        },
        qq: function(query, context) {
            return [].slice.call((context || document).querySelectorAll(query));
        }
    };

    var App = {
        getMalId: function(id, cb) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: API + '/characters/' + id + '?fields[characters]=malId',
                headers: {
                    'Accept': 'application/vnd.api+json'
                },
                onload: function(response) {
                    try {
                        var json = JSON.parse(response.responseText);
                        cb(json.data.attributes.malId);
                    } catch (err) {
                        Util.log('Failed to parse character API results');
                    }
                },
                onerror: function() {
                    Util.log('Failed to get Kitsu character data');
                }
            });
        }
    };

    // Favorite characters on profile
    waitForElems({
        sel: '.favorite-characters-panel img',
        stop: false,
        onmatch: function(character) {
            if (character.src) {
                var id = character.src.match(/images\/([0-9]+)\//)[1];
            } else if (character.hasAttribute('data-src')) {
                var id = character.getAttribute('data-src').match(/images\/([0-9]+)\//)[1];
            }
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

    // Waifu/husbando
    waitForElems({
        sel: '.waifu-wrapper img',
        stop: false,
        onmatch: function(waifu) {
            var id = waifu.src.match(/images\/([0-9]+)\//)[1];
            App.getMalId(id, function(malId) {
                if (malId) {
                    var name = Util.q('.waifu-name');
                    var link = document.createElement('a');
                    link.textContent = name.textContent;
                    link.style = 'font-family:inherit';
                    link.href = 'https://myanimelist.net/character/' + malId;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    name.textContent = '';
                    name.appendChild(link);
                }
            });
        }
    });

    // Character list on media pages
    waitForElems({
        sel: '.character-grid .character-image img',
        stop: false,
        onmatch: function (character) {
            if (character.src) {
                var id = character.src.match(/images\/([0-9]+)\//)[1];
            } else if (character.hasAttribute('data-src')) {
                var id = character.getAttribute('data-src').match(/images\/([0-9]+)\//)[1];
            }
            App.getMalId(id, function(malId) {
                if (malId) {
                    var link = character.parentElement.parentElement;
                    link.href = 'https://myanimelist.net/character/' + malId;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                }
            });
        }
    })
})();
