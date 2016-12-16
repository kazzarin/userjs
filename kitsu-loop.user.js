// ==UserScript==
// @name         Kitsu Video Looper
// @description  Loop videos
// @version      2.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.slim.min.js
// @require      https://cdn.rawgit.com/synthtech/d2627fbad7e51c96c642/raw/e539a6f16c10465eb948b9ef6b0fe1d4c17a7c3e/jquery.waituntilexists.min.js
// @include      *://kitsu.io/*
// @grant        none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var kitsuLoop = function() {
    var loopVid = function() {
        var vids = document.getElementsByTagName("video");
        for (i = 0; i < vids.length; i++) vids[i].setAttribute("loop", "true");
        void 0;
    };
    $(".stream-item .stream-content-post video").waitUntilExists(loopVid);
    $(".stream-item .stream-item-comments .comment-body video").waitUntilExists(loopVid);
}();