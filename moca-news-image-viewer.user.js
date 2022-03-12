// ==UserScript==
// @name         Moca News Image Viewer
// @namespace    https://github.com
// @description  Fixes mouse events in the image viewer
// @version      1.0.1
// @license      0BSD
// @author       Zarin
// @match        *://moca-news.net/article/*
// @grant        none
// ==/UserScript==

(() => {
    const img = document.getElementById('image_cvs');
    if (img) {
        img.removeAttribute('onclick');
        img.removeAttribute('oncontextmenu');
        img.removeAttribute('onselectstart');
        img.removeAttribute('onmousedown');
        img.removeAttribute('onmouseover');
    }
    const dummy = document.getElementById('image_cvs_cover');
    if (dummy) dummy.remove();
})();
