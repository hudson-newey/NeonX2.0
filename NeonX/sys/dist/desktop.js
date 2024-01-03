var openApps = [];
var mouseLocation = new Array(0, 0);
// icons
function addIcon(action) {
    switch (action) {
        case "file":
            addFile();
    }
}
var addFile = function () {
    // brand new file
    var uniqueLinkID = generateRandomString(8);
    var iconContainer = document.createElement("div");
    iconContainer.id = uniqueLinkID;
    iconContainer.className = "desktopItem";
    $("#desktopBG").append(iconContainer);
    var iconPicture = document.createElement("img");
    iconPicture.className = "desktopItemIcon";
    iconPicture.id = uniqueLinkID + "__icon";
    iconPicture.src = "./NeonX/icons/file_icon.png";
    $("#" + uniqueLinkID).append(iconPicture);
    var iconText = document.createElement("input");
    iconText.className = "waitingInput";
    iconText.id = uniqueLinkID + "__name";
    iconText.setAttribute("file_id", uniqueLinkID);
    iconText.value = "untitled";
    $("#" + uniqueLinkID).dblclick(function () {
        startProgram("", "http://localhost:8080?dir=Home/Documents/" + $("#" + uniqueLinkID).text());
    });
    $("#" + uniqueLinkID).append(iconText);
    // refresh desktop to add folder visualization
    initializeDesktop();
};
/* APPS */
// 'start program' app type parsing
var startProgram = function (app, uri) {
    if (uri != "" && uri != null)
        newWindow(uri, uri); // navigate to website
    if (app != "" && app != null)
        newWindow("./applications/" + app + "/index.html", app);
    $("#all-apps").hide();
};
// CREATE CONTAINER
function newWindow(appLink, appName) {
    var containerID = generateRandomString(8);
    // we do this to prevent duplicate container IDs
    while (openApps.includes(containerID)) {
        containerID = generateRandomString(8);
    }
    var appContainer = document.createElement("div");
    appContainer.id = containerID;
    appContainer.className = "programWindow";
    appContainer.ondblclick = function () { return fullscreenProgram(containerID); };
    $("#desktopBG").append(appContainer);
    openApps.push(containerID);
    $(".programWindow").draggable();
    /* GLOBAL MENU BUTTONS */
    var closeBTN = document.createElement("button");
    closeBTN.className = "menubar";
    closeBTN.innerText = "X";
    closeBTN.onclick = function () { return taskKill(3, containerID, false); };
    appContainer.append(closeBTN);
    // maximize button
    var maxBTN = document.createElement("button");
    maxBTN.className = "menubar";
    maxBTN.innerText = "↑";
    maxBTN.onclick = function () { return fullscreenProgram(containerID); };
    appContainer.append(maxBTN);
    // minimize button
    var minBTN = document.createElement("button");
    minBTN.className = "menubar";
    minBTN.innerText = "↓";
    minBTN.style.top = "-2px";
    minBTN.onclick = function () { return minimize(containerID); };
    appContainer.append(minBTN);
    // container header
    var containerTitle = document.createElement("span");
    containerTitle.className = "containerTitle";
    containerTitle.innerText = appName;
    minBTN.style.top = "-2px";
    appContainer.append(containerTitle);
    var viewFrame = document.createElement("iframe");
    viewFrame.src = appLink;
    viewFrame.className = "viewFrame";
    appContainer.append(viewFrame);
    appContainer.onmouseup = function () { return (viewFrame.style.display = "block"); };
    appContainer.onmousedown = function ($event) {
        return taskKill($event, containerID, true, viewFrame);
    };
    // add taskbar object
    var taskbarItemId = generateRandomString(8);
    var taskbarItem = document.createElement("p");
    taskbarItem.id = taskbarItemId;
    taskbarItem.className = "taskbarItem";
    taskbarItem.setAttribute("app", containerID);
    $("#appsTray").append(taskbarItem);
    // taskbar object and icon
    if (!appName.includes("://")) {
        taskbarItem.insertAdjacentHTML("afterbegin", "<img class='appTrayIcon' src='./applications/" +
            appName +
            "/favicon.png'>" +
            appName);
    }
    else {
        // web app frame
        if (appName.includes("localhost:8080")) {
            // file explorer
            taskbarItem.insertAdjacentHTML("afterbegin", "<img class='appTrayIcon' src='./NeonX/icons/folder.png'>File Explorer");
        }
        else {
            // web frame
            taskbarItem.insertAdjacentHTML("afterbegin", "<img class='appTrayIcon' src='./NeonX/icons/internet.png'>Web Browser");
        }
    }
    // init taskbar item with click events
    $(".taskbarItem").mousedown(function (event) {
        if (event.which == 1) {
            bringToFront($(this).attr("app"));
        }
        else if (event.which == 3) {
            taskKill(3, $(this).attr("app"), false);
        }
    });
    bringToFront(containerID);
}
// remove program from backend list of open apps
var removeProgram = function (app) {
    for (var i = 0; i < openApps.length; i++) {
        if (openApps[i] === app)
            openApps.splice(i, 1);
    }
};
// TASKKILL (event, app, false)
// taskkill function
function taskKill(e, app, click, innerFrame) {
    // bring to front
    bringToFront(app);
    // hide the inner frame so that the draggable hitbox is as big as possible
    if (innerFrame) {
        innerFrame.style.display = "none";
    }
    // if the user right clicked on either the taskbar item or container
    var closeApp = false;
    if (click) {
        var rightclick;
        if (!e_1)
            var e_1 = window.event;
        if (e_1.which)
            rightclick = e_1.which == 3;
        else if (e_1.button)
            rightclick = e_1.button == 2;
        if (rightclick)
            closeApp = true;
    }
    else {
        // false parameter skips to kill sequence
        closeApp = true;
    }
    if (closeApp == true) {
        $("#" + app).remove(); // frontend
        removeProgram(app); // backend
        $('p[app="' + app + '"]').remove(); // taskbar
    }
}
function bringToFront(app) {
    for (var i = 0; i < openApps.length; i++) {
        if (openApps[i] != app) {
            document.getElementById(openApps[i]).style.zIndex -= 1;
        }
        else {
            document.getElementById(openApps[i]).style.zIndex = 128;
        }
    }
    $("#" + app).css("display", "inline");
}
// minimizes app to hidden on desktop
function minimize(app) {
    $("#" + app).css("display", "none");
}
function fullscreenProgram(app) {
    var fullscreenClass = "fullscreen";
    var appElement = $("#" + app);
    var isFullscreen = appElement.hasClass(fullscreenClass);
    if (isFullscreen) {
        appElement.removeClass(fullscreenClass);
    }
    else {
        appElement.addClass(fullscreenClass);
    }
}
function showDesktop() {
    $("#all-apps").hide();
    openApps.forEach(function (app) { return minimize(app); });
}
// desktop context menu toggling
function desktopContextMenu(x, y, toggle) {
    if (toggle) {
        if ($("#desktopContextMenu").css("display") == "block") {
            $("#desktopContextMenu").css("display", "none");
        }
        else {
            $("#desktopContextMenu").css("left", x);
            $("#desktopContextMenu").css("top", y - 20);
            $("#desktopContextMenu").css("display", "block");
        }
    }
    else {
        $("#desktopContextMenu").css("display", "none");
    }
}
// 'edit desktop' feedback highlighting
function editDesktop(desktopItem, enabled) {
    desktopItem = $(desktopItem);
    if (enabled == true) {
        desktopItem.css("background-color", "rgba(120, 144, 156, 0.8)");
        desktopItem.css("border-style", "dotted");
        desktopItem.css("border-width", "1px");
    }
    else if (enabled == false) {
        desktopItem.css("background-color", "");
        desktopItem.css("border-style", "none");
    }
    else {
        // DEFAULT
        // for toggle use no paramiters
        if (desktopItem.css("background-color") == "rgba(120, 144, 156, 0.8)") {
            desktopItem.css("background-color", "");
            desktopItem.css("border-style", "none");
        }
        else {
            desktopItem.css("background-color", "rgba(120, 144, 156, 0.8)");
            desktopItem.css("border-style", "dotted");
            desktopItem.css("border-width", "1px");
        }
    }
} // end of 'edit desktop' function
// install or add app function
function addApp(file) {
    desktopContextMenu(null, null, false); //toggle context menu
    var reader = new FileReader();
    reader.onload = function (e) {
        if (file[0].name == "package.app") {
            // correct file type
            var appName_1 = e.target.result;
            var iconID = generateRandomString(8);
            var iconContainer = document.createElement("div");
            iconContainer.id = iconID;
            iconContainer.className = "desktopItem";
            iconContainer.ondblclick = function () {
                startProgram(appName_1, "");
            };
            $("#desktopBG").append(iconContainer);
            var drawIcon = document.createElement("div");
            drawIcon.id = iconID;
            drawIcon.className = "drawItem";
            drawIcon.onclick = function () {
                startProgram(appName_1, "");
            };
            $("#all-apps").append(drawIcon);
            var iconPicture = document.createElement("img");
            iconPicture.className = "desktopItemIcon";
            iconPicture.src = "./applications/" + appName_1 + "/favicon.png";
            $("#" + iconID).append(iconPicture);
            var iconText = document.createElement("text");
            iconText.innerText = appName_1;
            $("#" + iconID).append(iconText);
            initializeDesktop();
        }
        else {
            console.error("Failed to install app: " + text.name);
        }
    };
    reader.readAsText(file[0]);
}
// creates a blue bounding box element when dragging on the desktop
var desktopHighlighting = false;
function bindDesktopHighlight() {
    var desktopElement = document.getElementById("desktopBG");
    desktopElement.addEventListener("mousemove", function (event) {
        mousePosition = [event.clientX, event.clientY];
    });
    desktopElement.addEventListener("mousedown", function (event) {
        // only create the highlight if we are left clicking
        if (event.which !== 1) {
            return;
        }
        // exit if we are touching any other child element
        // we have to do this because most elements are contained within the desktop
        if (event.target !== desktopElement) {
            return;
        }
        var interval = setInterval(function () { return resizeDesktopHighlight(event); }, 0);
        desktopElement.addEventListener("mouseup", function () {
            clearInterval(interval);
            removeDesktopHighlight();
        });
    });
}
var mousePosition = [0, 0];
var dragStartPosition = [0, 0];
function resizeDesktopHighlight(event) {
    var highlightClass = "cursorHighlight";
    var desktopElement = document.getElementById("desktopBG");
    var highlightElement = document.getElementsByClassName(highlightClass)[0];
    if (!highlightElement) {
        // create a new one
        var newHighlightElement = document.createElement("div");
        newHighlightElement.className = highlightClass;
        newHighlightElement.style.left = event.clientX + "px";
        newHighlightElement.style.top = event.clientY + "px";
        dragStartPosition = [event.clientX, event.clientY];
        desktopElement.appendChild(newHighlightElement);
        highlightElement = newHighlightElement;
    }
    var highlightWidth = mousePosition[0] - dragStartPosition[0];
    var highlightHeight = mousePosition[1] - dragStartPosition[1];
    highlightElement.style.width = Math.abs(highlightWidth) + "px";
    highlightElement.style.height = Math.abs(highlightHeight) + "px";
    if (highlightWidth < 0) {
        highlightElement.style.left = mousePosition[0] + "px";
    }
    if (highlightHeight < 0) {
        highlightElement.style.top = mousePosition[1] + "px";
    }
}
function removeDesktopHighlight() {
    var highlightElement = document.getElementsByClassName("cursorHighlight")[0];
    if (highlightElement) {
        highlightElement.remove();
    }
}
// used for initialization of desktop and refreshes
var initializeDesktop = function () {
    // desktop icons init
    var p = $(".desktopItem").draggable();
    var desktopItems = $(".desktopItem");
    desktopItems.each(function (i) {
        desktopItems[i].onmousedown = function () { return editDesktop(desktopItems[i], true); };
        desktopItems[i].onmouseup = function () { return editDesktop(desktopItems[i], false); };
    });
    bindDesktopHighlight();
    // taskbar initilization
    $(".taskbarItem").click(function (e) {
        bringToFront($(this).attr("app"));
    });
    // all apps grid
    $("#all-apps").hide();
    // icon renaming
    $(".waitingInput").keyup(function (e) {
        if (e.keyCode == 13) {
            this.replaceWith(this.value);
            // find what desktop icon it should use
            var uniqueFileID = this.getAttribute("file_id");
            if (this.value.includes(".")) {
                // the icon should be a file icon
                // test if the file is a picture
                if (this.value.includes(".png") ||
                    this.value.includes(".jpg") ||
                    this.value.includes(".jpeg") ||
                    this.value.includes(".gif")) {
                    $("#" + uniqueFileID + "__icon").attr("src", "./Home/Documents/" + this.value);
                }
                else if (this.value.includes(".pdf")) {
                    // pdf files
                    $("#" + uniqueFileID + "__icon").attr("src", "./NeonX/icons/pdf_icon.png");
                }
                else {
                    // default to text icon
                    $("#" + uniqueFileID + "__icon").attr("src", "./NeonX/icons/file_icon.png");
                }
            }
            else {
                // it is a folder, and should use a folder icon
                $("#" + uniqueFileID + "__icon").attr("src", "./NeonX/icons/folder.png");
            }
        }
    });
};
$(document).ready(function () {
    initializeDesktop();
});
// sub FUNCTIONS
var generateRandomString = function (length) {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var text = "";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    desktopContextMenu(event.clientX, event.clientY, true);
});
