// ==UserScript==
// @name         Pinterest Image Cleaner
// @description  Removes links on images
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://www.pinterest.com/pin/*
// @grant        none
// ==/UserScript==

(function() {
    var SCRIPT_NAME = 'Pinterest Image Cleaner';

    var Util = {
        log: function() {
            var args = [].slice.call(arguments);
            args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: #233c7b;');
            console.log.apply(console, args);
        },
        q: function(query, context) {
            return (context || document).querySelector(query);
        },
        qq: function(query, context) {
            return [].slice.call((context || document).querySelectorAll(query));
        }
    };
    
    // Unwrap image from link, then remove unneeded image sources
    waitForElems({
        sel: '.GrowthUnauthPinImage',
        stop: true,
        onmatch: function() {
            var link = Util.q('.GrowthUnauthPinImage a');
            var div = link.parentNode;
            while (link.firstChild) div.insertBefore(link.firstChild, link);
            div.removeChild(link);
            
            var img = Util.q('img', div);
            img.removeAttribute('srcset');
            img.removeAttribute('href');
        }
    });
})();
