let openApps: string[] = [];
let mouseLocation: number[] = new Array(0, 0);

// icons
function addIcon(action: string): void {
  switch (action) {
    case "file":
      addFile();
  }
}

let addFile = (): void => {
  // brand new file
  let uniqueLinkID: string = generateRandomString(8);
  let iconContainer = document.createElement("div");
  iconContainer.id = uniqueLinkID;
  iconContainer.className = "desktopItem";
  $("#desktopBG").append(iconContainer);

  let iconPicture = document.createElement("img");
  iconPicture.className = "desktopItemIcon";
  iconPicture.id = uniqueLinkID + "__icon";
  iconPicture.src = "./NeonX/icons/file_icon.png";
  $("#" + uniqueLinkID).append(iconPicture);

  let iconText = document.createElement("input");
  iconText.className = "waitingInput";
  iconText.id = uniqueLinkID + "__name";
  iconText.setAttribute("file_id", uniqueLinkID);
  iconText.value = "untitled";
  $("#" + uniqueLinkID).dblclick(function () {
    startProgram(
      "",
      "http://localhost:8080?dir=Home/Documents/" + $("#" + uniqueLinkID).text()
    );
  });
  $("#" + uniqueLinkID).append(iconText);

  // refresh desktop to add folder visualization
  initializeDesktop();
};

/* APPS */
// 'start program' app type parsing
let startProgram = (app: string, uri: string): void => {
  if (uri != "" && uri != null) newWindow(uri, uri); // navigate to website
  if (app != "" && app != null)
    newWindow("./applications/" + app + "/index.html", app);

  $("#all-apps").hide();
};

// CREATE CONTAINER
function newWindow(appLink: string, appName: string): void {
  let containerID: string = generateRandomString(8);

  // we do this to prevent duplicate container IDs
  while (openApps.includes(containerID)) {
    containerID = generateRandomString(8);
  }

  const appContainer = document.createElement("div");
  appContainer.id = containerID;
  appContainer.className = "programWindow";
  appContainer.ondblclick = () => fullscreenProgram(containerID);
  $("#desktopBG").append(appContainer);
  openApps.push(containerID);
  $(".programWindow").draggable();

  /* GLOBAL MENU BUTTONS */
  const closeBTN = document.createElement("button");
  closeBTN.className = "menubar";
  closeBTN.innerText = "X";
  closeBTN.onclick = () => taskKill(3, containerID, false);
  appContainer.append(closeBTN);

  // maximize button
  const maxBTN = document.createElement("button");
  maxBTN.className = "menubar";
  maxBTN.innerText = "↑";
  maxBTN.onclick = () => fullscreenProgram(containerID);
  appContainer.append(maxBTN);

  // minimize button
  const minBTN = document.createElement("button");
  minBTN.className = "menubar";
  minBTN.innerText = "↓";
  minBTN.style.top = "-2px";
  minBTN.onclick = () => minimize(containerID);
  appContainer.append(minBTN);

  // container header
  const containerTitle = document.createElement("span");
  containerTitle.className = "containerTitle";
  containerTitle.innerText = appName;
  minBTN.style.top = "-2px";
  appContainer.append(containerTitle);

  const viewFrame = document.createElement("iframe");
  viewFrame.src = appLink;
  viewFrame.className = "viewFrame";
  appContainer.append(viewFrame);

  appContainer.onmouseup = () => (viewFrame.style.display = "block");
  appContainer.onmousedown = ($event) =>
    taskKill($event, containerID, true, viewFrame);

  // add taskbar object
  const taskbarItemId: string = generateRandomString(8);
  const taskbarItem = document.createElement("p");
  taskbarItem.id = taskbarItemId;
  taskbarItem.className = "taskbarItem";
  taskbarItem.setAttribute("app", containerID);
  $("#appsTray").append(taskbarItem);

  // taskbar object and icon
  if (!appName.includes("://")) {
    taskbarItem.insertAdjacentHTML(
      "afterbegin",
      "<img class='appTrayIcon' src='./applications/" +
        appName +
        "/favicon.png'>" +
        appName
    );
  } else {
    // web app frame
    if (appName.includes("localhost:8080")) {
      // file explorer
      taskbarItem.insertAdjacentHTML(
        "afterbegin",
        "<img class='appTrayIcon' src='./NeonX/icons/folder.png'>File Explorer"
      );
    } else {
      // web frame
      taskbarItem.insertAdjacentHTML(
        "afterbegin",
        "<img class='appTrayIcon' src='./NeonX/icons/internet.png'>Web Browser"
      );
    }
  }

  // init taskbar item with click events
  $(".taskbarItem").mousedown(function (event) {
    if (event.which == 1) {
      bringToFront($(this).attr("app"));
    } else if (event.which == 3) {
      taskKill(3, $(this).attr("app"), false);
    }
  });

  bringToFront(containerID);
}

// remove program from backend list of open apps
let removeProgram = (app: string): void => {
  for (let i = 0; i < openApps.length; i++) {
    if (openApps[i] === app) openApps.splice(i, 1);
  }
};

// TASKKILL (event, app, false)
// taskkill function
function taskKill(
  e,
  app: string,
  click: boolean,
  innerFrame?: HTMLIFrameElement
): void {
  // bring to front
  bringToFront(app);

  // hide the inner frame so that the draggable hitbox is as big as possible
  if (innerFrame) {
    innerFrame.style.display = "none";
  }

  // if the user right clicked on either the taskbar item or container
  let closeApp: boolean = false;
  if (click) {
    var rightclick;
    if (!e) let e = window.event;
    if (e.which) rightclick = e.which == 3;
    else if (e.button) rightclick = e.button == 2;
    if (rightclick) closeApp = true;
  } else {
    // false parameter skips to kill sequence
    closeApp = true;
  }

  if (closeApp == true) {
    $("#" + app).remove(); // frontend
    removeProgram(app); // backend
    $('p[app="' + app + '"]').remove(); // taskbar
  }
}

function bringToFront(app: string): void {
  for (var i = 0; i < openApps.length; i++) {
    if (openApps[i] != app) {
      document.getElementById(openApps[i]).style.zIndex -= 1;
    } else {
      document.getElementById(openApps[i]).style.zIndex = 128;
    }
  }
  $("#" + app).css("display", "inline");
}

// minimizes app to hidden on desktop
function minimize(app): void {
  $("#" + app).css("display", "none");
}

function fullscreenProgram(app: string): void {
  const fullscreenClass = "fullscreen";
  const appElement = $(`#${app}`);
  const isFullscreen = appElement.hasClass(fullscreenClass);

  if (isFullscreen) {
    appElement.removeClass(fullscreenClass);
  } else {
    appElement.addClass(fullscreenClass);
  }
}

function showDesktop(): void {
  $("#all-apps").hide();
  openApps.forEach((app: string) => minimize(app));
}

// desktop context menu toggling
function desktopContextMenu(x: number, y: number, toggle: boolean): void {
  if (toggle) {
    if ($("#desktopContextMenu").css("display") == "block") {
      $("#desktopContextMenu").css("display", "none");
    } else {
      $("#desktopContextMenu").css("left", x);
      $("#desktopContextMenu").css("top", y - 20);
      $("#desktopContextMenu").css("display", "block");
    }
  } else {
    $("#desktopContextMenu").css("display", "none");
  }
}

// 'edit desktop' feedback highlighting
function editDesktop(desktopItem, enabled: boolean): void {
  desktopItem = $(desktopItem);

  if (enabled == true) {
    desktopItem.css("background-color", "rgba(120, 144, 156, 0.8)");
    desktopItem.css("border-style", "dotted");
    desktopItem.css("border-width", "1px");
  } else if (enabled == false) {
    desktopItem.css("background-color", "");
    desktopItem.css("border-style", "none");
  } else {
    // DEFAULT
    // for toggle use no paramiters
    if (desktopItem.css("background-color") == "rgba(120, 144, 156, 0.8)") {
      desktopItem.css("background-color", "");
      desktopItem.css("border-style", "none");
    } else {
      desktopItem.css("background-color", "rgba(120, 144, 156, 0.8)");
      desktopItem.css("border-style", "dotted");
      desktopItem.css("border-width", "1px");
    }
  }
} // end of 'edit desktop' function

// install or add app function
function addApp(file: any) {
  desktopContextMenu(null, null, false); //toggle context menu

  let reader = new FileReader();
  reader.onload = function (e) {
    if (file[0].name == "package.app") {
      // correct file type
      let appName = e.target.result;

      let iconID = generateRandomString(8);
      let iconContainer = document.createElement("div");
      iconContainer.id = iconID;
      iconContainer.className = "desktopItem";
      iconContainer.ondblclick = function () {
        startProgram(appName, "");
      };
      $("#desktopBG").append(iconContainer);

      let drawIcon = document.createElement("div");
      drawIcon.id = iconID;
      drawIcon.className = "drawItem";
      drawIcon.onclick = function () {
        startProgram(appName, "");
      };
      $("#all-apps").append(drawIcon);

      let iconPicture = document.createElement("img");
      iconPicture.className = "desktopItemIcon";
      iconPicture.src = "./applications/" + appName + "/favicon.png";
      $("#" + iconID).append(iconPicture);

      let iconText = document.createElement("text");
      iconText.innerText = appName;
      $("#" + iconID).append(iconText);

      initializeDesktop();
    } else {
      console.error("Failed to install app: " + text.name);
    }
  };
  reader.readAsText(file[0]);
}

// creates a blue bounding box element when dragging on the desktop
let desktopHighlighting: boolean = false;
function bindDesktopHighlight(): void {
  const desktopElement = document.getElementById("desktopBG") as HTMLDivElement;

  desktopElement.addEventListener("mousemove", (event: MouseEvent) => {
    mousePosition = [event.clientX, event.clientY];
  });

  desktopElement.addEventListener("mousedown", (event: MouseEvent) => {
    // only create the highlight if we are left clicking
    if (event.which !== 1) {
      return;
    }

    // exit if we are touching any other child element
    // we have to do this because most elements are contained within the desktop
    if (event.target !== desktopElement) {
      return;
    }

    var interval = setInterval(() => resizeDesktopHighlight(event), 0);
    desktopElement.addEventListener("mouseup", () => {
      clearInterval(interval);
      removeDesktopHighlight();
    });
  });
}

let mousePosition: number[] = [0, 0];
let dragStartPosition: number[] = [0, 0];
function resizeDesktopHighlight(event: MouseEvent): void {
  const highlightClass = "cursorHighlight";

  const desktopElement = document.getElementById("desktopBG") as HTMLDivElement;
  let highlightElement = document.getElementsByClassName(highlightClass)[0] as HTMLDivElement;

  if (!highlightElement) {
    // create a new one
    const newHighlightElement = document.createElement("div");
    newHighlightElement.className = highlightClass;

    newHighlightElement.style.left = `${event.clientX}px`;
    newHighlightElement.style.top = `${event.clientY}px`;

    dragStartPosition = [event.clientX, event.clientY];

    desktopElement.appendChild(newHighlightElement);

    highlightElement = newHighlightElement;
  }
  
  const highlightWidth = mousePosition[0] - dragStartPosition[0];
  const highlightHeight = mousePosition[1] - dragStartPosition[1];

  highlightElement.style.width = `${Math.abs(highlightWidth)}px`;
  highlightElement.style.height = `${Math.abs(highlightHeight)}px`;

  if (highlightWidth < 0) {
    highlightElement.style.left = `${mousePosition[0]}px`;
  }

  if (highlightHeight < 0) {
    highlightElement.style.top = `${mousePosition[1]}px`;
  }
}

function removeDesktopHighlight(): void {
  const highlightElement = document.getElementsByClassName("cursorHighlight")[0] as HTMLDivElement;

  if (highlightElement) {
    highlightElement.remove();
  }
}

// used for initialization of desktop and refreshes
let initializeDesktop = (): void => {
  // desktop icons init
  let p = $(".desktopItem").draggable();

  const desktopItems = $(".desktopItem");
  desktopItems.each((i) => {
    desktopItems[i].onmousedown = () => editDesktop(desktopItems[i], true);
    desktopItems[i].onmouseup = () => editDesktop(desktopItems[i], false);
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
      let uniqueFileID: String = this.getAttribute("file_id");
      if (this.value.includes(".")) {
        // the icon should be a file icon

        // test if the file is a picture
        if (
          this.value.includes(".png") ||
          this.value.includes(".jpg") ||
          this.value.includes(".jpeg") ||
          this.value.includes(".gif")
        ) {
          $("#" + uniqueFileID + "__icon").attr(
            "src",
            "./Home/Documents/" + this.value
          );
        } else if (this.value.includes(".pdf")) {
          // pdf files
          $("#" + uniqueFileID + "__icon").attr(
            "src",
            "./NeonX/icons/pdf_icon.png"
          );
        } else {
          // default to text icon
          $("#" + uniqueFileID + "__icon").attr(
            "src",
            "./NeonX/icons/file_icon.png"
          );
        }
      } else {
        // it is a folder, and should use a folder icon
        $("#" + uniqueFileID + "__icon").attr(
          "src",
          "./NeonX/icons/folder.png"
        );
      }
    }
  });
};

$(document).ready(function () {
  initializeDesktop();
});

// sub FUNCTIONS
let generateRandomString = (length: number): string => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  desktopContextMenu(event.clientX, event.clientY, true);
});
