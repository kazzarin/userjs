// ==UserScript==
// @name         Userstyles Style Preview
// @description  Use original images for style preview
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://userstyles.org/*
// @grant        none
// ==/UserScript==

(function() {
    var SCRIPT_NAME = 'Userstyles Style Preview';
    var REGEX = /^https?:\/\/userstyles\.org\/styles\/[0-9]+\/[a-z0-9\-]+$/;

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
    
    // Replace image
    waitForUrl(REGEX, function() {
        waitForElems({
            sel: '#preview_image_div',
            stop: true,
            onmatch: function(elem) {
                var bg = elem.style.backgroundImage.replace('style_screenshot_thumbnails', 'style_screenshots');
                elem.style.backgroundImage = bg;
                var link = document.createElement('a');
                link.href = bg.match(/^url\("(.*)"\)$/)[1];
                link.target = '_blank';
                elem.parentNode.insertBefore(link, elem);
                link.appendChild(elem);
            }
        })
    });
})();
