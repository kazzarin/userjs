// ==UserScript==
// @name         AniList Header Links
// @namespace    https://github.com
// @description  Add links to submit anime/manga in header
// @version      1.1.2
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/index.js
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==

/* global VM */

(() => {
    async function navigate(id) {
        const app = document.getElementById('app');
        // Redirecting to a different component page is necessary to avoid
        // buggy navigation between submission pages
        if (id === 'submit-anime') {
            await app.__vue__.$router.push({ name: 'Maintenance' });
            await app.__vue__.$router.push({ path: '/edit/anime/new' });
        }
        if (id === 'submit-manga') {
            await app.__vue__.$router.push({ name: 'Maintenance' });
            await app.__vue__.$router.push({ path: '/edit/manga/new' });
        }
    }

    function clickHandler(e) {
        e.preventDefault();
        navigate(e.target?.id);
    }

    function addSubmitLinks(elem) {
        const dataAttr = document.querySelector('#nav').__vue__.$options._scopeId;
        const animeLink = VM.hm('a', {
            className: 'link',
            href: '/edit/anime/new',
            id: 'submit-anime',
            [dataAttr]: '',
        }, 'new anime');
        const mangaLink = VM.hm('a', {
            className: 'link',
            href: '/edit/manga/new',
            id: 'submit-manga',
            [dataAttr]: '',
        }, 'new manga');
        animeLink.addEventListener('click', clickHandler);
        mangaLink.addEventListener('click', clickHandler);
        elem.appendChild(animeLink);
        elem.appendChild(mangaLink);
    }

    // No point displaying links unless logged in
    if (localStorage.getItem('auth')) {
        VM.observe(document.body, () => {
            const node = document.querySelector('.nav .wrap .links');
            if (node) {
                addSubmitLinks(node);
                return true;
            }
            return false;
        });
    }
})();
