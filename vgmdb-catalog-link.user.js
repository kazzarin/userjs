// ==UserScript==
// @name         VGMDB Catalog Link
// @namespace    https://github.com/synthtech
// @description  Link catalog codes to CDJapan
// @version      1.0.2
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://vgmdb.net/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(() => {
    const API = 'https://www.cdjapan.co.jp/api';
    const REGEX = /^https?:\/\/vgmdb\.net\/album\/[0-9]+$/;

    const App = {
        getAlbumLink(code, cb) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${API}/products/json?q=${code}`,
                onload(response) {
                    try {
                        const json = JSON.parse(response.responseText);
                        if (json.record) { cb(json.record); }
                    } catch (err) {
                        console.log('Failed to parse API results');
                    }
                },
                onerror() {
                    console.log('Failed to get API data');
                },
            });
        },
    };

    waitForUrl(REGEX, () => {
        waitForElems({
            sel: '#album_infobit_large tr:first-child > td:last-child',
            stop: true,
            onmatch(elem) {
                const codeElem = elem;
                const code = codeElem.textContent.trim();
                if (code && code !== 'N/A') {
                    App.getAlbumLink(code, (results) => {
                        if (results.length > 0) {
                            if (results[0].prodkey === code) {
                                const link = document.createElement('a');
                                link.href = `http://www.cdjapan.co.jp/product/${code}`;
                                link.target = '_blank';
                                link.rel = 'noopener noreferrer';
                                link.textContent = code;
                                codeElem.textContent = '';
                                codeElem.appendChild(link);
                            }
                        }
                    });
                }
            },
        });
    });
})();
