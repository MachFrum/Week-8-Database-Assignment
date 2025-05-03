# Task Manager API

A simple task management backend API with an integrated frontend to search and manage users, built with Node.js, Express, and MySQL.

---

## Folder Structure Overview

```
/task-manager-api          # Backend + frontend project folder
  |-- /public              # Static frontend files (HTML, CSS, JS)
  |-- /src                 # Backend source code
  |    |-- /config         # Database config
  |    |-- /controllers    # Route handlers
  |    |-- /routes         # API routes
  |-- clinic.env           # Environment variables (not committed)
  |-- task_manager_schema.sql  # Database schema + seed data
  |-- server.js
  |-- package.json
  |-- package-lock.json
/Live Demo                 # Separate folder with demo video (outside task-manager-api)
```

---

## Prerequisites

- [Node.js](https://nodejs.org/en/) v16 or later  
- [MySQL](https://www.mysql.com/) server running and accessible  
- Git (optional, for cloning)

---

## Getting Started

### 1. Clone the repository containing both folders:

```bash
git clone https://github.com/MachFrum/Week-8-Database-Assignment.git
```

This will download both `task-manager-api` and `Live Demo` folders side by side.

---

### 2. Setup the API project

Navigate into the backend folder:

```bash
cd task-manager-api
```

---

### 3. Install dependencies

```bash
npm install
```

---

### 4. Set up the database

Make sure your MySQL server is running.

Import the database schema and seed your database with this command:

```bash
mysql -u your_mysql_user -p < task_manager_schema.sql
```

Alternatively, use your favorite MySQL client tool and GUI.

---

### 5. Configure environment variables
 
1. **Edit the `clinic.env` file** in the project root.  
2. Replace the placeholder values with your MySQL credentials:  

```env
DB_HOST=localhost
DB_USER=your_actual_mysql_username  
DB_PASSWORD=your_actual_mysql_password
DB_NAME=task_manager
DB_PORT=3306
```

Make sure these match your MySQL credentials.

---

### 6. Start the API server

```bash
npm start
```

The server listens on port `3000` by default.

---

### 7. Access the frontend

Open your browser and go to:

[http://localhost:3000](http://localhost:3000)

Use the search box to find users, create new users, edit or delete existing users.

---

## Features

- Search users by username (case-insensitive)  
- Create, update, and delete user records  
- Fully functional REST API with Express and MySQL  
- Frontend served statically from Express for easy use

---

## Troubleshooting

- Confirm MySQL server is running and accessible with correct credentials  
- Check your `.env` file passwords and ports  
- Backend logs errors in the console if any issues occur  
- Use browser DevTools (Network tab) to inspect API requests/responses

---

## Live Demo

In the sibling folder `Live Demo` you will find a video demonstration of the app in action.

---

## License

This project is for learning purposes.

---

## Contributions

Feel free to fork, raise issues, or submit pull requests to improve the project.

---

## Contact

mpeter778@gmail.com

```