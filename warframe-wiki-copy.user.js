// ==UserScript==
// @name         Warframe Wiki Tools
// @namespace    https://github.com/synthtech
// @description  Wiki tools for editing
// @version      2.1.1
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://warframe.fandom.com/*
// @grant        none
// ==/UserScript==
/* global ace */
(() => {
    // Ace theme options:
    // https://github.com/Wikia/app/tree/dev/resources/Ace
    const aceTheme = 'ace/theme/tomorrow_night_eighties';

    // CodeMirror theme options:
    // https://github.com/codemirror/CodeMirror/tree/master/theme
    const cmTheme = 'ayu-mirage';
    // The MediaWiki packaged version removed all themes by default,
    // so the styles need to be added manually
    const cmThemeStyle = `
        /* Based on https://github.com/dempfi/ayu */

        .cm-s-ayu-mirage.CodeMirror { background: #1f2430; color: #cbccc6; }
        .cm-s-ayu-mirage div.CodeMirror-selected { background: #34455a; }
        .cm-s-ayu-mirage .CodeMirror-line::selection, .cm-s-ayu-mirage .CodeMirror-line > span::selection, .cm-s-ayu-mirage .CodeMirror-line > span > span::selection { background: #34455a; }
        .cm-s-ayu-mirage .CodeMirror-line::-moz-selection, .cm-s-ayu-mirage .CodeMirror-line > span::-moz-selection, .cm-s-ayu-mirage .CodeMirror-line > span > span::-moz-selection { background: rgba(25, 30, 42, 99); }
        .cm-s-ayu-mirage .CodeMirror-gutters { background: #1f2430; border-right: 0px; }
        .cm-s-ayu-mirage .CodeMirror-guttermarker { color: white; }
        .cm-s-ayu-mirage .CodeMirror-guttermarker-subtle { color:  rgba(112, 122, 140, 66); }
        .cm-s-ayu-mirage .CodeMirror-linenumber { color: rgba(61, 66, 77, 99); }
        .cm-s-ayu-mirage .CodeMirror-cursor { border-left: 1px solid #ffcc66; }
        
        .cm-s-ayu-mirage span.cm-comment { color: #5c6773; font-style:italic; }
        .cm-s-ayu-mirage span.cm-atom { color: #ae81ff; }
        .cm-s-ayu-mirage span.cm-number { color: #ffcc66; }
        
        .cm-s-ayu-mirage span.cm-comment.cm-attribute { color: #ffd580; }
        .cm-s-ayu-mirage span.cm-comment.cm-def { color: #d4bfff; }
        .cm-s-ayu-mirage span.cm-comment.cm-tag { color: #5ccfe6; }
        .cm-s-ayu-mirage span.cm-comment.cm-type { color: #5998a6; }
        
        .cm-s-ayu-mirage span.cm-property { color: #f29e74; }
        .cm-s-ayu-mirage span.cm-attribute { color: #ffd580; }  
        .cm-s-ayu-mirage span.cm-keyword { color: #ffa759; } 
        .cm-s-ayu-mirage span.cm-builtin { color: #ffcc66; }
        .cm-s-ayu-mirage span.cm-string { color: #bae67e; }
        
        .cm-s-ayu-mirage span.cm-variable { color: #cbccc6; }
        .cm-s-ayu-mirage span.cm-variable-2 { color: #f28779; }
        .cm-s-ayu-mirage span.cm-variable-3 { color: #5ccfe6; }
        .cm-s-ayu-mirage span.cm-type { color: #ffa759; }
        .cm-s-ayu-mirage span.cm-def { color: #ffd580; }
        .cm-s-ayu-mirage span.cm-bracket { color: rgba(92, 207, 230, 80); }
        .cm-s-ayu-mirage span.cm-tag { color: #5ccfe6; }
        .cm-s-ayu-mirage span.cm-header { color: #bae67e; }
        .cm-s-ayu-mirage span.cm-link { color: #5ccfe6; }
        .cm-s-ayu-mirage span.cm-error { color: #ff3333; } 
        
        .cm-s-ayu-mirage .CodeMirror-activeline-background { background: #191e2a; }
        .cm-s-ayu-mirage .CodeMirror-matchingbracket {
        text-decoration: underline;
        color: white !important;
        }
    `;

    // Set Ace editor theme
    function aceSetTheme(editor) {
        ace.edit(editor).setTheme(aceTheme);
    }

    // Ace relies on the clipboard api which breaks when
    // dom.event.clipboardevents.enabled = false
    // https://github.com/ajaxorg/ace/issues/4326

    // Copy selection from Ace editor
    function aceCopy() {
        const select = ace.edit(document.querySelector('.ace_editor'));
        navigator.clipboard.writeText(select.getCopyText());
    }

    // Copy entire content of Ace editor
    function aceCopyAll() {
        const content = ace.edit(document.querySelector('.ace_editor'));
        navigator.clipboard.writeText(content.getValue());
    }

    // Create buttons in wiki editor toolbar
    function createCopyBtn() {
        const btn = document.createElement('span');
        btn.id = 'tab-copy';
        btn.classList = 'tab';
        btn.rel = 'copy';

        const link = document.createElement('a');
        link.href = '#';
        link.role = 'button';
        link.textContent = 'Copy';

        btn.append(link);

        const toolbar = document.querySelector('#wikiEditor-ui-toolbar .tabs');
        toolbar.append(btn);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            aceCopy();
        });
    }

    function createCopyAllBtn() {
        const btn = document.createElement('span');
        btn.id = 'tab-copy-all';
        btn.classList = 'tab';
        btn.rel = 'copy-all';

        const link = document.createElement('a');
        link.href = '#';
        link.role = 'button';
        link.textContent = 'Copy All';

        btn.append(link);

        const toolbar = document.querySelector('#wikiEditor-ui-toolbar .tabs');
        toolbar.append(btn);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            aceCopyAll();
        });
    }

    // Inject the CodeMirror theme style into the page
    function cmInjectStyle() {
        const style = document.createElement('style');
        style.textContent = cmThemeStyle;
        document.head.append(style);
    }

    // Set CodeMirror editor theme
    function cmSetTheme(editor) {
        editor.CodeMirror.setOption('theme', cmTheme);
    }

    waitForElems({
        sel: '.ace_editor',
        stop: true,
        onmatch(elem) {
            aceSetTheme(elem);
            createCopyBtn();
            createCopyAllBtn();
        },
    });

    waitForElems({
        sel: '.CodeMirror',
        stop: true,
        onmatch(elem) {
            cmInjectStyle();
            cmSetTheme(elem);
        },
    });
})();
