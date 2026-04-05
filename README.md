# 🔐 Secure File Hosting System

A full-stack cloud-based web application that allows users to securely upload, store, download, and manage files with authentication and authorization.

---

## 🚀 Live Demo

* 🌐 **Frontend:** https://spectacular-gaufre-1f5cbf.netlify.app
* ⚙️ **Backend:**  https://file-hosting-backend.onrender.com
GitHub:
https://github.com/dharamavaiya0207-hash/secure-file-hosting


---

## 📌 Features

### 👤 User Authentication

* User Registration (username, email, password)
* Secure Login using JWT (JSON Web Tokens)
* Password hashing using bcrypt

### 📁 File Management

* Upload files (PDF & MP4 only)
* View all uploaded files (public files)
* View only your uploaded files
* Delete only your own files (authorization protected)

### 🔐 Security

* JWT-based authentication
* Protected routes (only logged-in users)
* Users cannot delete files uploaded by others

### ☁️ Cloud Deployment

* Backend deployed on **Render**
* Frontend deployed on **Netlify**
* Database hosted on **MongoDB Atlas**

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3 (Modern UI with responsive design)
* JavaScript (Vanilla JS)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose ODM)

### Tools & Services

* MongoDB Atlas (Cloud Database)
* Render (Backend Hosting)
* Netlify (Frontend Hosting)
* GitHub (Version Control)

---

## 📂 Project Structure

```
secure-file-hosting/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── uploads/
│
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── upload.html
│   ├── downloads.html
│   ├── my-files.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

## ⚙️ Setup Instructions (Local)

### 1. Clone Repository

```
git clone https://github.com/dharamavaiya0207-hash/secure-file-hosting.git
cd secure-file-hosting
```

---

### 2. Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret_key
PORT=5000
```

Run server:

```
node server.js
```

---

### 3. Frontend Setup

Simply open:

```
frontend/index.html
```

---

## 🔗 API Endpoints

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| POST   | /api/register     | Register user  |
| POST   | /api/login        | Login user     |
| POST   | /api/upload       | Upload file    |
| GET    | /api/public-files | Get all files  |
| GET    | /api/my-files     | Get user files |
| DELETE | /api/files/:id    | Delete file    |

---

## 🧠 How It Works

1. User registers and logs in
2. Server generates JWT token
3. Token is stored in browser (localStorage)
4. User uploads file → stored in server + MongoDB
5. Files can be viewed/downloaded
6. Only owner can delete their files

---

## 🎯 Key Highlights

* Full-stack application (Frontend + Backend)
* Secure authentication system
* Real-time cloud deployment
* Clean and responsive UI
* Role-based access control

---

## ⚠️ Limitations

* Files stored on server (temporary storage in free hosting)
* No file preview (only download)
* Basic UI (can be enhanced further)

---

## 🔮 Future Improvements

* File preview (PDF viewer, video player)
* Drag & drop upload
* File sharing via links
* User profile system
* Storage optimization using AWS S3 / Cloudinary

---

## 👨‍💻 Author

**Priya Avaiya**



