// ==UserScript==
// @name         HB Video Looper
// @description  Loop videos
// @version      1.0.1
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @require      https://cdn.rawgit.com/synthtech/d2627fbad7e51c96c642/raw/e539a6f16c10465eb948b9ef6b0fe1d4c17a7c3e/jquery.waituntilexists.min.js
// @include      *://hummingbird.me/*
// @grant        none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var hbLoop = function() {
    var loopVid = function() {
        var vids = document.getElementsByTagName("video");
        for (i = 0; i < vids.length; i++) vids[i].setAttribute("loop", "true");
        void 0;
    };
    $("div.user-about-panel p.about video").waitUntilExists(loopVid);
    $("div.group-about-panel p.about video").waitUntilExists(loopVid);
    $("div.story div.post-content p.comment-text video").waitUntilExists(loopVid);
    $("div.story div.content span.comment video").waitUntilExists(loopVid);
}();