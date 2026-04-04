const API = "https://file-hosting-backend.onrender.com/api";

// ================= REGISTER =================
async function register() {
    const username = document.getElementById("username")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const message = document.getElementById("message");

    try {
            console.log("API:", API);
            const res = await fetch(`${API}/register`,
                 {
                method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Registered Successfully");
            window.location.href = "login.html";
        } else {
            if (message) message.innerText = data.msg || "Registration failed";
        }
    } catch (err) {
        console.error("Register error:", err);
        if (message) message.innerText = "Error in registration";
        alert("Registration request failed");
    }
}

// ================= LOGIN =================
async function login() {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const message = document.getElementById("message");

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
            alert("Login Successful");
            window.location.href = "upload.html";
        } else {
            if (message) message.innerText = data.msg || "Login failed";
        }
    } catch (err) {
        console.error("Login error:", err);
        if (message) message.innerText = "Error in login";
        alert("Login request failed");
    }
}

// ================= UPLOAD =================
async function uploadFile() {
    const file = document.getElementById("file")?.files[0];
    const message = document.getElementById("message");

    if (!file) {
        alert("Select file");
        return;
    }

    const token = localStorage.getItem("token");

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
            alert("Uploaded");
        } else {
            if (message) message.innerText = data.msg || "Upload failed";
        }
    } catch (err) {
        console.error("Upload error:", err);
        if (message) message.innerText = "Upload failed";
    }
}

// ================= ALL FILES =================
async function loadFiles() {
    const token = localStorage.getItem("token");
    const list = document.getElementById("fileList");

    try {
        const res = await fetch(`${API}/public-files`, {
            headers: {
                "Authorization": token
            }
        });

        const files = await res.json();
        if (list) list.innerHTML = "";

        files.forEach(file => {
            const li = document.createElement("li");
            li.innerHTML = `
                <b>${file.filename}</b><br>
                ${file.uploaded_by?.email || "Unknown"}<br>
                <a href="https://file-hosting-backend.onrender.com/${file.path.replaceAll("\\\\", "/")}" target="_blank">Download</a>
                <hr>
            `;
            list?.appendChild(li);
        });
    } catch (err) {
        console.error("Load files error:", err);
        alert("Error loading files");
    }
}

// ================= MY FILES =================
async function loadMyFiles() {
    const token = localStorage.getItem("token");
    const list = document.getElementById("myFileList");

    try {
        const res = await fetch(`${API}/my-files`, {
            headers: {
                "Authorization": token
            }
        });

        const files = await res.json();
        if (list) list.innerHTML = "";

        files.forEach(file => {
            const li = document.createElement("li");
            li.innerHTML = `
                <b>${file.filename}</b><br>
                <button onclick="deleteFile('${file._id}')">Delete</button>
                <hr>
            `;
            list?.appendChild(li);
        });
    } catch (err) {
        console.error("Load my files error:", err);
        alert("Error loading my files");
    }
}

// ================= DELETE =================
async function deleteFile(id) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API}/files/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        if (res.ok) {
            alert("Deleted");
            loadMyFiles();
        } else {
            alert("Delete failed");
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Delete failed");
    }
}