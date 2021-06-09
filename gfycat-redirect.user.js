// ==UserScript==
// @name         Gfycat Redirect
// @namespace    https://github.com/synthtech
// @description  Redirect gfycat pages to source video
// @version      2.0.2
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://gfycat.com/*
// @match        *://www.redgifs.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/(www\.)?(gfycat\.com|redgifs\.com)\/(watch\/)?([A-Za-z-]+)$/;

    async function fetchVid(host, id) {
        const res = await fetch(`https://api.${host}/v1/gfycats/${id}`);
        if (res.ok) {
            const { gfyItem } = await res.json();
            return gfyItem.mp4Url;
        }
        return null;
    }

    async function checkLink(url) {
        const [,, host,, slug] = url.match(REGEX);
        const id = slug.split('-')[0];
        return fetchVid(host, id);
    }

    async function redirect(url) {
        const link = await checkLink(url);
        if (link) {
            location.assign(link);
        }
    }

    waitForUrl(REGEX, async (url) => redirect(url));
})();
