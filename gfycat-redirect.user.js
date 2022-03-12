// ==UserScript==
// @name         Gfycat Redirect
// @namespace    https://github.com
// @description  Redirect gfycat pages to source video
// @version      3.0.0
// @author       Zarin
// @match        https://gfycat.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
    const regex = /\/([A-Za-z-]+)/;

    async function fetchVid(id) {
        const res = await fetch(`https://api.gfycat.com/v1/gfycats/${id}`);
        if (res.ok) {
            const { gfyItem } = await res.json();
            return gfyItem.mp4Url;
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
