// ==UserScript==
// @name         Kitsu Admin
// @namespace    https://github.com/synthtech
// @description  Minor changes to rails admin for convenience
// @version      1.3.4
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/api/admin/*
// @grant        none
// ==/UserScript==
/* eslint-env jquery */
/* global moment */
(() => {
    const format = 'MMMM DD YYYY, HH:mm';

    // Show full history message
    waitForElems({
        sel: '#history tbody tr td:last-child',
        onmatch(elem) {
            const td = elem;
            td.style.whiteSpace = 'normal';
        },
    });

    // Open "show in app" link in new tab
    waitForElems({
        sel: '.show_in_app_member_link a',
        onmatch(elem) {
            const link = elem;
            link.target = '_blank';
        },
    });

    // Convert dates to local time
    // Edit history
    waitForElems({
        sel: '#history tbody tr td:first-child',
        onmatch(elem) {
            const date = elem;
            date.textContent = moment.utc(date.textContent, format).local().format(format);
        },
    });
    // Created at
    waitForElems({
        sel: 'td.created_at_field',
        onmatch(elem) {
            const date = elem;
            date.textContent = moment.utc(date.textContent, format).local().format(format);
            date.title = date.textContent;
        },
    });
    // Updated at
    waitForElems({
        sel: 'td.updated_at_field',
        onmatch(elem) {
            const date = elem;
            date.textContent = moment.utc(date.textContent, format).local().format(format);
            date.title = date.textContent;
        },
    });

    // Collapse fields
    waitForElems({
        sel: 'fieldset > div',
        onmatch(elem) {
            const label = elem.firstChild;
            const field = elem.lastChild;
            const id = `${elem.id}_collapse`;
            field.classList.add('collapse');
            field.id = id;
            label.tagName = 'a';
            label.setAttribute('data-toggle', 'collapse');
            label.setAttribute('data-target', `#${id}`);

            const checkList = field.parentElement.classList;
            const checkType = checkList.find((check) => check.includes('_type'));

            function showField(select) {
                if (select) {
                    const fieldInput = field.querySelector(select);
                    if (fieldInput.value !== '') {
                        $(`#${id}`).collapse('show');
                    }
                } else if (field.firstChild.value !== '') {
                    $(`#${id}`).collapse('show');
                }
            }

            if (checkType === 'date_type') {
                showField('input');
            } else if (checkType === 'paperclip_type') {
                showField('.toggle :first-child');
            } else if (checkType === 'has_many_association_type'
                || checkType === 'has_and_belongs_to_many_association_type') {
                showField('select');
            } else {
                showField();
            }
        },
    });
})();
