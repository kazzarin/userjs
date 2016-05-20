// ==UserScript==
// @name         HB Default Japanese Cast
// @description  Default to Japanese cast on anime pages
// @version      1.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @require      https://cdn.rawgit.com/synthtech/d2627fbad7e51c96c642/raw/e539a6f16c10465eb948b9ef6b0fe1d4c17a7c3e/jquery.waituntilexists.min.js
// @match        *://hummingbird.me/*
// @grant        none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var hbCast = function() {
    var switchCast = function() {
        $("div.cast-language ul.dropdown-menu a:contains('Japanese')")[0].click();
    };
    $("div.cast-language ul.dropdown-menu a:contains('Japanese')").waitUntilExists(switchCast);
}();