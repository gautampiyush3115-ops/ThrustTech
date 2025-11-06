// assets/js/main.js

document.addEventListener("DOMContentLoaded", () => {
  fetchUpdates();
});

async function fetchUpdates() {
  const updatesContainer = document.getElementById("updates-container");
  updatesContainer.innerHTML = "<p>Loading updates...</p>";

  try {
    const response = await fetch('http://localhost:5000/api/updates');
    if (!response.ok) {
      throw new Error("Failed to fetch updates.");
    }

    const updates = await response.json();

    // Clear the "loading" message
    updatesContainer.innerHTML = ""; 

    if (updates.length === 0) {
      updatesContainer.innerHTML = "<p>No updates at this time.</p>";
      return;
    }

    // 3. Loop through the updates and create HTML
    updates.forEach(update => {
      const updateElement = document.createElement("article");
      updateElement.className = "update-post"; // Add a class for styling

      const title = document.createElement("h3");
      title.textContent = update.title;

      const content = document.createElement("p");
      content.textContent = update.content;

      const date = document.createElement("small");
      date.textContent = `Posted on: ${new Date(update.createdAt).toLocaleDateString()}`;

      updateElement.appendChild(title);
      updateElement.appendChild(content);
      updateElement.appendChild(date);

      updatesContainer.appendChild(updateElement);
    });

  } catch (err) {
    console.error("Error fetching updates:", err);
    updatesContainer.innerHTML = "<p>Error loading updates.</p>";
  }
}