// ==UserScript==
// @name         Kitsu Admin
// @namespace    https://github.com/synthtech
// @description  Minor changes to rails admin for convenience
// @version      1.2.0
// @author       synthtech
// @require      https://cdn.rawgit.com/fuzetsu/userscripts/477063e939b9658b64d2f91878da20a7f831d98b/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/api/admin/*
// @grant        none
// ==/UserScript==

(() => {
    const format = 'MMMM DD YYYY, HH:mm';

    // Show full history message
    waitForElems({
        sel: '#history tbody tr td:last-child',
        onmatch({style}) {
            style.whiteSpace = 'normal';
        }
    });

    // Open "show in app" link in new tab
    waitForElems({
        sel: '.show_in_app_member_link a',
        onmatch(elem) {
            elem.target = '_blank';
        }
    });

    // Convert dates to local time
    // Edit history
    waitForElems({
        sel: '#history tbody tr td:first-child',
        onmatch(date) {
            date.textContent = moment.utc(date.textContent, format).local().format(format);
        }
    });
    // Created at
    waitForElems({
        sel: 'td.created_at_field',
        onmatch(date) {
            date.textContent = moment.utc(date.textContent, format).local().format(format);
            date.title = date.textContent;
        }
    });
    // Updated at
    waitForElems({
        sel: 'td.updated_at_field',
        onmatch(date) {
            date.textContent = moment.utc(date.textContent, format).local().format(format);
            date.title = date.textContent;
        }
    });
})();
