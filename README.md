# Secure File Hosting Web Application

## Project Overview
This is a full-stack web application that allows users to securely upload and manage files.

Users can:
- Register and login
- Upload files (PDF and MP4 only)
- View all uploaded files
- View their own files
- Delete only their own files

---

## Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Authentication: JWT (JSON Web Token)
- File Upload: Multer

---

## Features
- User registration with unique email
- Secure login with JWT authentication
- Password hashing using bcrypt
- File upload (PDF & MP4 only)
- File size limit: 20MB
- Public downloads page (all users)
- My Files page (only user’s files)
- Delete access control (only owner can delete)
- MongoDB cloud database integration

---

## Folder Structure

secure-file-hosting/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
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

---

## API Endpoints

### Authentication
- POST /api/register → Register new user
- POST /api/login → Login user

### File APIs
- POST /api/upload → Upload file
- GET /api/public-files → Get all files
- GET /api/my-files → Get user files
- DELETE /api/files/:id → Delete file

---

## Deployment Links

Frontend:
https://taupe-piroshki-628926.netlify.app/register.html

Backend:
https://file-hosting-backend.onrender.com

---

## How to Run Locally

1. Clone repository:
git clone https://github.com/dharamavaiya0207-hash/secure-file-hosting.git

2. Go to backend:
cd backend

3. Install dependencies:
npm install

4. Create .env file:
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=secret123

5. Run backend:
node server.js

6. Open frontend:
Open register.html in browser

---

## Demo Flow

1. Register user
2. Login
3. Upload file
4. Open Downloads page
5. Register second user
6. Login second user
7. Show first user's file
8. Upload second file
9. Show both files
10. Delete file
11. Show updated list

---

## Author
Priya Avaiya