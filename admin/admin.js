// admin/admin.js

document.addEventListener("DOMContentLoaded", () => {
  // Check which page we're on
  if (document.getElementById("login-form")) {
    setupLoginPage();
  }
  
  if (document.getElementById("messages-container")) {
    setupDashboardPage();
  }
});

// --- LOGIN PAGE LOGIC ---
function setupLoginPage() {
  const loginForm = document.getElementById("login-form");
  const loginStatus = document.getElementById("login-status");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Login failed");
      }

      // !! SUCCESS !!
      // 1. Save the token
      localStorage.setItem('token', data.token);

      // 2. Redirect to the dashboard
      window.location.href = '/admin/dashboard.html';

    } catch (err) {
      loginStatus.textContent = err.message;
      loginStatus.style.color = "red";
    }
  });
}

// --- DASHBOARD PAGE LOGIC ---
function setupDashboardPage() {
  // Add logout functionality
  document.getElementById("logout-button").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login.html";
  });

  // Fetch protected data
  fetchAdminMessages();
  
  // Handle the "Create Update" form
  setupUpdateForm();
}

async function fetchAdminMessages() {
  const container = document.getElementById("messages-container");
  container.innerHTML = "<p>Loading messages...</p>";
  
  const token = localStorage.getItem("token"); // We know this exists because of the guard

  try {
    const response = await fetch('http://localhost:5000/api/admin/messages', {
      method: 'GET',
      headers: {
        'x-auth-token': token // <-- This is the protected header!
      }
    });

    if (!response.ok) {
      // This happens if the token is expired or invalid
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin/login.html";
      }
      throw new Error("Failed to fetch messages");
    }

    const messages = await response.json();
    container.innerHTML = ""; // Clear loading

    if (messages.length === 0) {
      container.innerHTML = "<p>No messages.</p>";
      return;
    }

    messages.forEach(msg => {
      const el = document.createElement("div");
      el.className = "message-card";
      el.innerHTML = `
        <p><strong>From:</strong> ${msg.name} (${msg.email})</p>
        <p><strong>Subject:</strong> ${msg.subject}</p>
        <p>${msg.message}</p>
        <small>${new Date(msg.createdAt).toLocaleString()}</small>
      `;
      container.appendChild(el);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading messages.</p>";
  }
}

function setupUpdateForm() {
    const updateForm = document.getElementById("update-form");
    const updateStatus = document.getElementById("update-status");

    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const token = localStorage.getItem("token");

        try {
            updateStatus.textContent = "Posting...";
            
            const response = await fetch('http://localhost:5000/api/admin/updates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // <-- Send the token!
                },
                body: JSON.stringify({ title, content })
            });

            if (!response.ok) {
                throw new Error("Failed to post update.");
            }

            updateStatus.textContent = "Update posted successfully!";
            updateStatus.style.color = "green";
            updateForm.reset();

        } catch (err) {
            updateStatus.textContent = err.message;
            updateStatus.style.color = "red";
        }
    });
}