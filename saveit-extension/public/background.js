chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_JWT" && message.token) {
    chrome.storage.local.set({ jwt: message.token }, () => {
      console.log("✅ JWT stored successfully in extension");
      sendResponse({ status: "success" });
    });
    return true; // Required for async sendResponse
  }
  if (message.type === "CLEAR_JWT") {
    chrome.storage.local.remove("jwt", () => {
      console.log("JWT cleared");
      sendResponse({ status: "cleared" });
    });
    return true;
  }
});
