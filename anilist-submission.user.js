// ==UserScript==
// @name         AniList Submission Links
// @namespace    https://github.com
// @description  Add links to submissions on user profiles
// @version      1.2.1
// @license      0BSD
// @author       Zarin
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const regex = /\/user\/([A-Za-z0-9]+)(\/.*)?/;

    function navigate() {
        const app = document.getElementById('app');
        app.__vue__.$router.push({ name: 'UserSubmissions' });
    }

    function clickHandler(e) {
        if (e.target?.id === 'submissions-link') {
            e.preventDefault();
            navigate();
        }
    }

    async function addLink(elem) {
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
            const link = document.createElement('a');
            link.href = `/user/${user}/submissions`;
            link.className = 'link';
            link.setAttribute(dataAttr, '');
            link.textContent = 'Submissions';
            link.id = 'submissions-link';
            link.addEventListener('click', clickHandler);
            elem.appendChild(link);
        }
    }

    async function watchElem(watch, func) {
        const mut = new MutationObserver(async (_mutations, observer) => {
            const elem = document.querySelector(watch);
            if (elem) {
                observer.disconnect();
                await func(elem);
            }
        });
        mut.observe(document.body, { subtree: true, childList: true });
    }

    async function routeWatch() {
        const app = document.getElementById('app');
        if (app.__vue__) {
            app.__vue__.$router.afterEach((newRoute) => {
                if (regex.test(newRoute.path)) {
                    watchElem('.user .nav.container', addLink);
                }
            });
        } else {
            setTimeout(routeWatch, 300);
        }
    }

    // Not accessible unless logged in
    if (localStorage.getItem('auth')) {
        if (regex.test(location.pathname)) {
            watchElem('.user .nav.container', addLink);
        }
        routeWatch();
    }
})();
