# TaskFlow ⚡ - Premium MERN Task Management Web Application

TaskFlow is a modern, secure, responsive MERN (MongoDB, Express, React, Node.js) stack Task Management application featuring full JWT authentication, paged CRUD operations, priority tags, real-time statistics dashboard, custom warnings for overdue tasks, and a full light/dark mode theme controller.

All UI components in this application are styled using **React inline styles** (`style={{ ... }}`), dynamically coordinating layouts and theme states directly within Javascript.

---

## ⚡ Features

1.  **Secure Authentication**: Secure registration and login flows with field-level validations and hashed passwords (using `bcryptjs`). Session tokens are stored in `localStorage` and automatically appended to requests using Axios interceptors.
2.  **Interactive Task CRUD**: Create, read, update, and delete tasks instantly.
3.  **Real-Time Status Toggle**: Complete or mark tasks pending directly from task cards.
4.  **Premium Dashboard Statistics**: View overall metrics (Total, Completed, Pending, and a glowing Pink linear-gradient Completion Rate progress bar).
5.  **Multi-Dimensional Filtering & Sorting**:
    *   **Search**: Dynamic keypress-debounced search across task titles and descriptions.
    *   **Filters**: Filter lists by completion status and priorities (Low, Medium, High).
    *   **Sorting**: Sort by Newest, Oldest, Due Date (Soonest/Furthest), or Alphabetical (A-Z).
6.  **Pagination**: Fluid pagination showing 6 tasks per page to maintain clean layouts.
7.  **Smart Overdue Warnings**: Overdue tasks trigger dynamic, pulsing warning icons and red color-coding to highlight immediate deadlines.
8.  **Light/Dark Theme Controller Persistence**: Toggle theme modes seamlessly; styles dynamically transition inline and choices persist across sessions in `localStorage`.
9.  **Fluid Responsive Layouts**: Component states automatically adjust using window resizing listeners to scale from 4K monitors to small mobile screen viewports.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js (Vite, Functional Components, Hooks, Context Providers), Lucide React (Icons), Axios (API Client).
*   **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS.
*   **Database**: MongoDB (`mongoose`).

---

## 🚀 Quick Setup Instructions

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v22.x or later recommended) and [MongoDB](https://www.mongodb.com/) installed and running locally on port `27017`.

---

### 1. Database Setup
Confirm MongoDB is listening on local port `27017`.
The connection string used is `mongodb://127.0.0.1:27017/taskmanager`.

---

### 2. Backend Server Setup
1.  Navigate into the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Configure your environment variables in `backend/.env` (pre-configured):
    ```env
    PORT=5000
    MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
    JWT_SECRET=supersecrettokenkey123
    ```
4.  Start the backend development server (includes native Node `--watch` reload):
    ```bash
    npm run dev
    ```
    *The server will start on [http://localhost:5000](http://localhost:5000).*

---

### 3. Frontend Web App Setup
1.  Navigate into the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Launch the Vite React client:
    ```bash
    npm run dev
    ```
    *The frontend will boot on [http://localhost:5173](http://localhost:5173).*

---

## 🔗 Backend API Routes

All task routes are protected and require a valid `Authorization: Bearer <JWT_TOKEN>` header.

### Authentication (Public)
*   `POST /api/auth/register` - Registers a new user. Receives `{ name, email, password }`.
*   `POST /api/auth/login` - Authenticates user credentials. Receives `{ email, password }`.
*   `GET /api/auth/me` (Protected) - Retrieves user profile context based on token.

### Tasks (Protected)
*   `GET /api/tasks` - Returns user-specific tasks. Supports query parameters:
    *   `search`: Query keywords (debounced).
    *   `status`: `'all' | 'pending' | 'completed'`.
    *   `priority`: `'all' | 'low' | 'medium' | 'high'`.
    *   `sortBy`: `'createdAt:desc' | 'createdAt:asc' | 'dueDate:asc' | 'dueDate:desc' | 'title:asc'`.
    *   `page`: Page offset (default `1`).
    *   `limit`: Page size (default `6`).
*   `POST /api/tasks` - Creates a new task. Receives `{ title, description, priority, dueDate }`.
*   `PUT /api/tasks/:id` - Updates task properties (or toggles completion).
*   `DELETE /api/tasks/:id` - Permanently removes a task.
