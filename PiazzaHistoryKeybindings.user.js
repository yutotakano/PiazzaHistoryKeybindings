// ==UserScript==
// @name         Piazza History Keybindings
// @namespace    https://piazza.com
// @version      0.2
// @description  Use left and right arrows to navigate Piazza post history
// @author       David Harris, Yuto Takano
// @match        https://piazza.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==

// Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);
// make current post item focus()-able
$("[data-pats=current_post]").attr("tabindex", 1);

function moveHistorySlider(increment) {
    // `P` is a Piazza internal variable
    // I discovered this while exploring their scripts
    var newVal = P.history_slider.slider.value[0] + increment;
    if(newVal < P.history_slider.slider.min) newVal = P.history_slider.slider.min;
    if(newVal > P.history_slider.slider.max) newVal = P.history_slider.slider.max;
    P.history_slider.slider.element.slider("setValue", newVal).trigger("slide");
}

function prevPost() {
    // There is a P.feed.feedItemClick(event, this) attached to each post's feed item
    // Easiest solution to trigger this is to just utilise jQuery's click() function.
    var curr = $("[data-pats=post_group_item].selected");
    // attempt to find previous post in same group
    var prev_post = curr.prev("[data-pats=post_group_item]");
    if (prev_post.length != 0) {
        prev_post.click();
    } else {
        // attempt to find previous post in previous group
        var prev_group = curr.closest("[data-pats=post_group]").prev("[data-pats=post_group]");
        if (prev_group.length != 0) prev_group.find("[data-pats=post_group_item]:last")[0].click();
    }
    // return focus to the current post so PgUp/PgDn keys work
    $("[data-pats=current_post]").attr("tabindex", 1).focus();
}

function nextPost() {
    var curr = $("[data-pats=post_group_item].selected");
    var next_post = curr.next("[data-pats=post_group_item]");
    if (next_post.length != 0) {
        next_post.click();
    } else {
        var next_group = curr.closest("[data-pats=post_group]").next("[data-pats=post_group]");
        if (next_group.length != 0) next_group.find("[data-pats=post_group_item]")[0].click();
    }
    // return focus to the current post so PgUp/PgDn keys work
    $("[data-pats=current_post]").attr("tabindex", 1).focus();
}

$(document).ready(function () {
    $(document).keydown(function(e) {
        var element;
		if(e.target) element = e.target;
		else if(e.srcElement) element = e.srcElement;
		if(element.nodeType == 3) element = element.parentNode;

        if(element.tagName.toLowerCase() == "input" || element.tagName.toLowerCase() == "textarea") return;
        
        switch(e.which) {
            case 37:
                moveHistorySlider(-1);
                break;
            case 38:
                prevPost();
                break;
            case 39:
                moveHistorySlider(1);
                break;
            case 40:
                nextPost();
                break;
            default: return;
        }
        e.preventDefault();
    });
});

