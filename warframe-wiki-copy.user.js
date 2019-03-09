// ==UserScript==
// @name         Warframe Wiki Copy
// @namespace    https://github.com/synthtech
// @description  Allow copying from Ace editor
// @version      1.0.0
// @author       synthtech
// @require      https://gitcdn.xyz/cdn/fuzetsu/userscripts/b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://warframe.fandom.com/*
// @grant        none
// ==/UserScript==

(() => {
    const App = {
        copy() {
            let editor = ace.edit("editarea");
            navigator.clipboard.writeText(editor.getValue());
        }
    };

    waitForElems({
        sel: '.ace_editor',
        onmatch(elem) {
            let btn = document.createElement('input');
            btn.type = 'button';
            btn.id = 'copy-btn';
            btn.classList = 'control-button even';
            btn.style.height = '19px';
            btn.style.float = 'left';
            btn.style.marginRight = '20px';
            btn.value = 'Copy All';

            let toolbar = document.querySelector('#EditPageRail .module_content .buttons');
            toolbar.append(btn);

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                App.copy();
            });
        }
    });
})();
