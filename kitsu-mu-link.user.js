// ==UserScript==
// @name         Kitsu MU Link
// @namespace    https://github.com/synthtech
// @description  Add links to MangaUpdates pages
// @version      1.0.1
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(() => {
    const API = 'https://kitsu.io/api/edge';
    const REGEX = /^https?:\/\/kitsu\.io\/manga\/([^/]+)\/?(?:\?.*)?$/;

    let App = {
        cache: {},
        getMuLink(id, cb) {
            let self = this;
            if (self.cache.hasOwnProperty(id)) {
                cb(self.cache[id]);
            } else {
                fetch(`${API}/manga?filter[slug]=${id}&fields[manga]=id&include=mappings`, {
                    headers: new Headers({
                        'Accept': 'application/vnd.api+json'
                    })
                })
                .then(response => { return response.json() })
                .then(({included}) => {
                    let muId;
                    if (included) {
                        for (let i = 0; i < included.length; i++) {
                            if (included[i].attributes.externalSite === 'mangaupdates') {
                                muId = included[i].attributes.externalId;
                            }
                        }
                    }
                    self.cache[id] = muId;
                    cb(muId);
                })
            }
        }
    };

    waitForUrl(REGEX, () => {
        let slug = location.href.match(REGEX)[1];
        waitForElems({
            sel: '.media-summary',
            stop: true,
            onmatch(node) {
                let url = location.href;
                App.getMuLink(slug, muId => {
                    let check = document.querySelector('#external-links');
                    if (!muId && check) check.remove();

                    if (location.href === url && muId) {
                        if (check) {
                            let updateLink = document.querySelector('#external-links a');
                            updateLink.href = `https://www.mangaupdates.com/series.html?id=${muId}`;
                        } else {
                            let section = document.createElement('section');
                            section.id = 'external-links';
                            section.className = 'media--information';

                            let header = document.createElement('h5');
                            header.textContent = 'External Links';
                            section.appendChild(header);

                            let listWrap = document.createElement('ul');
                            let list = document.createElement('li');
                            listWrap.appendChild(list);
                            section.appendChild(listWrap);

                            let link = document.createElement('a');
                            link.href = `https://www.mangaupdates.com/series.html?id=${muId}`;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                            link.textContent = 'MangaUpdates';
                            list.appendChild(link);

                            node.appendChild(section);
                        }
                    }
                });
            }
        });
    });
})();
