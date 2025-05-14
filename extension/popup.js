document
  .getElementById("submit-btn")
  .addEventListener("click", async (event) => {
    const data = { message: document.getElementById("input").value };

    try {
      const res = await fetch("http://localhost:5000/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      document.getElementById("response").innerText =
        "✅ " + JSON.stringify(result);
    } catch (error) {
      document.getElementById("response").innerText = "Failed " + error.message;
    }
  });
