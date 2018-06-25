// ==UserScript==
// @name         Twitter Original Image
// @namespace    https://github.com/synthtech
// @description  Redirect to original images
// @version      1.0.1
// @author       synthtech
// @match        *://pbs.twimg.com/*
// @grant        none
// ==/UserScript==

(() => {
    const imageRegex = /^https?:\/\/pbs\.twimg\.com\/media\/([a-zA-Z0-9_\-]+)\.(jpg|jpeg|png|gif)((:[a-z]+)|(\?name=[a-z]+))?$/;
    let url = location.href;

    if (url.match(imageRegex)) {
        if (url.match(imageRegex)[5]) {
            if (url.match(imageRegex)[5] !== '?name=orig') {
                redirect(url);
            }
        } else {
            redirect(url);
        }
    }

    function redirect(url) {
        location.href = `https://pbs.twimg.com/media/${url.match(imageRegex)[1]}.${url.match(imageRegex)[2]}?name=orig`;
    }
})();
