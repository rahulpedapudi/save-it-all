console.log("SaveIt content script injected!");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_SELECTED_TEXT") {
    let selectedText = "";

    try {
      const activeElement = document.activeElement;

      // 1. Try shadow DOM
      const shadowRoot = activeElement?.shadowRoot;
      if (shadowRoot) {
        selectedText = shadowRoot.getSelection?.()?.toString() || "";
      }

      // 2. If nothing selected from shadowRoot, try iframe
      if (!selectedText && activeElement?.tagName === "IFRAME") {
        try {
          const iframeDoc = activeElement.contentWindow?.document;
          selectedText = iframeDoc?.getSelection()?.toString() || "";
        } catch (err) {
          console.warn(
            "Could not access iframe due to cross-origin restrictions."
          );
        }
      }

      // 3. If still nothing, fall back to top-level window selection
      if (!selectedText) {
        selectedText = window.getSelection().toString();
      }
    } catch (error) {
      console.error("Error retrieving selected text:", error);
      selectedText = "";
    }

    sendResponse({ text: selectedText });
  }

  return true; // Keeps message port open for async response
});
