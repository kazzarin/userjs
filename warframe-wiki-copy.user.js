// ==UserScript==
// @name         Warframe Wiki Tools
// @namespace    https://github.com/synthtech
// @description  Wiki tools for editing
// @version      1.1.1
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://warframe.fandom.com/*
// @grant        none
// ==/UserScript==

(() => {
    const App = {
        copy() {
            // Copy content of Ace editor
            let editor = ace.edit('editarea');
            navigator.clipboard.writeText(editor.getValue());
        },
        reset() {
            // Force draft discard in Wikia editor
            let key = document.querySelector('input[name="wpEditDraftKey"]').value;
            localStorage.removeItem(key);
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

    waitForElems({
        sel: '#draft-restore-message #discard',
        onmatch(elem) {
            elem.addEventListener('click', (e) => {
                App.reset();
            });
        }
    });
})();
