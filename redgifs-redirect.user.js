// ==UserScript==
// @name         Redgifs Redirect
// @namespace    https://github.com/synthtech
// @description  Redirect redgifs pages to source video
// @version      3.0.0
// @author       synthtech
// @match        https://www.redgifs.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
    const regex = /\/watch\/([A-Za-z-]+)/;

    async function fetchVid(id) {
        const res = await fetch(`https://api.redgifs.com/v2/gifs/${id}`);
        if (res.ok) {
            const { gif } = await res.json();
            return gif.urls.hd;
        }
        return null;
    }

    async function checkLink(url) {
        const [, slug] = url.match(regex);
        const id = slug.split('-')[0];
        return fetchVid(id);
    }

    async function redirect(path) {
        if (regex.test(path)) {
            const link = await checkLink(path);
            if (link) {
                location.assign(link);
            }
        }
    }

    history.pushState = (...args) => {
        const [,, url] = args;
        if (url) redirect(url);
        History.prototype.pushState.apply(history, args);
    };

    redirect(location.pathname);
})();
