// ==UserScript==
// @name         Userstyles Style Preview
// @namespace    https://github.com/synthtech
// @description  Use original images for style preview
// @version      1.1
// @author       synthtech
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://userstyles.org/*
// @grant        none
// ==/UserScript==

(() => {
    const API = 'https://userstyles.org/api/v1';
    const REGEX = /^https?:\/\/userstyles\.org\/styles\/([0-9]+)\/[a-z0-9\-]+$/;

    let App = {
        getStyleInfo(id, cb) {
            fetch(`${API}/styles/${id}`)
            .then(response => { return response.json(); })
            .then(({screenshots}) => { cb(screenshots); })
        }
    };

    waitForUrl(REGEX, () => {
        waitForElems({
            sel: '#preview_image_div',
            stop: true,
            onmatch(elem) {
                // Replace main image
                let main = elem.style.backgroundImage.replace('style_screenshot_thumbnails', 'style_screenshots');
                elem.style.backgroundImage = main;
                let link = document.createElement('a');
                link.id = 'preview_image_link';
                link.href = main.match(/^url\("(.*)"\)$/)[1];
                link.target = '_blank';
                elem.parentNode.insertBefore(link, elem);
                link.appendChild(elem);

                // Add links to additional images
                let id = location.href.match(REGEX)[1];
                App.getStyleInfo(id, images => {
                    if (images) {
                        let div = document.createElement('div');
                        div.style.marginBottom = '15px';
                        let actions = document.querySelector('#actions_div');
                        actions.parentNode.insertBefore(div, actions);
                        for (let [i, img] of images.entries()) {
                            let link = document.createElement('a');
                            link.href = img;
                            link.target = '_blank';
                            link.textContent = `Image ${i + 1}`;
                            link.style.padding = '0 10px 10px 0';
                            div.appendChild(link);
                        }
                    }
                });
            }
        })
    });
})();
