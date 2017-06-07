// ==UserScript==
// @name         Kitsu Admin
// @description  Small changes to rails admin for convenience
// @version      1.0
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @match        *://kitsu.io/api/admin/*
// @grant        none
// ==/UserScript==

(function() {
    var SCRIPT_NAME = 'Kitsu Admin';
    var REGEX = /^https?:\/\/kitsu\.io\/api\/admin\/([a-z0-9\/]+)\/history$/;

    var Util = {
        log: function() {
            var args = [].slice.call(arguments);
            args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: #233c7b;');
            console.log.apply(console, args);
        },
        q: function(query, context) {
            return (context || document).querySelector(query);
        },
        qq: function(query, context) {
            return [].slice.call((context || document).querySelectorAll(query));
        }
    };

    // Show full history message on hover
    waitForUrl(REGEX, function() {
        waitForElems({
            sel: '#history',
            stop: true,
            onmatch: function() {
                var history = Util.qq('#history tbody tr td:last-child');
                for (var i = 0; i <= history.length - 1; i++) {
                    history[i].setAttribute('style', 'white-space: normal;');
                }
            }
        });
    });

    // Open "show in app" link in new tab
    waitForElems({
        sel: '.show_in_app_member_link',
        stop: false,
        onmatch: function() {
            var links = Util.qq('.show_in_app_member_link a');
            for (var i = 0; i <= links.length - 1; i++) {
                links[i].setAttribute('target', '_blank');
            }
        }
    });
})();
