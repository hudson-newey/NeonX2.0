var openApps = [];
var mouseLocation = [0, 0];
const backgroundCount = 9;

// icons
function addIcon(action) {
  switch (action) {
    case "folder":
      newFolder();
  }
}

let newFolder = () => {
  let temps = generateRandomString(8);
  var fileName = prompt("New Folder,", "untitled");
  if (fileName == null || fileName == "") {return 0;} //if there is no file name 'return 0;'
  var appName = "Folder"
  let iconContainer = document.createElement("div");
  iconContainer.id = temps;
  iconContainer.className = "desktop__item";
  iconContainer.ondblclick = function() { startProgram("", './applications/Folder/index.html?file=' + fileName) };
  $("#desktopBG").append(iconContainer);

  let iconPicture = document.createElement("img");
  iconPicture.className = "desktop_icons";
  iconPicture.src = "./applications/Folder/favicon.png";
  $("#" + temps).append(iconPicture);

  let iconText = document.createElement("text");
  iconText.innerText = fileName;
  $("#" + temps).append(iconText);

  initializeDesktop();
}

// apps
// start program parsing
function startProgram(app, uri) {
  if (uri != "" && uri != null) newWindow(uri, uri); // navigate to website
  if (app != "" && app != null) newWindow("./applications/" + app + "/index.html", app);
}


// open window and create taskbar icon
function newWindow(appLink, appName) {
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
  maxBTN.style.top = "-2px";
  maxBTN.onclick = function() { fullscreenProgram(programName, false); };
  $("#" + programName).append(maxBTN);

  let minBTN = document.createElement("button");
  minBTN.className = "menubar";
  minBTN.innerText = "_";
  minBTN.style.top = "-2px";
  minBTN.onclick = function() { sendtoBack(programName); };
  $("#" + programName).append(minBTN);

  //vf = viewerframe
  let vf = document.createElement("iframe");
  vf.src = appLink;
  //vf.scrolling = "no";
  vf.className = "viewFrame";
  $("#" + programName).append(vf);

  // add taskbar object
  var taskbarobjID = generateRandomString(8);
  let taskbarobj = document.createElement("p");
  taskbarobj.id = taskbarobjID;
  taskbarobj.className = "taskbarItem";
  taskbarobj.style.left = (openApps.length * 221) - 220 + "px";
  taskbarobj.setAttribute('app', programName);
  $("#appsTray").append(taskbarobj);

  if (!appName.includes("/")) {
    taskbarobj.insertAdjacentHTML('afterbegin', "<img class='appTrayIcon' src='./applications/" + appName + "/favicon.png'>" + appName);
  } else { // google and file explorer need to be hardcoded (i hate this)
    switch (appName) {
      case "https://www.bing.com":
        taskbarobj.insertAdjacentHTML('afterbegin', "<img class='appTrayIcon' src='./Home/Pictures/icons/google.png'>Web Browser");
        break;
      case "./Home":
        taskbarobj.insertAdjacentHTML('afterbegin', "<img class='appTrayIcon' src='./Home/Pictures/icons/files.png'>Files");
        break;
      default:
        taskbarobj.insertAdjacentHTML('afterbegin', "<img class='appTrayIcon' src='./applications/" + appName + "/favicon.png'>" + appName);
    }
  }

  // taskbar initilization
  $('.taskbarItem').mousedown(function(event) {
  if (event.which == 1) {
    bringtoFront($(this).attr("app"));
  } else if(event.which == 3) {
    taskkill(3, $(this).attr("app"), false);
  }
});
  bringtoFront(programName);
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
  // move to front
  bringtoFront(app);

  if (click == true) {
    var close = false;
    var rightclick;
    if (!e) var e = window.event;
    if (e.which) rightclick = (e.which == 3);
    else if (e.button) rightclick = (e.button == 2);
    if (rightclick == true){close = true;}
  }else{close = true;}

  if (close == true) {
    $("#" + app).remove();
    removeProgram(app);
    $('p[app="' + app + '"]').remove();
  }
}

function bringtoFront(app) {
  for (var i = 0; i < openApps.length; i++) {
    if (openApps[i] != app) {
      document.getElementById(openApps[i]).style.zIndex -= 1;
    } else {
      document.getElementById(openApps[i]).style.zIndex = 128;
    }
  }
  $("#" + app).css("display", "inline");
}

function sendtoBack(app) {
  $("#" + app).css("display", "none");
}

function fullscreenProgram(app) {
	if ($("#" + app).width() == $(window).width()) {
		document.getElementById(app).style.top = "100px";
		document.getElementById(app).style.left = "150px";
    document.getElementById(app).style.opacity = "0.95";
		$("#" + app).height($(window).height() * 0.6);
		$("#" + app).width($(window).width() * 0.45);
		console.log("Minimise " + app);
	} else {
		document.getElementById(app).style.top = "0px";
		document.getElementById(app).style.left = "0px";
		document.getElementById(app).style.opacity = "1";
		$("#" + app).height($(window).height() - 48);
		$("#" + app).width($(window).width());
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

function addApp(file) {
  desktopContextMenu(null, null, false); //toggle context menu
  var text = file[0];

  var reader = new FileReader();
  reader.onload = function(e) {
    if (text.name == "package.app") {
      // correct file type
      var appName = e.target.result;
      console.log("Installing, " + appName);

      let temps = generateRandomString(8);
      let iconContainer = document.createElement("div");
      iconContainer.id = temps;
      iconContainer.className = "desktop__item";
      iconContainer.ondblclick = function() { startProgram(appName, ''); };
      $("#desktopBG").append(iconContainer);

      let iconPicture = document.createElement("img");
      iconPicture.className = "desktop_icons";
      iconPicture.src = "./applications/" + appName + "/favicon.png";
      $("#" + temps).append(iconPicture);

      let iconText = document.createElement("text");
      iconText.innerText = appName;
      $("#" + temps).append(iconText);

      initializeDesktop();
    } else {

      console.log("Failed to load, " + text.name);
    }

  };
  reader.readAsText(text);
}

let initializeDesktop = () => {
  var p = $(".desktop__item").draggable();
  $(".desktop__item").mousedown(function(eventObject){editDesktop(true);});
  $(".desktop__item").mouseup(function(eventObject){editDesktop(false);});

  // taskbar initilization
  $(".taskbarItem").click(function(e) {
    bringtoFront($(this).attr("app"));
  });
  console.log("Desktop Refreshed!");
}
$(document).ready(function() {initializeDesktop();});

// sub FUNCTIONS
let generateRandomString = (length) => {
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ";
  let text = "";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

document.addEventListener('contextmenu', event => {
  event.preventDefault();
  desktopContextMenu(event.clientX, event.clientY, true);
});
