// ==UserScript==
// @name         Redgifs Redirect
// @namespace    https://github.com
// @description  Redirect redgifs pages to source video
// @version      4.1.0
// @license      0BSD
// @author       Zarin
// @match        https://www.redgifs.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
    const vidPattern = /\/watch\/([a-z]+)/;
    const headers = new Headers({
        referer: 'https://www.redgifs.com/',
        origin: 'https://www.redgifs.com',
        'content-type': 'application/json',
    });

    async function fetchToken() {
        const res = await fetch('https://api.redgifs.com/v2/auth/temporary');
        if (res.ok) {
            const { token } = await res.json();
            if (token) {
                localStorage.setItem('token', token);
                return token;
            }
            return new Error('Failed to find token');
        }
        return new Error('Failed to retrieve temporary token');
    }

    async function fetchVid(id, token) {
        headers.set('authorization', `Bearer ${token}`);
        headers.set('x-customheader', location.href);
        const res = await fetch(`https://api.redgifs.com/v2/gifs/${id}`, { headers });
        if (res.ok) {
            const { gif } = await res.json();
            return gif.urls.hd;
        }
        if (res.status === 401) {
            localStorage.removeItem('token');
            const newToken = await fetchToken();
            return typeof newToken === 'string' ? fetchVid(id, newToken) : newToken;
        }
        return new Error(`API responded with ${res.status} ${res.statusText}`);
    }

    async function checkToken() {
        const token = localStorage.getItem('token');
        return token || fetchToken();
    }

    async function checkLink(url) {
        const [, slug] = url.match(vidPattern);
        const token = await checkToken();
        return typeof token === 'string' ? fetchVid(slug, token) : token;
    }

    async function redirect(path) {
        if (vidPattern.test(path)) {
            const link = await checkLink(path);
            if (link instanceof Error) throw link;
            if (typeof link === 'string') location.assign(link);
        }
    }

    history.pushState = (...args) => {
        const [,, url] = args;
        if (url) redirect(url);
        History.prototype.pushState.apply(history, args);
    };

    redirect(location.pathname);
})();
