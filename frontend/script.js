const API = "https://file-hosting-backend.onrender.com/api";

// ================= REGISTER =================
async function register() {
    const username = document.getElementById("username")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const message = document.getElementById("message");

    if (message) message.innerText = "";

    if (!username || !email || !password) {
        if (message) message.innerText = "Please fill all fields";
        return;
    }

    try {
        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Registered successfully");
            window.location.href = "login.html";
        } else {
            if (message) message.innerText = data.msg || "Registration failed";
        }
    } catch (err) {
        console.error("Register error:", err);
        if (message) message.innerText = "Registration request failed";
    }
}

// ================= LOGIN =================
async function login() {
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const message = document.getElementById("message");

    if (message) message.innerText = "";

    if (!email || !password) {
        if (message) message.innerText = "Please fill all fields";
        return;
    }

    try {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            alert("Login successful");
            window.location.href = "upload.html";
        } else {
            if (message) message.innerText = data.msg || "Login failed";
        }
    } catch (err) {
        console.error("Login error:", err);
        if (message) message.innerText = "Login request failed";
    }
}

// ================= UPLOAD =================
async function uploadFile() {
    const file = document.getElementById("file")?.files[0];
    const message = document.getElementById("message");
    const token = localStorage.getItem("token");

    if (message) message.innerText = "";

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    if (!file) {
        if (message) message.innerText = "Please select a file";
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`${API}/upload`, {
            method: "POST",
            headers: {
                "Authorization": token
            },
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            if (message) message.innerText = "File uploaded successfully";
            alert("File uploaded successfully");
            document.getElementById("file").value = "";
        } else {
            if (message) message.innerText = data.msg || "Upload failed";
        }
    } catch (err) {
        console.error("Upload error:", err);
        if (message) message.innerText = "Upload failed";
    }
}

// ================= LOAD ALL FILES =================
async function loadFiles() {
    const token = localStorage.getItem("token");
    const list = document.getElementById("fileList");
    const message = document.getElementById("message");

    if (!list) return;

    list.innerHTML = "";
    if (message) message.innerText = "";

    if (!token) {
        if (message) message.innerText = "Please login first";
        return;
    }

    try {
        const res = await fetch(`${API}/public-files`, {
            headers: {
                "Authorization": token
            }
        });

        const files = await res.json();

        if (!res.ok) {
            if (message) message.innerText = files.msg || "Could not load files";
            return;
        }

        if (files.length === 0) {
            list.innerHTML = `<div class="empty-state">No files available right now.</div>`;
            return;
        }

        files.forEach(file => {
            const safePath = file.path.replace(/\\/g, "/");
            const owner = file.uploaded_by?.email || "Unknown";

            const card = document.createElement("div");
            card.className = "file-card";
            card.innerHTML = `
                <div class="file-info">
                    <h3>${file.filename}</h3>
                    <p><strong>Owner:</strong> ${owner}</p>
                    <p><strong>Size:</strong> ${file.size} bytes</p>
                    <p><strong>Uploaded:</strong> ${new Date(file.uploaded_at).toLocaleString()}</p>
                </div>
                <div class="file-actions">
                    <a href="https://file-hosting-backend.onrender.com/${safePath}" target="_blank">Download</a>
                </div>
            `;
            list.appendChild(card);
        });

    } catch (err) {
        console.error("Load files error:", err);
        if (message) message.innerText = "Error loading files";
    }
}

// ================= LOAD MY FILES =================
async function loadMyFiles() {
    const token = localStorage.getItem("token");
    const list = document.getElementById("myFileList");
    const message = document.getElementById("message");

    if (!list) return;

    list.innerHTML = "";
    if (message) message.innerText = "";

    if (!token) {
        if (message) message.innerText = "Please login first";
        return;
    }

    try {
        const res = await fetch(`${API}/my-files`, {
            headers: {
                "Authorization": token
            }
        });

        const files = await res.json();

        if (!res.ok) {
            if (message) message.innerText = files.msg || "Could not load your files";
            return;
        }

        if (files.length === 0) {
            list.innerHTML = `<div class="empty-state">You have not uploaded any files yet.</div>`;
            return;
        }

        files.forEach(file => {
            const card = document.createElement("div");
            card.className = "file-card";
            card.innerHTML = `
                <div class="file-info">
                    <h3>${file.filename}</h3>
                    <p><strong>Size:</strong> ${file.size} bytes</p>
                    <p><strong>Uploaded:</strong> ${new Date(file.uploaded_at).toLocaleString()}</p>
                </div>
                <div class="file-actions">
                    <button class="danger-btn" onclick="deleteFile('${file._id}')">Delete</button>
                </div>
            `;
            list.appendChild(card);
        });

    } catch (err) {
        console.error("Load my files error:", err);
        if (message) message.innerText = "Error loading your files";
    }
}

// ================= DELETE FILE =================
async function deleteFile(id) {
    const token = localStorage.getItem("token");
    const message = document.getElementById("message");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
        const res = await fetch(`${API}/files/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        const data = await res.json();

        if (res.ok) {
            if (message) message.innerText = "File deleted successfully";
            loadMyFiles();
        } else {
            if (message) message.innerText = data.msg || "Delete failed";
        }
    } catch (err) {
        console.error("Delete error:", err);
        if (message) message.innerText = "Delete failed";
    }
}

// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    window.location.href = "login.html";
}