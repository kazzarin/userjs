// ==UserScript==
// @name         Warframe Wiki Tools
// @namespace    https://github.com/synthtech
// @description  Wiki tools for editing
// @version      2.0
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://warframe.fandom.com/*
// @grant        none
// ==/UserScript==

(() => {
    // Available theme options found here:
    // https://github.com/Wikia/app/tree/dev/resources/Ace
    const theme = 'ace/theme/tomorrow_night_eighties';

    // Set Ace editor theme
    function aceSetTheme(editor) {
        ace.edit(editor).setTheme(theme);
    }

    // Copy content of Ace editor
    function aceCopy() {
        let content = ace.edit(document.querySelector('.ace_editor'));
        navigator.clipboard.writeText(content.getValue());
    }

    // Create button in wiki editor toolbar
    function createCopyBtn() {
        let btn = document.createElement('span');
        btn.classList = 'tab tab-copy';
        btn.rel = 'copy';

        let link = document.createElement('a');
        link.href = '#';
        link.role = 'button';
        link.textContent = 'Copy All';

        btn.append(link);

        const toolbar = document.querySelector('#wikiEditor-ui-toolbar .tabs');
        toolbar.append(btn);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            aceCopy();
        });
    }

    waitForElems({
        sel: '.ace_editor',
        stop: true,
        onmatch(elem) {
            aceSetTheme(elem);
            createCopyBtn(elem);
        }
    });
})();
