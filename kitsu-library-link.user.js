// ==UserScript==
// @name         Kitsu Library Link
// @namespace    https://github.com
// @description  Forces library parameters in the header link
// @version      2.0.0
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @match        https://kitsu.io/*
// @grant        none
// ==/UserScript==

/* global VM */

(() => {
    let settings;

    function clickHandler() {
        const newLink = new URL(`${location.origin}/users/${settings.user}/library`);
        if (settings.type !== 'anime') {
            newLink.searchParams.set('media', settings.type);
        }
        if (settings.status !== 'all') {
            newLink.searchParams.set('status', settings.status);
        }
        location.assign(newLink);
    }

    function init(nav) {
        const [, user] = nav.href.match(/\/users\/(\w+)/);
        settings = JSON.parse(localStorage.getItem('library-link'));
        if (!settings) {
            settings = { type: 'anime', status: 'all', user };
            localStorage.setItem('library-link', JSON.stringify(settings));
        } else {
            localStorage.setItem('library-link', JSON.stringify(Object.assign(settings, { user })));
        }
        VM.observe(document.body, () => {
            const node = document.querySelector('#kitsu-navbar #exCollapsingNavbar2 li:first-child a'); // library link
            if (node) {
                node.addEventListener('click', clickHandler);
                return true;
            }
            return false;
        });
    }

    const userNav = document.querySelector('#kitsu-navbar .user-menu-drop a:first-child'); // profile link
    if (userNav) {
        init(userNav);
    } else {
        VM.observe(document.body, () => {
            const node = document.querySelector('#kitsu-navbar .user-menu-drop a:first-child');
            if (node) {
                init(node);
                return true;
            }
            return false;
        });
    }
})();
