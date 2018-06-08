// ==UserScript==
// @name         Kitsu Admin
// @namespace    https://github.com/synthtech
// @description  Minor changes to rails admin for convenience
// @version      1.3.0
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
            label.setAttribute('data-toggle','collapse');
            label.setAttribute('data-target',`#${id}`);

            const check = field.parentElement.classList;
            let checkType;
            for (let i = 0; i < check.length; i++) {
                if (check[i].includes('_type')) {
                    checkType = check[i];
                    break;
                }
            }

            switch(checkType) {
                case 'date_type':
                    showField('input');
                    break;
                case 'enum_type':
                    showField();
                    break;
                case 'has_and_belongs_to_many_association_type':
                    showField('select');
                    break;
                case 'has_many_association_type':
                    showField('select');
                    break;
                case 'integer_type':
                    showField();
                    break;
                case 'paperclip_type':
                    showField('.toggle :first-child');
                    break;
                case 'serialized_type':
                    showField();
                    break;
                case 'string_type':
                    showField();
                    break;
                case 'text_type':
                    showField();
                    break;
            }

            function showField(select) {
                if (select) {
                    let fieldInput = field.querySelector(select);
                    if (fieldInput.value !== '') {
                        $(`#${id}`).collapse('show');
                    }
                } else {
                    if (field.firstChild.value !== '') {
                        $(`#${id}`).collapse('show');
                    }
                }
            }
        }
    });
})();
