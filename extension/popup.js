let currentTab = null;

document.getElementById("close-btn").addEventListener("click", () => {
  window.close();
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    currentTab = tab;

    document.getElementById("url-display").textContent = tab.url;
    document.getElementById("title-display").textContent = tab.title;
  } catch (error) {
    console.error("Failed to get tab: ", error);
  }
});

document.getElementById("primary-btn").addEventListener("click", async () => {
  if (!currentTab) return;

  const payload = {
    id: currentTab.id,
    title: currentTab.title,
    url: currentTab.url,
    // Add additional data like tags, notes, etc.
  };

  try {
    const res = fetch("http://localhost:5000/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    console.log("Saved!", json);
    if (res.ok) {
      // Redirect to success.html
      window.location.href = "success.html";
    } else {
      console.error("Save failed.");
    }
  } catch (error) {
    console.error("Failed to Save: ", error);
  }
});
