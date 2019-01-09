// ==UserScript==
// @name         Piazza History Keybindings
// @namespace    https://piazza.com
// @version      0.1
// @description  Use left and right arrows to navigate Piazza post history
// @author       David Harris
// @match        https://piazza.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==

// Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);

function moveHistorySlider(increment) {
    // `P` is a Piazza internal variable
    // I discovered this while exploring their scripts
    var newVal = P.history_slider.slider.value[0] + increment;
    if(newVal < P.history_slider.slider.min) newVal = P.history_slider.slider.min;
    if(newVal > P.history_slider.slider.max) newVal = P.history_slider.slider.max;
    P.history_slider.slider.element.slider("setValue", newVal).trigger("slide");
}

$(document).ready(function () {
    $(document).keydown(function(e) {
        switch(e.which) {
            case 37:
                moveHistorySlider(-1);
                break;
            case 39:
                moveHistorySlider(1);
                break;

            default: return;
        }
        e.preventDefault();
    });
});

