var _this = this;
function navigate(e) {
    var searchInputValue = $("#search__input").val();
    if (e.key === "Enter") {
        if (searchInputValue.includes("://")) {
            startProgram("", searchInputValue);
        }
        else {
            startProgram("", "https://www.bing.com?q=" + searchInputValue);
        }
        toggleStart();
    }
}
function esc(e) {
    if (e.key === "Escape") {
        toggleStart();
    }
    desktopContextMenu(event.clientX, event.clientY, false);
}
function user(status) {
    switch (status) {
        case "logout":
            window.location.href = "./login.html?usr=" + $.urlParam("usr");
            break;
        case "lock":
            document.location.replace("./login.html");
            break;
        case "sleep":
            window.location.href =
                "./NeonX/screensaver.html?usr=" + $.urlParam("usr");
            break;
        default:
            console.error("status update failed...");
    }
}
function resizeStart() {
    var startWidth = $(".start-screen").outerWidth();
    var startRound = Math.ceil(startWidth / 128.0) * 128;
    $(".start-screen").css({
        width: startRound
    });
}
function toggleStart() {
    $(".start-menu-fade").fadeToggle(500);
    $(".start-menu").fadeToggle(250).toggleClass("start-menu--open");
    $(".startIcon").toggleClass("start--open");
    $("#search__input").val("");
    $("#search__input").focus();
}
// Current time
function getTime() {
    var dateOBJ = new Date();
    var currentHour = dateOBJ.getHours();
    var currentMinute = dateOBJ.getMinutes();
    var amPm = currentHour < 12 ? "AM" : "PM";
    // adjust PM times by -12 hours
    if (currentHour > 12) {
        currentHour = currentHour - 12;
    }
    // add "zero" to start of minutes if <10
    if (currentMinute < 10) {
        currentMinute = "0" + currentMinute.toString();
    }
    // display time on taskbar
    $("#timeDisplay").html(currentHour.toString() + ":" + currentMinute.toString() + " " + amPm);
}
// if holding down super key (esc), log off
var lastKeyUpAt = 0;
$(document).on("keydown", function (event) {
    var key = event.keyCode || event.which;
    if (key != 27) {
        return;
    }
    var keyDownAt = new Date();
    setTimeout(function () {
        // Compare key down time with key up time
        if (+keyDownAt > +lastKeyUpAt) {
            // Key has been held down for x seconds
            user("lock");
        }
    }, 2000);
});
$(document).on("keyup", function () {
    lastKeyUpAt = new Date();
});
// webpage init
$(window).load(function () {
    var container = $(".start-screen");
    container.masonry({
        itemSelector: ".masonry-item",
        columnWidth: 128
    });
    $(".start-menu").hide().css("opacity", 1);
});
// Unfocus windows when desktop is clicked
$(".desktop").click(function (e) {
    if (!$(".desktop").has(e.target).length) {
        desktopContextMenu(event.clientX, event.clientY, false);
    }
});
$(".startIcon").click(toggleStart);
$(".start-menu__recent li a").click(toggleStart);
$(".start-screen__tile").click(toggleStart);
// ALL APPS DRAW
document.getElementById("all-appsBTN").onclick = function () {
    $("#all-apps").show();
};
document.getElementById("allAppsCloseBTN").onclick = function () {
    $("#all-apps").hide();
};
// Prevent "open" class on start
$(function () {
    $(".startIcon").click(function () {
        $(_this).removeClass("taskbar__item--open taskbar__item--active");
    });
});
$.urlParam = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.href);
    if (results == null) {
        return 0;
    }
    return results[1];
};
$(".menu-toggle").each(function () {
    var menuName = $(this).data("menu");
    var menu = $(".menu[data-menu=\"" + menuName + "\"]");
    if (!$(menu).hasClass("menu--bottom")) {
        $(menu).position({
            my: "left top",
            at: "left bottom",
            of: this,
            collision: "none"
        });
    }
    $(menu).hide();
    $(this).click(function (e) {
        e.preventDefault();
        $(".menu").not(menu).hide();
        $(menu).toggle();
    });
});
// hide menu when clicking off the menu
$(document).mouseup(function (e) {
    if ($(".menu").has(e.target).length == 0 &&
        !$(".menu-toggle").is(e.target) &&
        $(".menu-toggle").has(e.target).length == 0)
        $(".menu").hide();
});
$("#currentUser").text($.urlParam("usr"));
/* LOOP */
// countdown timer till screensaver will be activated
var screensaverTimeout = 480; // seconds (8) miniutes default
function loop() {
    getTime();
    setTimeout(loop, 1000);
    screensaverTimeout -= 1;
    if (screensaverTimeout < 1)
        window.location.href = "./NeonX/screensaver.html?usr=" + $.urlParam("usr");
}
loop();
