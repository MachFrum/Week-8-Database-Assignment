const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();

// GET all categories
router.get("/", categoryController.getAllCategories);

// GET category by ID
router.get("/:id", categoryController.getCategoryById);

// POST create a new category
router.post("/", categoryController.createCategory);

// PUT update a category by ID
router.put("/:id", categoryController.updateCategory);

// DELETE a category by ID
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;

