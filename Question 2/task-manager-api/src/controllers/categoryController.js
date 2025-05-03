const db = require("../config/db");

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT category_id, name, description FROM Categories");
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT category_id, name, description FROM Categories WHERE category_id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ message: "Error fetching category", error: error.message });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        const [result] = await db.query("INSERT INTO Categories (name, description) VALUES (?, ?)", [name, description]);
        res.status(201).json({ message: "Category created successfully", categoryId: result.insertId });
    } catch (error) {
        console.error("Error creating category:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Category name already exists", error: error.message });
        }
        res.status(500).json({ message: "Error creating category", error: error.message });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Check if category exists
        const [categoryCheck] = await db.query("SELECT category_id FROM Categories WHERE category_id = ?", [id]);
        if (categoryCheck.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Build update query dynamically
        let query = "UPDATE Categories SET ";
        const params = [];
        if (name) {
            query += "name = ?, ";
            params.push(name);
        }
        if (description !== undefined) { // Allow setting description to null or a new value
            query += "description = ?, ";
            params.push(description);
        }

        // Remove trailing comma and space
        query = query.slice(0, -2);
        query += " WHERE category_id = ?";
        params.push(id);

        if (params.length <= 1) {
             return res.status(400).json({ message: "No fields to update provided" });
        }

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found or no changes made" });
        }
        res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        console.error("Error updating category:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Category name already exists", error: error.message });
        }
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Note: Tasks associated with this category will have category_id set to NULL due to ON DELETE SET NULL
        const [result] = await db.query("DELETE FROM Categories WHERE category_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
};

