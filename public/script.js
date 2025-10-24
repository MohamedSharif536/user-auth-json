const API_URL = "/api/auth"; // Base API URL

// ======================
// REGISTER
// ======================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      const msg = document.getElementById("registerMsg");
      msg.innerText = data.message;

      if (res.ok) {
        msg.style.color = "green";
        registerForm.reset();
        setTimeout(() => window.location = "login.html", 1500);
      } else {
        msg.style.color = "red";
      }
    } catch (err) {
      console.error(err);
    }
  });
}

// ======================
// LOGIN
// ======================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      const msg = document.getElementById("loginMsg");

      if (res.ok) {
        localStorage.setItem("token", data.token);
        msg.style.color = "green";
        msg.innerText = "Login successful!";
        setTimeout(() => window.location = "profile.html", 1000);
      } else {
        msg.style.color = "red";
        msg.innerText = data.message;
      }
    } catch (err) {
      console.error(err);
    }
  });
}

// ======================
// PROFILE & LOGOUT
// ======================
if (document.getElementById("userName")) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location = "index.html";
  } else {
    fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          document.getElementById("userName").innerText = data.user.name;
          document.getElementById("userEmail").innerText = data.user.email;
          document.getElementById("userCreatedAt").innerText = new Date(data.user.createdAt).toLocaleString();
        } else {
          alert(data.message);
          localStorage.removeItem("token");
          window.location = "index.html";
        }
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem("token");
        window.location = "index.html";
      });
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location = "index.html";
  });

  // ======================
  // CHANGE PASSWORD
  // ======================
  document.getElementById("changePasswordBtn").addEventListener("click", async () => {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!oldPassword || !newPassword) {
      document.getElementById("passwordMsg").innerText = "Please fill all fields";
      document.getElementById("passwordMsg").style.color = "red";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();
      const msgEl = document.getElementById("passwordMsg");
      msgEl.innerText = data.message;
      msgEl.style.color = res.ok ? "green" : "red";

      if (res.ok) {
        document.getElementById("oldPassword").value = "";
        document.getElementById("newPassword").value = "";
      }
    } catch (err) {
      console.error(err);
    }
  });
}
