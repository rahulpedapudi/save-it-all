document.getElementById("submit-btn").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length > 0) {
      const activeTab = tabs[0];
      const tabId = activeTab.id;
      const tabUrl = activeTab.url;
      const tabTitle = activeTab.title;

      tabData = {
        id: tabId,
        url: tabUrl,
        title: tabTitle,
      };

      fetch("http://localhost:5000/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tabData),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("✅ Data saved:", result);
          document.getElementById("response").innerHTML =
            JSON.stringify(result);
        })
        .catch((error) => {
          console.error("❌ Error saving data:", error);
          document.getElementById("response").innerHTML = error.message;
        });
    }
  });
});
