function readFile($event: Event): void {
  const pdfContainerElement = document.getElementById(
    "pdfContainer"
  ) as HTMLEmbedElement;
  const inputElement = $event.target as HTMLInputElement;

  if (!inputElement.files) return;

  const file = inputElement.files[0];

  // check that the file is a pdf
  if (!file.type.endsWith("pdf")) {
	alert("The selected file is not a valid PDF file");
	return;
  }

  if (!pdfContainerElement) return;

  pdfContainerElement.src = URL.createObjectURL(file);
}

window.onload = () => {
  document.getElementById("fileInput")?.addEventListener("change", (event) => {
    readFile(event);
  });
};
