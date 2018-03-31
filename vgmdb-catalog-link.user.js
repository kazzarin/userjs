// ==UserScript==
// @name         VGMDB Catalog Link
// @namespace    https://github.com/synthtech
// @description  Link catalog codes to CDJapan
// @version      1.0.1
// @author       synthtech
// @require      https://cdn.rawgit.com/fuzetsu/userscripts/477063e939b9658b64d2f91878da20a7f831d98b/wait-for-elements/wait-for-elements.js
// @match        *://vgmdb.net/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(() => {
    const API = 'https://www.cdjapan.co.jp/api';
    const REGEX = /^https?:\/\/vgmdb\.net\/album\/[0-9]+$/;

    let App = {
        getAlbumLink(code, cb) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${API}/products/json?q=${code}`,
                onload(response) {
                    try {
                        let json = JSON.parse(response.responseText);
                        if (json.record) { cb(json.record); }
                    } catch (err) {
                      console.log('Failed to parse API results');
                    }
                },
                onerror() {
                    console.log('Failed to get API data');
                }
            });
        }
    };

    waitForUrl(REGEX, () => {
        waitForElems({
            sel: '#album_infobit_large tr:first-child > td:last-child',
            stop: true,
            onmatch(elem) {
                let code = elem.textContent.trim();
                if (code && code !== 'N/A') {
                    App.getAlbumLink(code, results => {
                        if (results.length > 0) {
                            if (results[0].prodkey == code) {
                                let link = document.createElement('a');
                                link.href = `http://www.cdjapan.co.jp/product/${code}`;
                                link.target = '_blank';
                                link.rel = 'noopener noreferrer';
                                link.textContent = code;
                                elem.textContent = '';
                                elem.appendChild(link);
                            }
                        }
                    });
                }
            }
        })
    });
})();
