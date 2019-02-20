// ==UserScript==
// @name         Twitter Original Image
// @namespace    https://github.com/synthtech
// @description  Redirect to original images
// @version      2.0.0
// @author       synthtech
// @match        *://pbs.twimg.com/*
// @grant        none
// ==/UserScript==

(() => {
    // .jpg:orig
    // .jpg?name=orig
    const imageRegex = /^https?:\/\/pbs\.twimg\.com\/media\/([a-zA-Z0-9_\-]+)\.(jpg|jpeg|png|gif)((:[a-z]+)|(\?name=[a-z]+))?$/;
    // ?format=jpg&name=4096x4096
    const imageRegex2 = /^https?:\/\/pbs\.twimg\.com\/media\/([a-zA-Z0-9_\-]+)\?format=(jpg|jpeg|png|gif)&name=([0-9]+\x[0-9]+)?$/;
    let url = location.href;

    if (url.match(imageRegex)) {
        if (url.match(imageRegex)[5]) {
            if (url.match(imageRegex)[5] !== '?name=orig') {
                redirect(url.match(imageRegex)[1], url.match(imageRegex)[2]);
            }
        } else {
            redirect(url.match(imageRegex)[1], url.match(imageRegex)[2]);
        }
    } else if (url.match(imageRegex2)) {
        redirect(url.match(imageRegex2)[1], url.match(imageRegex2)[2]);
    }

    function redirect(id, format) {
        location.href = `https://pbs.twimg.com/media/${id}.${format}?name=orig`;
    }
})();
