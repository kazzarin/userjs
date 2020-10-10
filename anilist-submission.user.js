// ==UserScript==
// @name         AniList Submission Links
// @namespace    https://github.com/synthtech
// @description  Add links to submissions on user profiles
// @version      1.1
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/anilist\.co\/user\/([A-Za-z0-9]+)(\/.*)?$/;

    function clickHandler(e) {
        if (e.target.id === 'submissions-link') {
            e.preventDefault();
            navigate();
        }
    }

    function navigate() {
        const app = document.getElementById('app');
        app.__vue__._router.push({ name: 'UserSubmissions' });
    }

    // Not accessible unless logged in
    if (localStorage.getItem('auth')) {
        const currentUser = JSON.parse(localStorage.getItem('auth')).name;

        waitForUrl(REGEX, () => {
            const [url, user] = location.href.match(REGEX);
            waitForElems({
                sel: '.header-wrap .nav-wrap .nav.container',
                stop: true,
                onmatch(elem) {
                    const checkLink = elem.querySelector('#submissions-link');

                    if (checkLink) {
                        if (user == currentUser) {
                            checkLink.removeEventListener('click', clickHandler);
                            checkLink.remove();
                        } else {
                            checkLink.href = `/user/${user}/submissions`;
                        }
                    } else {
                        if (user !== currentUser) {
                            const elemAttr = elem.querySelector(':first-child').attributes;
                            let dataAttr;
                            for (let attr of elemAttr) {
                                if (attr.name.includes('data')) {
                                    dataAttr = attr.name;
                                    break;
                                }
                            }

                            const link = document.createElement('a');
                            link.href = `/user/${user}/submissions`;
                            link.className = 'link';
                            link.setAttribute(dataAttr, "");
                            link.textContent = 'Submissions';
                            link.id = 'submissions-link';

                            link.addEventListener('click', clickHandler);
                            elem.appendChild(link);
                        }
                    }
                }
            })
        });
    }
})();
