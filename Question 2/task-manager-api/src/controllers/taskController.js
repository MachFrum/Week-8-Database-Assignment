const db = require("../config/db");

// Get all tasks (optionally filter by status, user_id, category_id)
exports.getAllTasks = async (req, res) => {
    try {
        // Basic query
        let query = "SELECT t.task_id, t.title, t.description, t.status, t.due_date, t.created_at, t.updated_at, u.username as assigned_user, c.name as category_name FROM Tasks t LEFT JOIN Users u ON t.user_id = u.user_id LEFT JOIN Categories c ON t.category_id = c.category_id";
        const params = [];
        const conditions = [];

        // Optional filtering
        if (req.query.status) {
            conditions.push("t.status = ?");
            params.push(req.query.status);
        }
        if (req.query.user_id) {
            conditions.push("t.user_id = ?");
            params.push(req.query.user_id);
        }
        if (req.query.category_id) {
            conditions.push("t.category_id = ?");
            params.push(req.query.category_id);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY t.created_at DESC"; // Default sort order

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT t.task_id, t.title, t.description, t.status, t.due_date, t.created_at, t.updated_at, u.username as assigned_user, c.name as category_name FROM Tasks t LEFT JOIN Users u ON t.user_id = u.user_id LEFT JOIN Categories c ON t.category_id = c.category_id WHERE t.task_id = ?";
        const [rows] = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Error fetching task", error: error.message });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, due_date, user_id, category_id } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Task title is required" });
        }

        // Validate status if provided
        const validStatuses = ["Pending", "In Progress", "Completed"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        // Optional: Validate user_id and category_id exist before inserting
        // (Skipped here for brevity, but recommended in production)

        const query = "INSERT INTO Tasks (title, description, status, due_date, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?)";
        const params = [
            title,
            description || null,
            status || "Pending", // Default status
            due_date || null,
            user_id || null,
            category_id || null
        ];

        const [result] = await db.query(query, params);
        res.status(201).json({ message: "Task created successfully", taskId: result.insertId });
    } catch (error) {
        console.error("Error creating task:", error);
        // Handle potential foreign key constraint errors if validation wasn't done prior
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
             return res.status(400).json({ message: "Invalid user_id or category_id provided", error: error.message });
        }
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, due_date, user_id, category_id } = req.body;

        // Check if task exists
        const [taskCheck] = await db.query("SELECT task_id FROM Tasks WHERE task_id = ?", [id]);
        if (taskCheck.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Validate status if provided
        const validStatuses = ["Pending", "In Progress", "Completed"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        // Build update query dynamically
        let query = "UPDATE Tasks SET ";
        const params = [];
        const fieldsToUpdate = { title, description, status, due_date, user_id, category_id };

        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if (value !== undefined) { // Check if field is provided in request body
                query += `${key} = ?, `;
                params.push(value);
            }
        }

        if (params.length === 0) {
            return res.status(400).json({ message: "No fields to update provided" });
        }

        // Remove trailing comma and space
        query = query.slice(0, -2);
        query += " WHERE task_id = ?";
        params.push(id);

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            // Should not happen if initial check passed, but good practice
            return res.status(404).json({ message: "Task not found or no changes made" });
        }
        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.error("Error updating task:", error);
         // Handle potential foreign key constraint errors
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
             return res.status(400).json({ message: "Invalid user_id or category_id provided", error: error.message });
        }
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM Tasks WHERE task_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

