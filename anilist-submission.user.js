// ==UserScript==
// @name         AniList Submission Links
// @namespace    https://github.com
// @description  Add links to submissions on user profiles
// @version      1.3.1
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==

/* global VM */

(() => {
    const regex = /\/user\/([A-Za-z0-9]+)(\/.*)?/;

    function clickHandler(e) {
        if (e.target?.id === 'submissions-link') {
            e.preventDefault();
            const app = document.getElementById('app');
            app.__vue__.$router.push({ name: 'UserSubmissions' });
        }
    }

    function addLink(elem) {
        const currentUser = JSON.parse(localStorage.getItem('auth')).name;
        const [, user] = location.pathname.match(regex);
        const checkLink = elem.querySelector('#submissions-link');
        if (checkLink) {
            if (user === currentUser) {
                checkLink.removeEventListener('click', clickHandler);
                checkLink.remove();
            } else {
                checkLink.href = `/user/${user}/submissions`;
            }
        } else if (user !== currentUser) {
            const dataAttr = document.querySelector('.header-wrap').__vue__.$options._scopeId;
            const link = VM.hm('a', {
                className: 'link',
                id: 'submissions-link',
                [dataAttr]: '',
                href: `/user/${user}/submissions`,
            }, 'Submissions');
            link.addEventListener('click', clickHandler);
            elem.appendChild(link);
        }
    }

    function watchElem() {
        VM.observe(document.body, () => {
            const node = document.querySelector('.user .nav.container');
            if (node) {
                addLink(node);
                return true;
            }
            return false;
        });
    }

    function routeWatch() {
        const app = document.getElementById('app');
        if (app.__vue__) {
            app.__vue__.$router.afterEach((newRoute) => {
                if (regex.test(newRoute.path)) {
                    watchElem();
                }
            });
        } else {
            setTimeout(routeWatch, 300);
        }
    }

    // Not accessible unless logged in
    if (localStorage.getItem('auth')) {
        if (regex.test(location.pathname)) {
            watchElem();
        }
        routeWatch();
    }
})();
