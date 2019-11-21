var openApps = [];
var mouseLocation = [0, 0];
const backgroundCount = 8;

function startProgram(app, uri) {
  if (uri != "" && uri != null) newWindow(uri); // navigate to website
  if (app != "" && app != null) newWindow("./Home/applications/" + app + "/index.html");
}

function newWindow(appLink) {
	let programName = generateRandomString(8);

	let appContainer = document.createElement("app");
	appContainer.id = programName;
	appContainer.className = "programWindow";
	appContainer.draggable = "false";
  appContainer.ondblclick = function() { fullscreenProgram(programName); };
  appContainer.onmousedown = function(event) { taskkill(event, programName, true); };
	$("#desktopBG").append(appContainer);
	openApps.push(programName);
  $(".programWindow").draggable();

  // menubar
  let closeBTN = document.createElement("button");
  closeBTN.className = "menubar";
  closeBTN.innerText = "X";
  closeBTN.onclick = function() { taskkill(3, programName, false); };
  $("#" + programName).append(closeBTN);

  let maxBTN = document.createElement("button");
  maxBTN.className = "menubar";
  maxBTN.innerText = "🗖";
  maxBTN.style.top = "-1px";
  maxBTN.onclick = function() { fullscreenProgram(programName, false); };
  $("#" + programName).append(maxBTN);

  //vf = viewerframe
  let vf = document.createElement("iframe");
  vf.src = appLink;
  //vf.scrolling = "no";
  vf.className = "viewFrame";
  $("#" + programName).append(vf);
}


let removeProgram = (app) => {
  // remove closing app from app list
  for( var i = 0; i < openApps.length; i++){
    if ( openApps[i] === app) {
      openApps.splice(i, 1);
    }
  }
}


function taskkill(e, app, click) {
  for (var i = 0; i < openApps.length; i++) {
    if (openApps[i] != app) {
      document.getElementById(openApps[i]).style.zIndex -= 1;
    } else {
      document.getElementById(openApps[i]).style.zIndex = 128;
    }
  }

  if (click == true) {
    var rightclick;
    if (!e) var e = window.event;
    if (e.which) rightclick = (e.which == 3);
    else if (e.button) rightclick = (e.button == 2);
    if (rightclick == true) {
      $("#" + app).remove();
      removeProgram(app);
    }
  } else {
    $("#" + app).remove();
    removeProgram(app);
  }
}

var $win = $(window);
function fullscreenProgram(app) {
	if ($("#" + app).width() == $win.width()) {
		document.getElementById(app).style.top = "100px";
		document.getElementById(app).style.left = "150px";
    document.getElementById(app).style.opacity = "0.95";
		$("#" + app).height($win.height() * 0.5);
		$("#" + app).width($win.width() * 0.4);
		console.log("Minimise " + app);
	} else {
		document.getElementById(app).style.top = "0px";
		document.getElementById(app).style.left = "0px";
		document.getElementById(app).style.opacity = "1";
		$("#" + app).height($win.height() - 48);
		$("#" + app).width($win.width());
		console.log("Maximise " + app);
	}
}

function desktopContextMenu(x, y, toggle) {
  if (toggle == true) {
    if ($("#desktopContextMenu").css("display") == "block") {
      $("#desktopContextMenu").css("display", "none");
    } else {
      $("#desktopContextMenu").css("left", x);
      $("#desktopContextMenu").css("top", y - 20);
      $("#desktopContextMenu").css("display", "block");
    }
  } else {$("#desktopContextMenu").css("display", "none");}
}

function editDesktop(enabled) {
  var p = $(".desktop__item");
  if (enabled == true) {
    p.css("background-color", "rgba(120, 144, 156, 0.8)");
    p.css("border-style", "dotted");
  } else if (enabled == false) {
    p.css("background-color", "");
    p.css("border-style", "none");
  } else {

    // for toggle use no paramiters
    if (p.css("background-color") == "rgba(120, 144, 156, 0.8)") {
      p.css("background-color", "");
      p.css("border-style", "none");
    } else {
      p.css("background-color", "rgba(120, 144, 156, 0.8)");
      p.css("border-style", "dotted");
    }

  }
}

let initializeDesktop = () => {
  var p = $(".desktop__item").draggable();
  $(".desktop__item").mousedown(function(eventObject){editDesktop(true);});
  $(".desktop__item").mouseup(function(eventObject){editDesktop(false);});
}
$(document).ready(function() {initializeDesktop();});


// sub FUNCTIONS
let generateRandomString = (length) => {
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

// get rid of ghosting image
document.addEventListener("dragstart", function( event ) {
    var img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    event.dataTransfer.setDragImage(img, 0, 0);
}, false);
// get rid of context menu
document.oncontextmenu = function() {
  return false;
}

document.addEventListener('contextmenu', event => {
  event.preventDefault();
  desktopContextMenu(event.clientX, event.clientY, true);
});
