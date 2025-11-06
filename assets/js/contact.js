// assets/js/contact.js

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const statusMessage = document.getElementById("status-message");

  contactForm.addEventListener("submit", async (event) => {
    // 1. PREVENT the browser from reloading the page
    event.preventDefault();

    // 2. Get the data from the form
    // Make sure your <input> elements have 'name' attributes
    // (e.g., <input name="name">, <input name="email">)
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // 3. Send the data to your backend
    try {
      statusMessage.textContent = "Sending...";
      statusMessage.style.color = "black";

      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // Success!
        statusMessage.textContent = result.msg; // "Message received!..."
        statusMessage.style.color = "green";
        contactForm.reset(); // Clear the form
      } else {
        // Error from server (e.g., 500)
        statusMessage.textContent = "Error: Could not send message.";
        statusMessage.style.color = "red";
      }
    } catch (err) {
      // Network error
      console.error("Submit error:", err);
      statusMessage.textContent = "Error: Could not send message.";
      statusMessage.style.color = "red";
    }
  });
});