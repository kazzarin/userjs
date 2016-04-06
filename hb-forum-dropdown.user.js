// ==UserScript==
// @name         HB Show Forum Profile Dropdown
// @description  Shows a hidden profile dropdown
// @version      1.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require      https://cdn.rawgit.com/synthtech/d2627fbad7e51c96c642/raw/e539a6f16c10465eb948b9ef6b0fe1d4c17a7c3e/jquery.waituntilexists.min.js
// @include      *://forums.hummingbird.me/*
// @grant        none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var hbDrop = function() {
    var showDrop = function() {
        $("div.profile-navigation").find("li.nav-link:last").find("a.dropdown-toggle").removeAttr("href");
        $("head").append("<style>div.profile-navigation li.nav-link.dropdown.open ul.dropdown-menu{width:130px;height:160px;background-color:#f5f5f5;z-index:10;}</style>");
    };
    $("div.profile-navigation li.nav-link a").waitUntilExists(showDrop);
}();