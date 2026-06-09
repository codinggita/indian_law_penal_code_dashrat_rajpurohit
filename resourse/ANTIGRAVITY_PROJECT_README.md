# 🏛️ Indian Law Penal Code — Full Stack MERN Project
### CodingGita × Swaminarayan University | Semester  2| 80 Marks Assignment
**Student:** Dashrat Rajpurohit | **Duration:** 13 May – 13 June 2026 | **Stack:** MERN (MongoDB + Express + React + Node.js)

---

## 📋 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [30-Day Roadmap](#30-day-roadmap)
4. [Dataset Understanding](#dataset-understanding)
5. [MongoDB Schema Design](#mongodb-schema-design)
6. [Backend — Complete Build Guide](#backend-complete-build-guide)
7. [Frontend — Complete Build Guide](#frontend-complete-build-guide)
8. [API Reference](#api-reference)
9. [Folder Structure](#folder-structure)
10. [Environment Variables](#environment-variables)
11. [Where Marks Are Hidden](#where-marks-are-hidden)
12. [AntiGravity Step-by-Step Commands](#antigravity-step-by-step-commands)

---

## 🎯 Project Overview

Build a **full-stack admin + user dashboard** for the **Indian Penal Code (IPC) legal database**.

The system allows:
- Admin to manage all legal records (CRUD)
- Users to search, filter, bookmark laws
- Analytics dashboard showing law distribution by category, state, court
- JWT-based authentication with role-based access (Admin / User)

**Dataset:** Indian Penal Code sections — each document contains: section number, title, description, act name, chapter, punishment type, bailable status, cognizable status, state applicability, court jurisdiction.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + MUI |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| Forms | Formik + Yup |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken + bcrypt) |
| API Testing | Postman |
| Version Control | Git + GitHub |

---

## 📅 30-Day Roadmap

### ⚙️ PHASE 1: BACKEND (13 May – 28 May 2026) — 15 Days

---

#### 🗓️ Day 1 — Dataset Understanding + Project Setup
**Goal:** Understand the data, initialize the project.

Tasks:
- [ ] Download dataset from Google Drive link in `01_Indian_law_penal_code.md`
- [ ] Open the JSON file, read ALL fields carefully
- [ ] List every field name and its data type on paper
- [ ] Identify: what are the collections? (laws, users)
- [ ] Initialize Node.js project: `npm init -y`
- [ ] Install core packages:
  ```
  npm install express mongoose dotenv cors jsonwebtoken bcryptjs express-rate-limit
  npm install --save-dev nodemon
  ```
- [ ] Create `.env` file with PORT, MONGO_URI, JWT_SECRET
- [ ] Create `server.js` with basic Express server
- [ ] Test server runs on `http://localhost:5000`

**Commit message:** `feat: initialize backend project with Express and MongoDB connection`

---

#### 🗓️ Day 2 — MongoDB Schema Design
**Goal:** Design the Mongoose schemas before writing any API.

Tasks:
- [ ] Create `models/Law.js` — full schema (see schema section below)
- [ ] Create `models/User.js` — authentication schema
- [ ] Add field validations: required, type, enum, min/max
- [ ] Add indexes on: `sectionNumber`, `category`, `actName`, `state`
- [ ] Add `timestamps: true` to all schemas
- [ ] Add `views`, `bookmarkCount`, `importance`, `isArchived` fields to Law schema
- [ ] Test schema by inserting 1 sample document in MongoDB Compass

**Commit message:** `feat: add Law and User mongoose schemas with validations`

---

#### 🗓️ Day 3 — Dataset Seeding + MVC Folder Setup
**Goal:** Load the real dataset into MongoDB + create clean folder structure.

Tasks:
- [ ] Create folder structure (see Folder Structure section below)
- [ ] Create `scripts/seed.js` — reads JSON dataset, inserts all records into MongoDB
- [ ] Run seed script: `node scripts/seed.js`
- [ ] Verify data in MongoDB Compass (count all documents)
- [ ] Create `config/db.js` for MongoDB connection
- [ ] Create `middlewares/errorHandler.js` global error handler

**Commit message:** `feat: seed dataset into MongoDB and setup MVC folder structure`

---

#### 🗓️ Day 4 — Basic CRUD APIs for Laws
**Goal:** Build the 6 core CRUD routes for `/api/v1/laws`.

Tasks:
- [ ] `GET /api/v1/laws` — fetch all with pagination
- [ ] `GET /api/v1/laws/:id` — fetch single law
- [ ] `POST /api/v1/laws` — create new law
- [ ] `PUT /api/v1/laws/:id` — replace full law
- [ ] `PATCH /api/v1/laws/:id` — partial update
- [ ] `DELETE /api/v1/laws/:id` — delete law
- [ ] Test all 6 routes in Postman
- [ ] Add proper 404 / 400 error responses

**Commit message:** `feat: implement basic CRUD APIs for laws collection`

---

#### 🗓️ Day 5 — Pagination + Sorting + Filtering
**Goal:** Add query parameter support for all GET routes.

Tasks:
- [ ] Pagination: `?page=1&limit=10` (create reusable `utils/pagination.js`)
- [ ] Sorting: `?sort=section`, `?sort=-views`, `?sort=createdAt`
- [ ] Filter by: `?act=IPC`, `?category=CyberCrime`, `?state=Delhi`
- [ ] Filter booleans: `?bailable=true`, `?cognizable=false`, `?repealed=false`
- [ ] Filter routes: `/api/v1/laws/filter/act/:actName`
- [ ] Filter routes: `/api/v1/laws/filter/category/:category`
- [ ] Filter routes: `/api/v1/laws/filter/state/:state`
- [ ] Filter routes: `/api/v1/laws/filter/punishment/:type`

**Commit message:** `feat: add pagination, sorting, and filtering to laws API`

---

#### 🗓️ Day 6 — Search API + Advanced Query Routes
**Goal:** Implement full text search and special routes.

Tasks:
- [ ] `GET /api/v1/search/laws?q=murder` — regex search on title + description
- [ ] Search across: title, description, actName, category
- [ ] Case-insensitive search using MongoDB `$regex`
- [ ] `GET /api/v1/laws/recent` — sorted by createdAt desc
- [ ] `GET /api/v1/laws/trending` — sorted by views desc
- [ ] `GET /api/v1/laws/random` — using `$sample` aggregation
- [ ] `GET /api/v1/laws/archived` — where `isArchived: true`
- [ ] `PATCH /api/v1/laws/:id/archive` — set `isArchived: true`
- [ ] `PATCH /api/v1/laws/:id/restore` — set `isArchived: false`

**Commit message:** `feat: add search, recent, trending, random, and archive routes`

---

#### 🗓️ Day 7 — Authentication System (JWT)
**Goal:** Complete login/register with JWT tokens.

Tasks:
- [ ] `POST /api/v1/auth/register` — hash password with bcrypt, save user
- [ ] `POST /api/v1/auth/login` — verify password, return JWT token
- [ ] `POST /api/v1/auth/logout` — clear token on client
- [ ] `GET /api/v1/auth/profile` — protected, return user data
- [ ] `PATCH /api/v1/auth/profile` — update name/email
- [ ] `POST /api/v1/auth/change-password` — verify old, hash new
- [ ] Create `middlewares/auth.js` — JWT verification middleware
- [ ] Create `middlewares/roleCheck.js` — admin/user role guard
- [ ] Test all auth routes in Postman with token

**Commit message:** `feat: implement JWT authentication system with register and login`

---

#### 🗓️ Day 8 — Admin Routes + Role-Based Access
**Goal:** Protect admin routes, implement RBAC.

Tasks:
- [ ] `GET /api/v1/admin/users` — admin only: list all users
- [ ] `GET /api/v1/admin/users/:id` — admin only: user detail
- [ ] `PATCH /api/v1/admin/users/:id/ban` — ban user
- [ ] `PATCH /api/v1/admin/users/:id/unban` — unban user
- [ ] `PATCH /api/v1/admin/users/:id/role` — change role
- [ ] `GET /api/v1/admin/system/health` — server health check
- [ ] `GET /api/v1/admin/system/logs` — basic request logs
- [ ] Apply `auth` + `roleCheck('admin')` middleware to all `/admin` routes
- [ ] Test unauthorized access returns 401

**Commit message:** `feat: add admin routes with role-based access control`

---

#### 🗓️ Day 9 — Aggregation Framework + Analytics Routes
**Goal:** MongoDB aggregation pipelines for analytics.

Tasks:
- [ ] `GET /api/v1/analytics/laws/by-category` — group by category, count each
- [ ] `GET /api/v1/analytics/laws/by-state` — group by state, count each
- [ ] `GET /api/v1/analytics/laws/by-court` — group by courtName
- [ ] `GET /api/v1/analytics/laws/most-viewed` — sort by views desc, limit 10
- [ ] `GET /api/v1/analytics/laws/most-bookmarked` — sort by bookmarkCount
- [ ] `GET /api/v1/analytics/laws/popularity` — combined score (views + bookmarks)
- [ ] `GET /api/v1/analytics/laws/complexity` — group by punishment severity
- [ ] `GET /api/v1/analytics/laws/recent-updates` — updated in last 30 days

**Commit message:** `feat: implement aggregation pipelines for analytics routes`

---

#### 🗓️ Day 10 — Statistics Routes
**Goal:** Count-based stats using aggregation.

Tasks:
- [ ] `GET /api/v1/stats/laws/count` — total law count
- [ ] `GET /api/v1/stats/laws/active` — count where `isArchived: false`
- [ ] `GET /api/v1/stats/laws/repealed` — count repealed laws
- [ ] `GET /api/v1/stats/laws/by-act` — count grouped by actName
- [ ] `GET /api/v1/stats/laws/by-category` — count by category
- [ ] `GET /api/v1/stats/laws/by-state` — count by state
- [ ] `GET /api/v1/stats/laws/by-court` — count by court
- [ ] `GET /api/v1/stats/laws/bookmarks` — total bookmark count
- [ ] Test all stats routes, verify numbers match MongoDB Compass

**Commit message:** `feat: add statistics routes with MongoDB aggregation`

---

#### 🗓️ Day 11 — JWT Routes + Middleware Practice Routes
**Goal:** Implement JWT utility routes and middleware demo routes.

Tasks:
- [ ] `POST /api/v1/jwt/generate-token` — generate token from payload
- [ ] `POST /api/v1/jwt/verify-token` — decode and verify token
- [ ] `POST /api/v1/jwt/refresh-token` — issue new token from valid token
- [ ] `DELETE /api/v1/jwt/revoke-token` — blacklist token
- [ ] `GET /api/v1/jwt/private-laws` — JWT protected laws list
- [ ] `GET /api/v1/jwt/private-analytics` — JWT protected analytics
- [ ] `GET /api/v1/middleware/logger` — request logging demo
- [ ] `GET /api/v1/middleware/rate-limit` — rate limit demo
- [ ] `GET /api/v1/middleware/cors` — CORS demo response

**Commit message:** `feat: add JWT utility routes and middleware demo routes`

---

#### 🗓️ Day 12 — Rate Limiting + Error Handling + Validation
**Goal:** Production-level security and error management.

Tasks:
- [ ] Install: `npm install express-rate-limit`
- [ ] Apply rate limiting to: `/auth/login`, `/auth/register`, `/search/laws`
- [ ] Global error handler: consistent `{ success, message, error }` format
- [ ] 404 handler for all undefined routes
- [ ] Input validation: POST `/api/v1/laws` must have title, sectionNumber, actName
- [ ] Validate ObjectId format before hitting DB
- [ ] Handle empty `?q=` in search routes
- [ ] Handle `?page=-1` invalid pagination

**Commit message:** `feat: add rate limiting, global error handler, and input validation`

---

#### 🗓️ Day 13 — Advanced Routes + History + Summary
**Goal:** Remaining special routes.

Tasks:
- [ ] `GET /api/v1/laws/:id/history` — store and fetch update history (use embedded array)
- [ ] `GET /api/v1/laws/:id/summary` — return only title + sectionNumber + punishment
- [ ] `GET /api/v1/laws/exists/:id` — return `{ exists: true/false }`
- [ ] Combined queries: `?category=Fraud&sort=popularity&page=1&limit=10`
- [ ] HEAD routes: implement for main collection endpoints
- [ ] OPTIONS routes: implement CORS preflight responses
- [ ] Test all combined queries work correctly

**Commit message:** `feat: add history, summary, exists, HEAD and OPTIONS routes`

---

#### 🗓️ Day 14 — OTP + Password Reset + Sessions
**Goal:** Complete auth system.

Tasks:
- [ ] `POST /api/v1/auth/send-otp` — generate 6-digit OTP, store in DB with expiry
- [ ] `POST /api/v1/auth/verify-otp` — match OTP, mark verified
- [ ] `POST /api/v1/auth/forgot-password` — find user by email, send reset link
- [ ] `POST /api/v1/auth/reset-password` — hash new password
- [ ] `POST /api/v1/auth/verify-email` — email verification flow
- [ ] `GET /api/v1/auth/sessions` — list active sessions

**Commit message:** `feat: add OTP, password reset, and email verification flows`

---

#### 🗓️ Day 15 — Postman Documentation + Backend Testing + README
**Goal:** Document everything, test all endpoints.

Tasks:
- [ ] Test EVERY endpoint in Postman (at least once)
- [ ] Create Postman Collection with all routes organized by category
- [ ] Add example request bodies and expected responses in Postman
- [ ] Export Postman collection as JSON (`postman_collection.json`)
- [ ] Write `README_BACKEND.md` with setup instructions
- [ ] Final check: all checklist items from `01_backend_development_checklist.md` ticked
- [ ] Push final backend to GitHub with clean commit history

**Commit message:** `docs: add Postman collection and backend README documentation`

---

### 🎨 PHASE 2: FRONTEND (29 May – 13 June 2026) — 15 Days

---

#### 🗓️ Day 16 — Vite + React Setup + Folder Structure
**Goal:** Initialize frontend project with all tools.

Tasks:
- [ ] `npm create vite@latest frontend -- --template react`
- [ ] Install all packages:
  ```
  npm install axios react-router-dom @reduxjs/toolkit react-redux
  npm install formik yup
  npm install @mui/material @emotion/react @emotion/styled
  npm install react-hot-toast react-helmet-async
  npm install tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Create folder structure (see below)
- [ ] Configure Tailwind CSS
- [ ] Configure MUI theme (light/dark)
- [ ] Setup Axios base URL pointing to backend
- [ ] Create `.env` with `VITE_API_URL=http://localhost:5000/api/v1`

**Commit message:** `feat: initialize React frontend with Vite, Tailwind, MUI, Redux`

---

#### 🗓️ Day 17 — Redux Store + Auth Slice + API Service Layer
**Goal:** State management foundation.

Tasks:
- [ ] Create `store/index.js` — configure Redux store
- [ ] Create `store/slices/authSlice.js` — login state, user, token
- [ ] Create `store/slices/lawsSlice.js` — laws list, current law, pagination
- [ ] Create `store/slices/uiSlice.js` — loading, theme, alerts
- [ ] Create `services/api.js` — Axios instance with interceptors
- [ ] Add request interceptor: attach JWT token to every request
- [ ] Add response interceptor: handle 401 (redirect to login)
- [ ] Test Redux DevTools shows state correctly

**Commit message:** `feat: setup Redux Toolkit store with auth, laws, and UI slices`

---

#### 🗓️ Day 18 — Authentication Pages (Login + Register)
**Goal:** Working login/register with backend integration.

Tasks:
- [ ] Create `pages/LoginPage.jsx` — Formik form, Yup validation
- [ ] Create `pages/RegisterPage.jsx` — Formik form, Yup validation
- [ ] Connect to `POST /api/v1/auth/login` and `/register`
- [ ] Store JWT token in localStorage on success
- [ ] Dispatch to authSlice on login
- [ ] Create `components/ProtectedRoute.jsx` — redirect to login if no token
- [ ] Create `components/PublicRoute.jsx` — redirect to dashboard if already logged in
- [ ] Setup React Router: public routes = login/register, protected = dashboard

**Commit message:** `feat: add login and register pages with JWT auth integration`

---

#### 🗓️ Day 19 — Dashboard Layout + Sidebar + Navbar
**Goal:** Admin dashboard shell.

Tasks:
- [ ] Create `layouts/DashboardLayout.jsx` — sidebar + navbar + main content
- [ ] Create `components/Sidebar.jsx` — navigation links (Laws, Analytics, Users, Settings)
- [ ] Create `components/Navbar.jsx` — user avatar, logout button, theme toggle
- [ ] Implement Light/Dark mode toggle (save to localStorage)
- [ ] Sidebar collapse on mobile (responsive)
- [ ] Create `pages/DashboardHome.jsx` — stats cards (total laws, active, repealed, trending)
- [ ] Fetch stats from `/api/v1/stats/laws/count` etc.

**Commit message:** `feat: add dashboard layout with sidebar, navbar, and stats home`

---

#### 🗓️ Day 20 — Laws Listing Page (Data Table + Pagination)
**Goal:** Main laws table with backend pagination.

Tasks:
- [ ] Create `pages/LawsListPage.jsx`
- [ ] Fetch from `GET /api/v1/laws?page=1&limit=10`
- [ ] MUI DataGrid or custom table component
- [ ] Show columns: Section No., Title, Act, Category, Bailable, Status
- [ ] Pagination: prev/next buttons, page size selector
- [ ] Sorting: click column headers → update sort query
- [ ] Loading skeleton while fetching
- [ ] Empty state UI when no results

**Commit message:** `feat: add laws listing page with pagination and sorting`

---

#### 🗓️ Day 21 — Search + Filter UI
**Goal:** Real-time search and filter connected to backend.

Tasks:
- [ ] Search bar → `GET /api/v1/search/laws?q=<input>`
- [ ] Debounce search input (300ms) to avoid too many API calls
- [ ] Filter dropdowns:
  - Act: IPC, CrPC, Evidence Act, etc.
  - Category: Cybercrime, Fraud, Murder, etc.
  - State: Delhi, Maharashtra, etc.
  - Bailable: Yes/No
  - Status: Active/Archived/Repealed
- [ ] Clear all filters button
- [ ] Show result count: "Showing 45 results for 'murder'"

**Commit message:** `feat: add search bar and filter dropdowns with backend integration`

---

#### 🗓️ Day 22 — Law Detail Page + CRUD Modals
**Goal:** View, create, edit, delete laws.

Tasks:
- [ ] Create `pages/LawDetailPage.jsx` — full law document display
- [ ] Show: section, title, description, punishment, bailable, cognizable, court, state
- [ ] Create modal/form for: Add New Law (`POST /api/v1/laws`)
- [ ] Create modal/form for: Edit Law (`PATCH /api/v1/laws/:id`)
- [ ] Delete button with confirmation dialog → `DELETE /api/v1/laws/:id`
- [ ] Archive/Restore buttons → `PATCH /api/v1/laws/:id/archive`
- [ ] Toast notifications: "Law created successfully", "Law deleted"
- [ ] Real-time UI update after CRUD (re-fetch or update Redux state)

**Commit message:** `feat: add law detail page with CRUD modals and toast notifications`

---

#### 🗓️ Day 23 — Analytics Dashboard (Charts)
**Goal:** Visual analytics from backend aggregation data.

Tasks:
- [ ] Install recharts: `npm install recharts`
- [ ] Create `pages/AnalyticsPage.jsx`
- [ ] Bar chart: Laws by Category → `GET /api/v1/analytics/laws/by-category`
- [ ] Pie chart: Laws by Act → `GET /api/v1/stats/laws/by-act`
- [ ] Line chart: Laws by State → `GET /api/v1/analytics/laws/by-state`
- [ ] Top 10 Most Viewed Laws table → `GET /api/v1/analytics/laws/most-viewed`
- [ ] Top 10 Most Bookmarked → `GET /api/v1/analytics/laws/most-bookmarked`
- [ ] Stats cards: Total, Active, Repealed, Trending

**Commit message:** `feat: add analytics dashboard with recharts bar, pie, and line charts`

---

#### 🗓️ Day 24 — User Management Page (Admin Only)
**Goal:** Admin panel for managing users.

Tasks:
- [ ] Create `pages/admin/UsersPage.jsx` — protected admin route
- [ ] Fetch all users: `GET /api/v1/admin/users`
- [ ] Show: name, email, role, status, createdAt
- [ ] Ban/Unban button → `PATCH /api/v1/admin/users/:id/ban`
- [ ] Change Role dropdown → `PATCH /api/v1/admin/users/:id/role`
- [ ] Role guard: non-admin users see "Access Denied" page
- [ ] System Health card → `GET /api/v1/admin/system/health`

**Commit message:** `feat: add admin user management page with ban/role controls`

---

#### 🗓️ Day 25 — Profile Page + Settings Panel
**Goal:** User profile management.

Tasks:
- [ ] Create `pages/ProfilePage.jsx`
- [ ] Show current user data from `GET /api/v1/auth/profile`
- [ ] Edit form: update name, email → `PATCH /api/v1/auth/profile`
- [ ] Change password form → `POST /api/v1/auth/change-password`
- [ ] Create `pages/SettingsPage.jsx`
- [ ] Theme toggle (light/dark) saved to localStorage
- [ ] Logout button clears token + redirects to login

**Commit message:** `feat: add profile and settings pages with update functionality`

---

#### 🗓️ Day 26 — Error Handling + Loading States + UX Polish
**Goal:** Production-level UX.

Tasks:
- [ ] Global Error Boundary component
- [ ] Skeleton loaders for every API call (MUI Skeleton)
- [ ] Empty state components (custom illustration + message)
- [ ] API error state: "Failed to load. Try again." with retry button
- [ ] All forms: show error messages from Yup + API errors
- [ ] 404 page for invalid routes
- [ ] Loading spinner on route transitions

**Commit message:** `feat: add error boundaries, skeleton loaders, and empty states`

---

#### 🗓️ Day 27 — SEO + Metadata + Performance Optimization
**Goal:** SEO and code quality.

Tasks:
- [ ] Install: `npm install react-helmet-async`
- [ ] Add `<Helmet>` to every page with title + meta description
- [ ] Open Graph tags on key pages
- [ ] Lazy loading: `React.lazy()` + `Suspense` for all page routes
- [ ] `useMemo` for expensive filter calculations
- [ ] `useCallback` for event handlers in loops
- [ ] Code splitting verification in build output

**Commit message:** `feat: add SEO metadata, lazy loading, and performance optimizations`

---

#### 🗓️ Day 28 — ESLint + Prettier + Code Quality
**Goal:** Clean, linted codebase.

Tasks:
- [ ] Configure ESLint: `npx eslint --init`
- [ ] Configure Prettier: create `.prettierrc`
- [ ] Fix all ESLint warnings
- [ ] Remove all `console.log` from production code
- [ ] Remove unused imports, variables
- [ ] Consistent naming: camelCase for JS, PascalCase for components
- [ ] All API services centralized in `/services` folder

**Commit message:** `chore: configure ESLint and Prettier, fix all linting issues`

---

#### 🗓️ Day 29 — Full Integration Testing + Bug Fixes
**Goal:** Every feature works end-to-end.

Tasks:
- [ ] Test full user flow: Register → Login → Browse Laws → Search → Filter
- [ ] Test full admin flow: Login as admin → Manage Users → Analytics
- [ ] Test CRUD: Create → Read → Update → Delete a law record
- [ ] Test auth: JWT expiry, protected routes, role guards
- [ ] Test pagination: navigate through pages
- [ ] Test dark mode: all components work in dark
- [ ] Fix every bug found
- [ ] Verify all checklist items from `02_frontend_development_checklist.md`

**Commit message:** `fix: resolve integration bugs from end-to-end testing`

---

#### 🗓️ Day 30 — Final Documentation + GitHub + Submission
**Goal:** Submit clean, documented project.

Tasks:
- [ ] Write final `README.md` with setup steps, folder structure, features
- [ ] Write `README_FRONTEND.md` with Vite setup, env config, feature list
- [ ] Ensure Postman collection is in repo: `postman_collection.json`
- [ ] Clean commit history — no "fix fix fix" commits
- [ ] Meaningful commit messages throughout
- [ ] Fork official repo → work on fork → create PR → merge PR
- [ ] Final PR title format: `feat: Indian Law Penal Code Full Stack Project — Dashrat Rajpurohit`

**Commit message:** `docs: final project documentation and submission ready`

---

## 🗄️ Dataset Understanding

The dataset contains Indian Penal Code sections. Each record has:

```
{
  sectionNumber: "302",         // IPC section number
  title: "Punishment for Murder",
  description: "Whoever commits murder shall be punished...",
  actName: "IPC",               // IPC, CrPC, Evidence Act, etc.
  chapter: "Chapter XVI",
  category: "Offenses Against Human Body",
  punishmentType: "Imprisonment for Life",
  punishmentDetails: "Death or life imprisonment + fine",
  bailable: false,
  cognizable: true,
  compoundable: false,
  triableBy: "Sessions Court",
  state: "All States",
  court: "Supreme Court",
  status: "active",             // active / repealed / amended
  importance: "high"
}
```

---

## 🗃️ MongoDB Schema Design

### Law Schema (`models/Law.js`)

```javascript
const lawSchema = new mongoose.Schema({
  sectionNumber:    { type: String, required: true, index: true },
  title:            { type: String, required: true },
  description:      { type: String, required: true },
  actName:          { type: String, required: true, index: true,
                      enum: ['IPC', 'CrPC', 'Evidence Act', 'Constitution', 'Other'] },
  chapter:          { type: String },
  category:         { type: String, required: true, index: true },
  punishmentType:   { type: String },
  punishmentDetails:{ type: String },
  bailable:         { type: Boolean, default: false },
  cognizable:       { type: Boolean, default: true },
  compoundable:     { type: Boolean, default: false },
  triableBy:        { type: String },
  state:            { type: String, default: 'All States', index: true },
  court:            { type: String, index: true },
  status:           { type: String, enum: ['active', 'repealed', 'amended'], default: 'active' },
  importance:       { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  views:            { type: Number, default: 0 },
  bookmarkCount:    { type: Number, default: 0 },
  isArchived:       { type: Boolean, default: false },
  tags:             [{ type: String }],
  updateHistory:    [{
    updatedAt:      Date,
    updatedBy:      String,
    changes:        String
  }]
}, { timestamps: true });
```

### User Schema (`models/User.js`)

```javascript
const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },    // bcrypt hashed
  role:        { type: String, enum: ['admin', 'user'], default: 'user' },
  isActive:    { type: Boolean, default: true },
  isBanned:    { type: Boolean, default: false },
  otp:         { type: String },
  otpExpiry:   { type: Date },
  isVerified:  { type: Boolean, default: false },
  lastLogin:   { type: Date }
}, { timestamps: true });
```

---

## 🗂️ Folder Structure

```
indian_law_penal_code_DashratRajpurohit/
│
├── backend/
│   ├── config/
│   │   └── db.js                    ← MongoDB connection
│   ├── controllers/
│   │   ├── lawController.js
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── analyticsController.js
│   │   └── statsController.js
│   ├── middlewares/
│   │   ├── auth.js                  ← JWT verification
│   │   ├── roleCheck.js             ← Admin/User guard
│   │   ├── errorHandler.js          ← Global error handler
│   │   ├── rateLimiter.js
│   │   └── requestLogger.js
│   ├── models/
│   │   ├── Law.js
│   │   └── User.js
│   ├── routes/
│   │   ├── lawRoutes.js
│   │   ├── authRoutes.js
│   │   ├── searchRoutes.js
│   │   ├── filterRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── statsRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── jwtRoutes.js
│   │   └── middlewareRoutes.js
│   ├── services/
│   │   ├── lawService.js
│   │   └── authService.js
│   ├── utils/
│   │   ├── pagination.js            ← Reusable pagination logic
│   │   ├── apiResponse.js           ← Standard response format
│   │   └── asyncHandler.js          ← Centralized try/catch wrapper
│   ├── scripts/
│   │   └── seed.js                  ← Dataset seeding script
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PublicRoute.jsx
│   │   │   ├── LawTable.jsx
│   │   │   ├── LawCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── LawsListPage.jsx
│   │   │   ├── LawDetailPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── admin/
│   │   │       └── UsersPage.jsx
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── lawsSlice.js
│   │   │       └── uiSlice.js
│   │   ├── services/
│   │   │   ├── api.js               ← Axios instance + interceptors
│   │   │   ├── lawsService.js
│   │   │   └── authService.js
│   │   ├── hooks/
│   │   │   ├── useLaws.js
│   │   │   └── useAuth.js
│   │   ├── features/
│   │   │   ├── laws/
│   │   │   └── auth/
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   └── package.json
│
├── postman_collection.json
└── README.md
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/indian_law_penal_code
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 📡 API Reference (Key Endpoints)

| Category | Method | Endpoint | Auth Required |
|---|---|---|---|
| CRUD | GET | `/api/v1/laws` | No |
| CRUD | GET | `/api/v1/laws/:id` | No |
| CRUD | POST | `/api/v1/laws` | Admin |
| CRUD | PATCH | `/api/v1/laws/:id` | Admin |
| CRUD | DELETE | `/api/v1/laws/:id` | Admin |
| Search | GET | `/api/v1/search/laws?q=murder` | No |
| Filter | GET | `/api/v1/laws/filter/category/:cat` | No |
| Filter | GET | `/api/v1/laws/filter/act/:actName` | No |
| Analytics | GET | `/api/v1/analytics/laws/by-category` | No |
| Analytics | GET | `/api/v1/analytics/laws/most-viewed` | No |
| Stats | GET | `/api/v1/stats/laws/count` | No |
| Auth | POST | `/api/v1/auth/register` | No |
| Auth | POST | `/api/v1/auth/login` | No |
| Auth | GET | `/api/v1/auth/profile` | User |
| Admin | GET | `/api/v1/admin/users` | Admin |
| Admin | PATCH | `/api/v1/admin/users/:id/ban` | Admin |

---

## 🎯 Where Marks Are Hidden

Focus here for maximum marks:

### Backend (Critical — 40 marks)
1. **Aggregation pipelines** — graders LOVE this. Do all analytics routes with proper `$match → $group → $sort → $project` pipelines.
2. **JWT middleware** — must reject invalid tokens with proper 401 response.
3. **Seed script** — entire dataset in MongoDB, not just 5 test records.
4. **Pagination utility** — reusable function, not copy-pasted in every controller.
5. **MVC separation** — controllers must NOT have business logic. That goes in services.
6. **Postman collection** — exported JSON file in the repo.
7. **Error response format** — must be consistent: `{ success: false, message: "...", error: "..." }`.

### Frontend (Critical — 40 marks)
1. **Real backend data ONLY** — no hardcoded/static data anywhere. Instant deduction.
2. **Redux Toolkit** — graders will check `store/`. Must have proper slices, not `useEffect` everywhere.
3. **Role-based routing** — admin routes must redirect regular users.
4. **Analytics charts** — recharts connected to aggregation APIs = standout feature.
5. **Skeleton loaders** — shows professional-level thinking.
6. **Search + filters working together** — combined query params to backend.
7. **SEO meta tags** — easy marks, most students skip this.

### Bonus (Good to have — extra impression)
- Rate limiting on auth routes
- Soft delete with `isArchived` flag
- Database seeding script
- Password hashing with bcrypt
- API versioning with `/api/v1/`

---

## ⚡ AntiGravity Step-by-Step Commands

Feed this section to AntiGravity exactly as is. Each block = one working session.

---

### SESSION 1 — Backend Init
```
Project: Indian Law Penal Code MERN Backend
Task: Initialize Node.js + Express + MongoDB project

Create this exact folder structure:
backend/
  config/db.js
  controllers/lawController.js
  controllers/authController.js
  controllers/analyticsController.js
  controllers/statsController.js
  controllers/adminController.js
  middlewares/auth.js
  middlewares/roleCheck.js
  middlewares/errorHandler.js
  middlewares/rateLimiter.js
  models/Law.js
  models/User.js
  routes/lawRoutes.js
  routes/authRoutes.js
  routes/searchRoutes.js
  routes/filterRoutes.js
  routes/analyticsRoutes.js
  routes/statsRoutes.js
  routes/adminRoutes.js
  utils/pagination.js
  utils/apiResponse.js
  utils/asyncHandler.js
  scripts/seed.js
  .env
  server.js

Law Schema fields: sectionNumber(String,required), title(String,required), 
description(String,required), actName(String,required,enum:['IPC','CrPC','Evidence Act','Constitution','Other']), 
chapter(String), category(String,required), punishmentType(String), punishmentDetails(String), 
bailable(Boolean,default:false), cognizable(Boolean,default:true), compoundable(Boolean,default:false), 
triableBy(String), state(String,default:'All States'), court(String), 
status(String,enum:['active','repealed','amended'],default:'active'), 
importance(String,enum:['low','medium','high'],default:'medium'), 
views(Number,default:0), bookmarkCount(Number,default:0), isArchived(Boolean,default:false), 
tags([String]), updateHistory([{updatedAt:Date,updatedBy:String,changes:String}]),
timestamps:true

User Schema: name(required), email(required,unique), password(required,bcrypt hashed), 
role(enum:['admin','user'],default:'user'), isActive(Boolean), isBanned(Boolean), 
otp(String), otpExpiry(Date), isVerified(Boolean), lastLogin(Date), timestamps:true

Use: apiResponse utility for ALL responses: { success: true/false, message: '', data: {} }
Use: asyncHandler wrapper for ALL async controller functions (no try/catch in controllers)
Use: pagination utility for ALL list endpoints: { data, page, limit, total, totalPages }
```

---

### SESSION 2 — CRUD + Search + Filter Routes
```
Project: Indian Law Penal Code — Backend
Task: Implement all law routes

Build these controller functions in lawController.js:
- getAllLaws: GET /api/v1/laws — supports ?page, ?limit, ?sort, ?act, ?category, ?state, ?bailable, ?cognizable, ?repealed, ?search
- getLawById: GET /api/v1/laws/:id — return 404 if not found
- createLaw: POST /api/v1/laws — validate required fields
- replaceLaw: PUT /api/v1/laws/:id
- updateLaw: PATCH /api/v1/laws/:id — push change to updateHistory array
- deleteLaw: DELETE /api/v1/laws/:id
- getRecentLaws: GET /api/v1/laws/recent — sort by createdAt desc
- getTrendingLaws: GET /api/v1/laws/trending — sort by views desc
- getRandomLaw: GET /api/v1/laws/random — use $sample aggregation
- getArchivedLaws: GET /api/v1/laws/archived
- archiveLaw: PATCH /api/v1/laws/:id/archive — set isArchived:true
- restoreLaw: PATCH /api/v1/laws/:id/restore — set isArchived:false
- getLawSummary: GET /api/v1/laws/:id/summary — return only title, sectionNumber, punishmentType
- checkLawExists: GET /api/v1/laws/exists/:id — return {exists:true/false}
- getLawHistory: GET /api/v1/laws/:id/history

Search route in searchRoutes.js:
- searchLaws: GET /api/v1/search/laws?q= — $regex search on title + description + actName + category (case insensitive)

Filter routes in filterRoutes.js:
- /filter/act/:actName
- /filter/category/:category  
- /filter/state/:state
- /filter/court/:courtName
- /filter/status/:status
- /filter/punishment/:type
- /filter/bailable/:value
- /filter/cognizable/:value
- /filter/section/:sectionNumber
- /filter/chapter/:chapterId
- /filter/high-importance (where importance:'high')
- /filter/repealed (where status:'repealed')
- /filter/constitutional (where actName:'Constitution')
All filter routes support ?page and ?limit pagination
```

---

### SESSION 3 — Auth + Admin + JWT Routes
```
Project: Indian Law Penal Code — Auth System
Task: JWT authentication, admin routes, middleware

authController.js functions:
- register: hash password with bcrypt(10), create user, return JWT token
- login: find by email, compare password, return JWT {token, user:{id,name,email,role}}
- logout: return success message (token cleared on client)
- getProfile: return req.user data
- updateProfile: update name/email
- changePassword: verify old password, hash new, save
- sendOTP: generate 6 digit OTP, save to user.otp with 10min expiry
- verifyOTP: match OTP, check expiry, mark user.isVerified:true
- forgotPassword: find user by email, generate reset token
- resetPassword: hash new password, save

middlewares/auth.js:
- Verify Bearer token from Authorization header
- Decode JWT, find user by id
- Attach user to req.user
- Return 401 if invalid/expired

middlewares/roleCheck.js:
- Export function: roleCheck('admin') 
- Check req.user.role === required role
- Return 403 if not authorized

adminController.js:
- getAllUsers: GET /api/v1/admin/users — list all users (exclude passwords)
- getUserById: GET /api/v1/admin/users/:id
- banUser: PATCH /api/v1/admin/users/:id/ban — set isBanned:true
- unbanUser: PATCH /api/v1/admin/users/:id/unban — set isBanned:false  
- changeUserRole: PATCH /api/v1/admin/users/:id/role — update role field
- getSystemHealth: GET /api/v1/admin/system/health — return {status:'ok', uptime, memory, timestamp}
- getSystemLogs: GET /api/v1/admin/system/logs
- getReports: GET /api/v1/admin/reports

jwtRoutes.js:
- POST /api/v1/jwt/generate-token — generate token from req.body.payload
- POST /api/v1/jwt/verify-token — verify token, return decoded data
- POST /api/v1/jwt/refresh-token — verify old token, issue new one
- GET /api/v1/jwt/profile — protected route, return req.user
- GET /api/v1/jwt/dashboard — protected route
- GET /api/v1/jwt/admin — admin only route
- GET /api/v1/jwt/user — user role route
- DELETE /api/v1/jwt/revoke-token — add token to blacklist array
```

---

### SESSION 4 — Aggregation + Analytics + Stats
```
Project: Indian Law Penal Code — Analytics
Task: MongoDB aggregation pipelines

analyticsController.js (all use aggregate()):
- getLawsByCategory: $group by category, count each, $sort by count desc
- getLawsByState: $group by state, count, sort
- getLawsByCourt: $group by court, count, sort
- getMostViewedLaws: $sort by views desc, $limit 10, $project title+sectionNumber+views
- getMostBookmarkedLaws: $sort by bookmarkCount desc, $limit 10
- getLawsPopularity: $addFields {popularityScore: {$add:[views, bookmarkCount]}}, $sort popularityScore desc
- getLawsComplexity: $group by punishmentType, count, sort
- getRecentUpdates: $match {updatedAt: {$gte: 30 days ago}}, $sort updatedAt desc
- getSearchTrends: return top search terms (if tracked)
- getUserActivity: count user actions (if tracked)

statsController.js:
- getCount: countDocuments({isArchived:false})
- getActiveCount: countDocuments({status:'active', isArchived:false})
- getRepealedCount: countDocuments({status:'repealed'})
- getByAct: $group by actName, count each
- getByCategory: $group by category
- getByState: $group by state
- getByCourt: $group by court
- getBookmarkStats: $group total bookmarkCount sum
- getRecentStats: count laws created in last 7 days
- getTrendingStats: count laws with views > 100
```

---

### SESSION 5 — Frontend Init + Auth Pages
```
Project: Indian Law Penal Code — React Frontend
Task: Setup Vite React project with all dependencies and auth pages

Create Vite React project. Install: axios react-router-dom @reduxjs/toolkit react-redux 
formik yup @mui/material @emotion/react @emotion/styled react-hot-toast 
react-helmet-async tailwindcss postcss autoprefixer recharts

Configure Tailwind CSS.

Create this folder structure in src/:
components/ pages/ layouts/ store/slices/ services/ hooks/ features/ utils/

Create store/index.js with Redux Toolkit configureStore

Create store/slices/authSlice.js:
- state: { user: null, token: null, isLoading: false, error: null }
- actions: setCredentials, logout, setLoading, setError
- load token from localStorage on init

Create store/slices/lawsSlice.js:
- state: { laws: [], currentLaw: null, pagination: {page:1,limit:10,total:0}, isLoading: false }
- actions: setLaws, setCurrentLaw, setPagination, setLoading

Create services/api.js:
- Axios instance with baseURL from VITE_API_URL env
- Request interceptor: attach Authorization: Bearer token from localStorage
- Response interceptor: on 401 clear token + redirect to /login

Create pages/LoginPage.jsx:
- Formik form: email + password fields
- Yup validation: email format, password min 6 chars
- On submit: call POST /api/v1/auth/login
- On success: save token to localStorage, dispatch setCredentials, navigate to /dashboard
- Show error toast on failure

Create pages/RegisterPage.jsx:
- Formik form: name + email + password + confirmPassword
- Yup validation
- Call POST /api/v1/auth/register
- On success: auto-login, navigate to /dashboard

Create components/ProtectedRoute.jsx: check token in Redux, redirect to /login if missing
Create components/PublicRoute.jsx: redirect to /dashboard if token exists

Create App.jsx with React Router:
- Public routes: / → /login, /register
- Protected routes: /dashboard, /laws, /laws/:id, /analytics, /profile, /admin/users
- Use DashboardLayout as wrapper for protected routes
```

---

### SESSION 6 — Dashboard Layout + Laws List + Search
```
Project: Indian Law Penal Code — Dashboard UI
Task: Main dashboard layout and laws listing

Create layouts/DashboardLayout.jsx:
- Flexbox layout: sidebar (fixed left) + main content (scrollable)
- Include Sidebar and Navbar components

Create components/Sidebar.jsx:
- Navigation links: Dashboard, Laws, Analytics, Users (admin only), Profile, Settings
- Active link highlighted
- Collapse on mobile

Create components/Navbar.jsx:
- Left: page title
- Right: dark/light toggle + user avatar + logout button
- Logout: clear localStorage + dispatch logout + navigate to /login

Create pages/DashboardHome.jsx:
- Fetch from /api/v1/stats/laws/count, /stats/laws/active, /stats/laws/repealed
- 4 stats cards: Total Laws, Active Laws, Repealed Laws, Trending Laws
- Recent laws table (last 5 from /api/v1/laws/recent)
- Quick search bar

Create pages/LawsListPage.jsx:
- Fetch GET /api/v1/laws?page=1&limit=10
- MUI Table showing: Section No., Title, Act, Category, Bailable, Status, Actions
- Pagination controls (prev/next, page size 10/20/50)
- Sort by clicking column headers (update ?sort= query param)
- Skeleton loader while fetching (MUI Skeleton)
- Empty state when no laws found

Create components/SearchBar.jsx:
- Input with debounce (300ms using setTimeout)
- On type: call GET /api/v1/search/laws?q=<input>
- Show results count

Create components/FilterPanel.jsx:
- Dropdowns for: Act, Category, State, Bailable(Yes/No), Status(active/repealed/archived)
- Clear All Filters button
- On change: update URL query params and re-fetch laws
```

---

### SESSION 7 — Law CRUD + Analytics + Admin
```
Project: Indian Law Penal Code — CRUD + Charts + Admin
Task: Law detail, CRUD modals, analytics charts, admin panel

Create pages/LawDetailPage.jsx:
- Fetch GET /api/v1/laws/:id
- Display all fields in a clean card layout
- Archive/Restore button (admin only)
- Edit button (opens EditModal, admin only)
- Delete button with MUI Dialog confirmation (admin only)

Create CRUD Modal components:
- AddLawModal: Formik form with all Law fields, POST /api/v1/laws
- EditLawModal: prefill form with current data, PATCH /api/v1/laws/:id
- DeleteConfirmDialog: MUI Dialog, DELETE /api/v1/laws/:id
- After each CRUD operation: show react-hot-toast success/error, re-fetch laws list

Create pages/AnalyticsPage.jsx using recharts:
- BarChart: Laws by Category → GET /api/v1/analytics/laws/by-category
- PieChart: Laws by Act → GET /api/v1/stats/laws/by-act
- BarChart: Laws by State (top 10) → GET /api/v1/analytics/laws/by-state
- Table: Top 10 Most Viewed → GET /api/v1/analytics/laws/most-viewed
- Table: Top 10 Most Bookmarked → GET /api/v1/analytics/laws/most-bookmarked
- All charts show loading skeleton while fetching

Create pages/admin/UsersPage.jsx (admin role only):
- Fetch GET /api/v1/admin/users
- Table: name, email, role, isActive, isBanned, createdAt
- Ban button → PATCH /api/v1/admin/users/:id/ban
- Unban button → PATCH /api/v1/admin/users/:id/unban
- Role dropdown → PATCH /api/v1/admin/users/:id/role
- If req.user.role !== 'admin': show AccessDenied component

Create pages/ProfilePage.jsx:
- Show user data from GET /api/v1/auth/profile
- Edit form: name, email → PATCH /api/v1/auth/profile
- Change password form → POST /api/v1/auth/change-password
```

---

### SESSION 8 — Final Polish + SEO + Optimization
```
Project: Indian Law Penal Code — Final Polish
Task: Error handling, SEO, performance, and code quality

Add to every page component:
- React Helmet with unique title: "Laws | IPC Dashboard", "Analytics | IPC Dashboard"
- Meta description tag per page
- Open Graph tags on main pages

Add global components:
- Create ErrorBoundary.jsx wrapping the app
- Create 404 NotFoundPage.jsx
- Loading spinner component for route transitions (React.lazy + Suspense)
- All page routes must use React.lazy for code splitting

Add to all pages that have API calls:
- Skeleton loader while loading (MUI Skeleton, match actual content shape)
- Error state: "Failed to load data. Try again." button calls refetch
- Empty state: custom message when no records found

Add react-hot-toast Toaster in App.jsx
All CRUD operations must show toast: success green, error red

Implement Light/Dark mode:
- Toggle in Navbar
- Save preference to localStorage
- MUI theme switches between light/dark
- Tailwind dark: classes used

Code quality:
- Remove all console.log
- Add PropTypes to all components
- No hardcoded API URLs (all from services/)
- No static/mock data anywhere in the app

Final README.md should include:
- Project description
- Setup steps (clone, npm install, .env config, npm run dev)
- Features list
- Folder structure
- API endpoints overview
- Postman collection link
```

---

## ✅ Final Submission Checklist

### Before Submitting PR:
- [ ] Backend runs without errors: `node server.js`
- [ ] Frontend runs without errors: `npm run dev`
- [ ] All 6 CRUD APIs work in Postman
- [ ] JWT login/register works
- [ ] Analytics routes return aggregated data
- [ ] React app connects to real MongoDB data (no static data)
- [ ] CRUD operations work from frontend
- [ ] Admin routes protected (test with user token = 403)
- [ ] Search + filters working
- [ ] Dark mode works
- [ ] Postman collection JSON in repo
- [ ] README.md complete

### GitHub PR Format:
```
Title: feat: Indian Law Penal Code Full Stack MERN Project — Dashrat Rajpurohit
Branch: dashrat-rajpurohit/indian_law_penal_code
Target: main (official CodingGita repo)
```

---

*Built with MERN Stack | CodingGita × Swaminarayan University | Batch 2025–2029*
