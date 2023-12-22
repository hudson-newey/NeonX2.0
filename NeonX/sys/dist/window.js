var _a = require("electron"), app = _a.app, BrowserWindow = _a.BrowserWindow, globalShortcut = _a.globalShortcut;
var uiLocation = "login.html";
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        center: true,
        fullscreen: true,
        alwaysOnTop: true,
        title: "NeonX2.0",
        icon: __dirname + "/favicon.png",
        transparent: true,
        frame: false,
        webPreferences: {
            plugins: true,
            nodeIntegration: false,
            show: false
        }
    });
    // and load the index.html of the app.
    win.loadFile(uiLocation);
}
function createGlobalShortcut() {
    var homekey = "CommandOrControl+H";
    globalShortcut.register(homekey, function () {
        win.loadFile(uiLocation);
    });
    console.log("Homepage Set to: " + homekey, globalShortcut.isRegistered(homekey));
}
app.on("ready", function () {
    createWindow();
    createGlobalShortcut();
});
