window.onload = function () {
    var video = document.getElementById("videoOutlet");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Error: no camera detected");
        return;
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        video.srcObject = stream;
        video.play();
    });
};
function takePicture() {
    var video = document.getElementById("videoOutlet");
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var context = canvas.getContext("2d");
    context === null || context === void 0 ? void 0 : context.drawImage(video, 0, 0);
    var link = document.createElement("a");
    link.download = "capture.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    link.remove();
    canvas.remove();
}
