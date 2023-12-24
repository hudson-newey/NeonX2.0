function navigate(e: KeyboardEvent): void {
  const searchInputValue = $("#search__input").val();

  if (e.key === "Enter") {
    if (searchInputValue.includes("://")) {
      startProgram("", searchInputValue);
    } else {
      startProgram("", "https://www.bing.com?q=" + searchInputValue);
    }

    toggleStart();
  }
}

function esc(e: KeyboardEvent): void {
  if (e.key === "Escape") {
    toggleStart();
  }

  desktopContextMenu(event.clientX, event.clientY, false);
}

function user(status: string): void {
  switch (status) {
    case "logout":
      window.location.href = "./login.html?usr=" + $.urlParam("usr");
      break;
    case "lock":
      document.location.replace("./login.html");
      break;
    case "sleep":
      window.location.href =
        "./NeonX/sys/screensaver/screensaver.html?usr=" + $.urlParam("usr");
      break;
    default:
      console.error("status update failed...");
  }
}

function resizeStart(): void {
  const startWidth: number = $(".start-screen").outerWidth();
  const startRound: number = Math.ceil(startWidth / 128.0) * 128;

  $(".start-screen").css({
    width: startRound,
  });
}

let startToggled = false;
function toggleStart(): void {
  const desktopFadeClass = "desktopFade";
  startToggled = !startToggled;

  $(".start-menu").fadeToggle(250).toggleClass("start-menu--open");
  $("#superButton").toggleClass("start--open");
  $("#search__input").val("");
  $("#search__input").focus();

  if (startToggled) {
    const newDesktopFadeElement = document.createElement("div");
    const desktopElement = document.getElementById("desktopBG");
    newDesktopFadeElement.className = desktopFadeClass;

    if (!desktopElement) {
      throw new Error("Could not find desktop element");
    }

    desktopElement.appendChild(newDesktopFadeElement);
  } else {
    const desktopFadeElement = document.getElementsByClassName(desktopFadeClass)[0];
    
    if (!desktopFadeClass) {
      throw new Error("Could not find desktopFadeClass");
    }

    desktopFadeElement.remove();
  }

  $(".desktopFade").fadeToggle(250);
}

// Current time
function getTime(): void {
  const dateOBJ = new Date();

  let currentHour: number = dateOBJ.getHours();
  let currentMinute: number | string = dateOBJ.getMinutes();

  const amPm: string = currentHour < 12 ? "AM" : "PM";

  // adjust PM times by -12 hours
  if (currentHour > 12) {
    currentHour = currentHour - 12;
  }

  // add "zero" to start of minutes if <10
  if (currentMinute < 10) {
    currentMinute = "0" + currentMinute.toString();
  }

  // display time on taskbar
  $("#timeDisplay").html(
    currentHour.toString() + ":" + currentMinute.toString() + " " + amPm
  );
}

// if holding down super key (esc), log off
var lastKeyUpAt: number = 0;
$(document).on("keydown", function (event: any) {
  const key: number = event.keyCode || event.which;

  if (key != 27) {
    return;
  }

  const keyDownAt = new Date();

  setTimeout(() => {
    // Compare key down time with key up time
    if (+keyDownAt > +lastKeyUpAt) {
      // Key has been held down for x seconds
      user("lock");
    }
  }, 2000);
});

$(document).on("keyup", () => {
  lastKeyUpAt = new Date();
});

// webpage init
$(window).load(() => {
  $(".start-menu").hide().css("opacity", 1);
});

// Unfocus windows when desktop is clicked
$(".desktop").click((e: MouseEvent) => {
  if (!$(".desktop").has(e.target).length) {
    desktopContextMenu(event.clientX, event.clientY, false);
  }
});

$("#superButton").click(toggleStart);
$(".start-menu__recent li a").click(toggleStart);
$(".start-screen__tile").click(toggleStart);

// ALL APPS DRAW
document.getElementById("allAppsButton").onclick = () => {
  $("#all-apps").show();
};

document.getElementById("allAppsCloseBTN").onclick = () => {
  $("#all-apps").hide();
};

// Prevent "open" class on start
$(() => {
  $("#superButton").click(() => {
    $(this).removeClass("taskbar__item--open taskbar__item--active");
  });
});

$.urlParam = (name: string) => {
  const results: RegExpExecArray | null = new RegExp(
    "[?&]" + name + "=([^&#]*)"
  ).exec(window.location.href);

  if (results == null) {
    return 0;
  }

  return results[1];
};

$(".menu-toggle").each(function () {
  const menuName = $(this).data("menu");
  const menu = $(`.menu[data-menu="${menuName}"]`);

  if (!$(menu).hasClass("menu--bottom")) {
    $(menu).position({
      my: "left top",
      at: "left bottom",
      of: this,
      collision: "none",
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
$(document).mouseup(function (e: any) {
  if (
    $(".menu").has(e.target).length == 0 &&
    !$(".menu-toggle").is(e.target) &&
    $(".menu-toggle").has(e.target).length == 0
  )
    $(".menu").hide();
});

$("#currentUser").text($.urlParam("usr"));

/* LOOP */
// countdown timer till screensaver will be activated
let screensaverTimeout: number = 480; // seconds (8) minutes default
function loop(): void {
  getTime();
  setTimeout(loop, 1000);
  screensaverTimeout -= 1;
  if (screensaverTimeout < 1)
    window.location.href = "./NeonX/sys/screensaver/screensaver.html?usr=" + $.urlParam("usr");
}
loop();
