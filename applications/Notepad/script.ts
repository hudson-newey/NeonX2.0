function readFile($event: Event) {
	const textArea = document.getElementById("textInput");
  const input = $event.target as HTMLInputElement;

  if (!input.files || !input.files[0]) return;

  if (!textArea) return;

  const file = input.files[0];
  const reader = new FileReader();
  
  reader.onload = () => {
    const text = reader.result as string;
    textArea.innerHTML = text;
  };

  reader.readAsText(file);
}
