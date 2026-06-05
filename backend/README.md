# TaskFlow Backend 🚀

This is the backend REST API for TaskFlow, built using **Node.js, Express.js, and MongoDB**.

---

## 🛠️ Quick Start (3 Steps)

### Step 1: Install dependencies
Navigate to this folder and install the required packages:
```bash
npm install
```

### Step 2: Configure Environment
Create a `.env` file in the `backend` folder (or verify the existing one) and add:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=supersecrettokenkey123
```

### Step 3: Run the server
Start the server in development mode (watches for changes and auto-restarts):
```bash
npm run dev
```
*The API server will run on [http://localhost:5000](http://localhost:5000).*

---

## 🔗 Key API Endpoints

### Public Routes (No Token Required)
*   `POST /api/auth/register` - Sign up a new user. Expects `{ name, email, password }`.
*   `POST /api/auth/login` - Sign in an existing user. Expects `{ email, password }`.

### Protected Routes (Requires JWT in Authorization header)
*   `GET /api/auth/me` - Retrieve current user info.
*   `GET /api/tasks` - Fetch user's tasks (supports search, priority/status filters, sorting, and pagination).
*   `POST /api/tasks` - Create a task. Expects `{ title, description, priority, dueDate }`.
*   `PUT /api/tasks/:id` - Update a task (or toggle status).
*   `DELETE /api/tasks/:id` - Delete a task.
