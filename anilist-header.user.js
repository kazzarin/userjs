// ==UserScript==
// @name         AniList Header Links
// @namespace    https://github.com
// @description  Add links to submit anime/manga in header
// @version      1.0.2
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    const animeProps = {
        className: 'link',
        href: '/edit/anime/new',
        textContent: 'new anime',
        id: 'submit-anime',
    };

    const mangaProps = {
        className: 'link',
        href: '/edit/manga/new',
        textContent: 'new manga',
        id: 'submit-manga',
    };

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

    async function newElem(type, props, attrs) {
        const elem = document.createElement(type);
        if (props) {
            Object.entries(props).forEach((attr) => {
                const [k, v] = attr;
                if (k === 'style') {
                    Object.entries(v).forEach((prop) => {
                        const [l, w] = prop;
                        elem.style[l] = w;
                    });
                } else {
                    elem[k] = v;
                }
            });
        }
        if (attrs) {
            Object.entries(attrs).forEach((attr) => {
                const [k, v] = attr;
                elem.setAttribute(k, v);
            });
        }
        return elem;
    }

    async function addSubmitLinks(elem) {
        const dataAttr = document.querySelector('#nav').__vue__.$options._scopeId;
        const animeLink = await newElem('a', animeProps, { [dataAttr]: '' });
        const mangaLink = await newElem('a', mangaProps, { [dataAttr]: '' });
        animeLink.addEventListener('click', clickHandler);
        mangaLink.addEventListener('click', clickHandler);
        elem.appendChild(animeLink);
        elem.appendChild(mangaLink);
    }

    // No point displaying links unless logged in
    if (localStorage.getItem('auth')) {
        waitForElems({
            sel: '.nav .wrap .links',
            onmatch(elem) {
                addSubmitLinks(elem);
            },
        });
    }
})();
