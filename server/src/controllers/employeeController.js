const prisma = require("../prisma");
const { emitEmployeeEvent } = require("../sockets/socketHandler");

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json(employees);
  } catch (error) {
    console.error("[getEmployees Error]:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, department, status } = req.body;

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        department,
        status: status || "Active",
      },
    });

    // Real-time Socket.io notification
    emitEmployeeEvent("employee:created", employee);

    res.status(201).json(employee);
  } catch (error) {
    console.error("[createEmployee Error]:", error);

    // Handling Prisma unique constraint violation (P2002 - Duplicate Email)
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Failed to create employee" });
  }
};

// Update an existing employee
const updateEmployee = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    const { name, email, department, status } = req.body;

    // Check if employee exists first
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        email,
        department,
        status: status || existingEmployee.status,
      },
    });

    // Real-time Socket.io notification
    emitEmployeeEvent("employee:updated", updatedEmployee);

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("[updateEmployee Error]:", error);

    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(500).json({ error: "Failed to update employee" });
  }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    // Check if employee exists first
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await prisma.employee.delete({
      where: { id },
    });

    // Real-time Socket.io notification
    emitEmployeeEvent("employee:deleted", { id });

    res.status(200).json({ message: "Employee deleted successfully", id });
  } catch (error) {
    console.error("[deleteEmployee Error]:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(500).json({ error: "Failed to delete employee" });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
