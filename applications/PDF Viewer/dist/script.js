function readFile($event) {
    var pdfContainerElement = document.getElementById("pdfContainer");
    var inputElement = $event.target;
    if (!inputElement.files)
        return;
    var file = inputElement.files[0];
    // check that the file is a pdf
    if (!file.type.endsWith("pdf")) {
        alert("The selected file is not a valid PDF file");
        return;
    }
    if (!pdfContainerElement)
        return;
    pdfContainerElement.src = URL.createObjectURL(file);
}
window.onload = function () {
    var _a;
    (_a = document.getElementById("fileInput")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", function (event) {
        readFile(event);
    });
};
