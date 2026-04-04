const API = "https://file-hosting-backend.onrender.com/api";
// ================= REGISTER =================
async function register() {
    const username = document.getElementById("username")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    try {
        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        if (res.ok) {
            alert("Registered Successfully");
            window.location.href = "login.html";
        }
    } catch {
        alert("Error in registration");
    }
}

// ================= LOGIN =================
async function login() {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

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
        }
    } catch {
        alert("Error in login");
    }
}

// ================= UPLOAD =================
async function uploadFile() {
    const file = document.getElementById("file").files[0];

    if (!file) return alert("Select file");

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: {
            "Authorization": token
        },
        body: formData
    });

    if (res.ok) alert("Uploaded");
}

// ================= ALL FILES =================
async function loadFiles() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/public-files`, {
        headers: {
            "Authorization": token
        }
    });

    const files = await res.json();

    const list = document.getElementById("fileList");
    list.innerHTML = "";

    files.forEach(file => {
        const li = document.createElement("li");

        li.innerHTML = `
            <b>${file.filename}</b><br>
            ${file.uploaded_by.email}<br>
            <a href="http://localhost:5000/${file.path}" target="_blank">Download</a>
            <hr>
        `;

        list.appendChild(li);
    });
}

// ================= MY FILES =================
async function loadMyFiles() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/my-files`, {
        headers: {
            "Authorization": token
        }
    });

    const files = await res.json();

    const list = document.getElementById("myFileList");
    list.innerHTML = "";

    files.forEach(file => {
        const li = document.createElement("li");

        li.innerHTML = `
            <b>${file.filename}</b><br>
            <button onclick="deleteFile('${file._id}')">Delete</button>
            <hr>
        `;

        list.appendChild(li);
    });
}

// ================= DELETE =================
async function deleteFile(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/files/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    });

    if (res.ok) {
        alert("Deleted");
        loadMyFiles();
    }
}