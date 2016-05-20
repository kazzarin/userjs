// ==UserScript==
// @name         HB Hide Empty Franchise
// @description  Hide empty franchise panel on anime pages
// @version      1.0.1
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @require      https://cdn.rawgit.com/synthtech/d2627fbad7e51c96c642/raw/e539a6f16c10465eb948b9ef6b0fe1d4c17a7c3e/jquery.waituntilexists.min.js
// @include      *://hummingbird.me/*
// @grant        none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var hbFranchise = function() {
    var checkFranchise = function() {
        var franchise = $(".series-column .series-panel:nth-child(4)");
        if (typeof($(franchise).find(".franchise-show").html()) === "undefined") {
            $(franchise).remove();
        }
    };
    $("div.series-column div.series-panel:nth-child(4) .view-more").waitUntilExists(checkFranchise);
}();