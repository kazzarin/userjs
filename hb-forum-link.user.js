// ==UserScript==
// @name         HB Forum Profile Fix
// @description  Fix activity feed link on forum profiles
// @version      1.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require      https://cdn.rawgit.com/synthtech/d2627fbad7e51c96c642/raw/e539a6f16c10465eb948b9ef6b0fe1d4c17a7c3e/jquery.waituntilexists.min.js
// @include      *://forums.hummingbird.me/*
// @grant        none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var hbLink = function() {
    var fixLink = function() {
        var username = $(".username").html();
        $("div.profile-navigation").find("li.nav-link:first").find("a").attr("href", "https://hummingbird.me/users/" + username);
    };
    $("div.profile-navigation li.nav-link a").waitUntilExists(fixLink);
}();