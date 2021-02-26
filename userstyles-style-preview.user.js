// ==UserScript==
// @name         Userstyles Style Preview
// @namespace    https://github.com/synthtech
// @description  Use original images for style preview
// @version      1.1.2
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://userstyles.org/*
// @grant        none
// ==/UserScript==

(() => {
    const API = 'https://userstyles.org/api/v1';
    const REGEX = /^https?:\/\/userstyles\.org\/styles\/([0-9]+)\/[a-z0-9-]+$/;

    const App = {
        getStyleInfo(id, cb) {
            fetch(`${API}/styles/${id}`)
                .then((response) => response.json())
                .then(({ screenshots }) => { cb(screenshots); });
        },
    };

    waitForUrl(REGEX, () => {
        waitForElems({
            sel: '#preview_image_div',
            stop: true,
            onmatch(elem) {
                const mainDiv = elem;
                // Replace main image
                const main = mainDiv.style.backgroundImage.replace('style_screenshot_thumbnails', 'style_screenshots');
                mainDiv.style.backgroundImage = main;
                const link = document.createElement('a');
                link.id = 'preview_image_link';
                link.href = main.match(/^url\("(.*)"\)$/)[1]; /* eslint-disable-line prefer-destructuring */
                link.target = '_blank';
                mainDiv.parentNode.insertBefore(link, mainDiv);
                link.appendChild(mainDiv);

                // Add links to additional images
                const id = location.href.match(REGEX)[1];
                App.getStyleInfo(id, (images) => {
                    if (images) {
                        const div = document.createElement('div');
                        div.style.marginBottom = '15px';
                        const actions = document.querySelector('#actions_div');
                        actions.parentNode.insertBefore(div, actions);

                        images.forEach((img, i) => {
                            const newLink = document.createElement('a');
                            newLink.href = img;
                            newLink.target = '_blank';
                            newLink.textContent = `Image ${i + 1}`;
                            newLink.style.padding = '0 10px 10px 0';
                            div.appendChild(newLink);
                        });
                    }
                });
            },
        });
    });
})();
