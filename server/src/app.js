const express = require("express");
const prisma = require("./prisma");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* Home Route */

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

/* Get All Employees */

app.get("/api/employees", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(employees);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch employees",
    });
  }
});

/* Add Employee */

app.post("/api/employees", async (req, res) => {
  try {
    const { name, email, department } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (!department || department.trim() === "") {
      return res.status(400).json({ message: "Department is required" });
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        department,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    res.status(500).json({
      error: "Failed to create employee",
    });
  }
});

/* Update Employee */

app.put("/api/employees/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { name, email, department, status } = req.body;

    const employee = await prisma.employee.update({
      where: { id },

      data: {
        name,
        email,
        department,
        status,
      },
    });

    res.json(employee);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update employee",
    });
  }
});

/* Delete Employee */

app.delete("/api/employees/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.employee.delete({
      where: { id },
    });

    res.json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete employee",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});