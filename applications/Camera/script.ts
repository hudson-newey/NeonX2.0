window.onload = () => {
  const video = document.getElementById("videoOutlet") as HTMLVideoElement;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Error: no camera detected");
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.play();
  });
};

function takePicture(): void {
  const video = document.getElementById("videoOutlet") as HTMLVideoElement;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");
  context?.drawImage(video, 0, 0);

  const link = document.createElement("a");
  link.download = "capture.png";
  link.href = canvas.toDataURL("image/png");
  link.click();

  link.remove();
  canvas.remove();
}
