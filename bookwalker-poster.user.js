// ==UserScript==
// @name         Bookwalker Poster
// @namespace    https://github.com/synthtech
// @description  Add links to cover images
// @version      2.0.0
// @author       synthtech
// @match        https://*.bookwalker.jp/*
// @grant        none
// ==/UserScript==

(() => {
    function addLink(elem) {
        const poster = elem.querySelector('.p-main__thumb .m-thumb__image img').getAttribute('data-original');
        if (poster) {
            const wrap = document.createElement('p');
            wrap.id = 'cover-link';
            wrap.className = 'p-pages';
            const link = document.createElement('a');
            link.href = poster;
            link.target = '_blank';
            link.text = 'View Cover Image';
            wrap.appendChild(link);
            elem.appendChild(wrap);
        }
    }

    function watchElem(watch, func) {
        const mut = new MutationObserver((_mutations, observer) => {
            const elem = document.querySelector(watch);
            if (elem) {
                func(elem);
                observer.disconnect();
            }
        });
        mut.observe(document.body, { subtree: true, childList: true });
    }

    watchElem('.p-main__left', addLink);
})();
