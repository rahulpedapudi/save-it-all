console.log("SaveIt content script injected!");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_SELECTED_TEXT") {
    const shadowRoot = document.activeElement.shadowRoot;
    const selectedText = shadowRoot.getSelection().toString();
    sendResponse({ text: selectedText });
  }
  return true;
});
