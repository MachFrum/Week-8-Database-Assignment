require("dotenv").config({ path: "clinic.env" }); // Load environment variables from .env file
const cors = require('cors');
const express = require("express");
const db = require("./src/config/db"); // Import the database connection pool promise

// Import route handlers
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Basic route for testing
app.get("/", (req, res) => {
    res.send("Task Manager API is running!");
});

// Mount the routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tasks", taskRoutes);

// Global error handler (optional basic example)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Function to test database connection and start server
async function startServer() {
    try {
        // Test the database connection
        const connection = await db.getConnection();
        console.log("Successfully connected to the database.");
        connection.release(); // Release the connection back to the pool

        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1); // Exit the process if DB connection fails
    }
}

// Start the server
startServer();