const express = require("express");
const http = require("http");
const cors = require("cors");
const employeeRoutes = require("./routes/employees");
const { initSocket } = require("./sockets/socketHandler");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.json({ message: "ERP Employee Management System API Server Running" });
});

// API Routes
app.use("/api/employees", employeeRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "API Route Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Global Error]:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 ERP Server running on http://localhost:${PORT}`);
});

module.exports = { app, server };