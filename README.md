# 🗳️ Online Voting System

A secure and modern **Online Voting System** built using **React.js, Node.js, Express.js, and MySQL**. The system provides role-based authentication, election management, candidate management, secure voting, and real-time election results.

> **Slogan:** *One Person • One Vote*

---

## 📌 Features

### 👤 Authentication
- User Registration
- User Login
- JWT Authentication
- Password Encryption (bcrypt)
- Role-Based Access Control (Admin / Voter)
- Profile Management
- Change Password
- Secure Logout

### 🗳️ Election Management (Admin)
- Create Elections
- Update Elections
- Delete Elections
- Manage Election Status

### 👥 Candidate Management (Admin)
- Add Candidates
- Edit Candidate Details
- Remove Candidates
- Assign Candidates to Elections

### 🗳️ Voting Module
- View Active Elections
- View Candidate List
- Cast Vote
- One Person One Vote Validation
- Prevent Duplicate Voting

### 📊 Dashboard
- Total Elections
- Total Registered Voters
- Total Votes
- Live Election Results
- Winner Announcement
- Voting Statistics

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- React Toastify
- CSS3

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Multer

## Database
- MySQL

## Tools
- Git
- GitHub
- Postman
- MySQL Workbench
- VS Code

---

# 📂 Project Structure

```
online-voting-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── database/
```

---

# 👨‍💻 Team Responsibilities

### Member 1 (Natrajan MD)– Authentication & User Management
- Registration
- Login
- JWT Authentication
- Profile
- Change Password
- Role Management
- Protected Routes

### Member 2 (Dhayanidhi)– Election & Candidate Management
- Election CRUD
- Candidate CRUD
- Election Status

### Member 3 (Revaan JR)– Voting Module
- Candidate List
- Vote Casting
- One Person One Vote Validation
- Duplicate Vote Prevention

### Member 4 (Shyaam Sundar)– Dashboard & Results
- Dashboard
- Live Results
- Statistics
- Reports

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/online-voting-system.git
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=online_voting_system

JWT_SECRET=your_secret_key
```

---

# 🗄️ Database

Create a database:

```sql
CREATE DATABASE online_voting_system;
```

Import the SQL tables.

---

# 🔑 Authentication Flow

```
User
   │
   ▼
Login
   │
   ▼
JWT Token
   │
   ▼
Protected Routes
   │
   ▼
Admin / Voter Dashboard
```

---

# 📡 REST APIs

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get Profile |
| PUT | /api/auth/profile | Update Profile |
| PUT | /api/auth/change-password | Change Password |
| POST | /api/auth/logout | Logout |

---

## Elections

| Method | Endpoint |
|---------|----------|
| GET | /api/elections |
| POST | /api/elections |
| PUT | /api/elections/:id |
| DELETE | /api/elections/:id |

---

## Candidates

| Method | Endpoint |
|---------|----------|
| GET | /api/candidates |
| POST | /api/candidates |
| PUT | /api/candidates/:id |
| DELETE | /api/candidates/:id |

---

## Voting

| Method | Endpoint |
|---------|----------|
| GET | /api/votes |
| POST | /api/votes |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | /api/dashboard |
| GET | /api/results |

---

# 🔒 Security Features

- JWT Authentication
- Password Encryption (bcrypt)
- Role-Based Authorization
- Protected Routes
- One Person One Vote Validation
- Duplicate Vote Prevention

---

# 🚀 Future Enhancements

- Email Verification
- OTP Authentication
- Face Recognition
- Aadhaar Verification
- PDF Result Export
- Real-Time Notifications
- Blockchain-Based Voting

---

# 📸 Screenshots

> Add screenshots of:
- Login Page
- Registration Page
- Dashboard
- Election Management
- Voting Page
- Results Dashboard

---

# 📄 License

This project is developed for educational and academic purposes.

---

# 👨‍💻 Developed By

**Team Project – Online Voting System**

**Tech Stack:** React.js • Node.js • Express.js • MySQL

🗳️ **One Person • One Vote**
