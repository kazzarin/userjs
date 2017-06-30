// ==UserScript==
// @name         Userstyles Style Preview
// @description  Use original images for style preview
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://userstyles.org/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var API = 'https://userstyles.org/api/v1';
    var REGEX = /^https?:\/\/userstyles\.org\/styles\/([0-9]+)\/[a-z0-9\-]+$/;

    var App = {
        getStyleInfo: function(id, cb) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: API + '/styles/' + id,
                onload: function(response) {
                    try {
                        var json = JSON.parse(response.responseText);
                        cb(json.screenshots);
                    } catch (err) {
                        console.log('Failed to parse style results');
                    }
                },
                onerror: function() {
                    console.log('Failed to get style data');
                }
            });
        }
    };

    waitForUrl(REGEX, function() {
        waitForElems({
            sel: '#preview_image_div',
            stop: true,
            onmatch: function(elem) {
                // Replace main image
                var bg = elem.style.backgroundImage.replace('style_screenshot_thumbnails', 'style_screenshots');
                elem.style.backgroundImage = bg;
                var link = document.createElement('a');
                link.id = 'preview_image_link';
                link.href = bg.match(/^url\("(.*)"\)$/)[1];
                link.target = '_blank';
                elem.parentNode.insertBefore(link, elem);
                link.appendChild(elem);

                // Add links to additional images
                var id = location.href.match(REGEX)[1];
                App.getStyleInfo(id, function(images) {
                    if (images) {
                        var div = document.createElement('div');
                        div.style.marginBottom = '15px';
                        var actions = document.querySelector('#actions_div');
                        actions.parentNode.insertBefore(div, actions);
                        for (var i = 0; i < images.length; i++) {
                            var link = document.createElement('a');
                            link.href = images[i];
                            link.target = '_blank';
                            link.text = 'Image ' + (i + 1);
                            link.style.padding = '0 10px 10px 0';
                            div.appendChild(link);
                        }
                    }
                });
            }
        })
    });
})();
