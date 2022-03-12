// ==UserScript==
// @name         Google Docs Mobile View
// @namespace    https://github.com
// @description  Add an option to use the mobile view
// @version      1.0.0
// @license      0BSD
// @author       Zarin
// @match        https://docs.google.com/*
// @grant        none
// ==/UserScript==

(() => {
    const regex = /\/(document|spreadsheets)\/d\/([A-Za-z0-9-]+)\/edit/;

    const divProps = {
        className: 'menu-button goog-control goog-inline-block',
        textContent: 'Mobile',
        style: {
            userSelect: 'none',
        },
        id: 'docs-mobile-view-menu',
    };

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

    function watchElem(watch, func) {
        new MutationObserver((_mutations, observer) => {
            const elem = document.querySelector(watch);
            if (elem) {
                func(elem);
                observer.disconnect();
            }
        }).observe(document.body, { subtree: true, childList: true });
    }

    function clickHandler(e) {
        if (e.target?.id === 'docs-mobile-view-menu') {
            e.preventDefault();
            const [, type] = location.pathname.match(regex);
            if (type === 'document') {
                const link = location.href.replace(/\/edit.*/, '/mobilebasic');
                location.assign(link);
            } else if (type === 'spreadsheets') {
                const link = location.href.replace(/\/edit.*/, '/htmlview');
                location.assign(link);
            }
        }
    }

    async function addButton(elem) {
        const button = await newElem('div', divProps);
        button.addEventListener('click', clickHandler);
        elem.parentNode.appendChild(button);
    }

    if (regex.test(location.pathname)) {
        watchElem('#docs-help-menu', addButton);
    }
})();
