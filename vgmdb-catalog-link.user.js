// ==UserScript==
// @name         VGMDB Catalog Link
// @namespace    https://github.com/synthtech
// @description  Link catalog codes to CDJapan
// @version      1.0
// @author       synthtech
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://vgmdb.net/*
// @grant        none
// ==/UserScript==

(() => {
    const API = 'https://www.cdjapan.co.jp/api';
    const REGEX = /^https?:\/\/vgmdb\.net\/album\/[0-9]+$/;

    let App = {
        getAlbumLink(code, cb) {
            fetch(`${API}/products/json?q=${code}`)
            .then(response => { return response.json(); })
            .then(({record}) => { cb(record); })
        }
    };

    waitForUrl(REGEX, () => {
        waitForElems({
            sel: '#album_infobit_large tr:first-child > td:last-child',
            stop: true,
            onmatch(elem) {
                let code = elem.textContent;
                App.getAlbumLink(code, results => {
                    if (results) {
                        if (results[0].prodKey = code) {
                            let link = document.createElement('a');
                            link.href = `http://www.cdjapan.co.jp/product/${code}`;
                            link.textContent = code;
                            elem.innerHTML = link;
                        }
                    }
                });
            }
        })
    });
})();
