// ==UserScript==
// @name         Pinterest Image Cleaner
// @description  Removes links on images
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://www.pinterest.com/pin/*
// @grant        none
// ==/UserScript==

(function() {
    // Unwrap image from link, then remove unneeded image sources
    waitForElems({
        sel: '.GrowthUnauthPinImage',
        stop: true,
        onmatch: function(pin) {
            var link = pin.firstChild;
            while (link.firstChild) pin.insertBefore(link.firstChild, link);
            pin.removeChild(link);
        }
    });
    waitForElems({
        sel: '.GrowthUnauthPinImage img',
        stop: true,
        onmatch: function(img) {
            if (img.src.match(/^https?:\/\/[a-z0-9\-]+\.pinimg\.com\/([0-9]+x)\/.*$/[1])) {
                img.removeAttribute('srcset');
                img.removeAttribute('href');
                img.src = img.src.replace(/^https?:\/\/[a-z0-9\-]+\.pinimg\.com\/([0-9]+x)\/.*$/[1], 'originals');
            }
        },
        onchange: function(img) {
            if (img.src.match(/^https?:\/\/[a-z0-9\-]+\.pinimg\.com\/([0-9]+x)\/.*$/[1])) {
                img.removeAttribute('srcset');
                img.removeAttribute('href');
                img.src = img.src.replace(/^https?:\/\/[a-z0-9\-]+\.pinimg\.com\/([0-9]+x)\/.*$/[1], 'originals');
            }
        }
    });
})();
