function readFile($event) {
    var textArea = document.getElementById("textInput");
    var input = $event.target;
    if (!input.files || !input.files[0])
        return;
    if (!textArea)
        return;
    var file = input.files[0];
    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        textArea.innerHTML = text;
    };
    reader.readAsText(file);
}
