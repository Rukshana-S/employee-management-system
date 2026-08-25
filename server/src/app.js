const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.get("/api/employees", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Rukshana",
      department: "IT"
    },
    {
      id: 2,
      name: "Keerthi",
      department: "HR"
    }
  ]);
});