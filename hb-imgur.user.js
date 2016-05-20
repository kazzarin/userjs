// ==UserScript==
// @name         HB Imgur MP4 to Webm
// @description  Replace imgur MP4 embeds with Webm
// @version      1.0.1
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @require      https://cdn.rawgit.com/synthtech/d2627fbad7e51c96c642/raw/e539a6f16c10465eb948b9ef6b0fe1d4c17a7c3e/jquery.waituntilexists.min.js
// @include      *://hummingbird.me/*
// @grant        none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var hbConvert = function() {
    var convertVid = function() {
            var srcs = document.getElementsByTagName("source");
            for (i = 0; i < srcs.length; i++) {
                vidSrc = srcs[i].getAttribute("src");
                if (vidSrc.indexOf("i.imgur.com") > -1 && vidSrc.indexOf(".mp4") > -1) {
                    srcs[i].setAttribute("src", vidSrc.replace(".mp4", ".webm"));
                }
            }
            void 0;
        };
    $("div.user-about-panel p.about video").waitUntilExists(convertVid);
    $("div.group-about-panel p.about video").waitUntilExists(convertVid);
    $("div.story div.post-content p.comment-text video").waitUntilExists(convertVid);
    $("div.story div.content span.comment video").waitUntilExists(convertVid);
}();