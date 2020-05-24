export const CopyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  textArea.id = "temp-textarea";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Unable to copy text to clipboard.", err);
  }

  document.getElementById("temp-textarea").remove();
};
