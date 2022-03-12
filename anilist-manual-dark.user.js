// ==UserScript==
// @name         AniList Submission Manual Dark Mode Fix
// @namespace    https://github.com
// @description  Toggles dark mode automatically
// @version      1.0.0
// @author       Zarin
// @match        https://submission-manual.anilist.co/*
// @grant        none
// ==/UserScript==

(() => {
    function toggle(elem) {
        elem.parentNode.click();
    }

    function watchElem(watch, func) {
        new MutationObserver((_mutations, observer) => {
            const elem = document.querySelector(watch);
            if (elem) {
                func(elem);
                observer.disconnect();
            }
        }).observe(document.body, { subtree: true, childList: true });
    }

    watchElem('.toggle-mode > div[title="Change to Dark Mode"]', toggle);
})();
