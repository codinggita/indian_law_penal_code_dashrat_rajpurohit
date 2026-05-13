# 🏛️ Indian Law Penal Code — Full Stack MERN Project

### CodingGita × Swaminarayan University | Semester 2 | 80 Marks Assignment
**Student:** Dashrat Rajpurohit  
**Duration:** 13 May – 13 June 2026  
**Stack:** MERN (MongoDB + Express + React + Node.js)

---

## 📋 Project Overview

A comprehensive **full-stack admin and user dashboard** for the **Indian Penal Code (IPC) legal database**.

This system allows:
- **Admin** to manage all legal records (Create, Read, Update, Delete)
- **Users** to search, filter, and bookmark laws
- **Analytics Dashboard** showcasing the distribution of laws by category, state, and court
- **Authentication** via JWT with role-based access control (Admin / User)

**Dataset Overview:** The core data involves Indian Penal Code sections. Each record provides intricate details like section number, title, act name, bailable status, cognizable status, state applicability, and court jurisdiction.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS + MUI |
| **State Management** | Redux Toolkit |
| **Routing** | React Router v6 |
| **Forms** | Formik + Yup |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (jsonwebtoken + bcrypt) |
| **API Testing** | Postman |

---

## 🚀 Key Features

1. **Robust Authentication**: Secure JWT-based login/registration with role authorization (Admin vs User).
2. **Advanced Search & Filtering**: 
   - Full-text MongoDB `$regex` search across titles and descriptions.
   - Filter by Act, Category, State, and Boolean properties (e.g., bailable).
3. **Admin Controls**: Manage users (ban/unban, change roles) and access system logs.
4. **Interactive Analytics**: MongoDB aggregation pipelines visualized using Recharts on the frontend (pie charts, line graphs, bar charts).
5. **Modern Dashboard UI**: Built with React and styled via Tailwind CSS, offering a responsive sidebar, data tables, and a dark/light mode toggle.

---

## 📁 Folder Structure (Overview)

```
indian_law_penal_code_dashrat_rajpurohit/
├── backend/          # Express + Node.js APIs
│   └── src/
│       ├── config/       # Database connection
│       ├── controllers/  # Route logic
│       ├── middlewares/  # Auth, rate limiting, error handlers
│       ├── models/       # Mongoose schemas
│       ├── routes/       # Express routes
│       └── scripts/      # Database seeding scripts
└── frontend/         # React + Vite application
    ├── src/
    │   ├── components/ # UI components (Sidebar, Navbar, etc.)
    │   ├── pages/      # Route pages (Login, Dashboard, Analytics, etc.)
    │   ├── services/   # Axios API integrations
    │   └── store/      # Redux Toolkit state
```

---

## 📡 API Reference Snapshot

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| **GET** | `/api/v1/laws` | Fetch all laws with pagination | No |
| **GET** | `/api/v1/search/laws?q=X` | Search laws by query | No |
| **POST** | `/api/v1/laws` | Create a new law record | Admin |
| **POST** | `/api/v1/auth/login` | Authenticate user | No |
| **GET** | `/api/v1/analytics/laws/by-category` | Get aggregation data | No |

---

*Developed as part of the CodingGita Semester 2 MERN Stack curriculum.*