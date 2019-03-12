// ==UserScript==
// @name         Twitter Original Image
// @namespace    https://github.com/synthtech
// @description  Redirect to original images
// @version      2.1.0
// @author       synthtech
// @match        *://pbs.twimg.com/*
// @grant        none
// ==/UserScript==

(() => {
    // .jpg:orig
    // .jpg?name=orig
    // ?format=jpg&name=large
    const imageRegex = /^https?:\/\/pbs\.twimg\.com\/media\/([a-zA-Z0-9_\-]+)(\.|\?format=)(jpg|jpeg|png|gif)(:[a-z]+|\?name=[a-z]+|&name=[a-z]+)?$/;
    let url = location.href;

    if (url.match(imageRegex)) {
        if (url.match(imageRegex)[4]) {
            if (url.match(imageRegex)[4] !== '?name=orig') {
                redirect(url.match(imageRegex)[1], url.match(imageRegex)[3]);
            }
        } else {
            redirect(url.match(imageRegex)[1], url.match(imageRegex)[3]);
        }
    }

    function redirect(id, format) {
        location.href = `https://pbs.twimg.com/media/${id}.${format}?name=orig`;
    }
})();
