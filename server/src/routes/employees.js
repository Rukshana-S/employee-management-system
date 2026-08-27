const express = require("express");
const router = express.Router();
const validateEmployee = require("../middleware/validateEmployee");
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// Fetch all employees
router.get("/", getEmployees);

// Create new employee with validation
router.post("/", validateEmployee, createEmployee);

// Update existing employee with validation
router.put("/:id", validateEmployee, updateEmployee);

// Delete employee by ID
router.delete("/:id", deleteEmployee);

module.exports = router;
