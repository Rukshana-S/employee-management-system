const validateEmployee = (req, res, next) => {
  let { name, email, department, status } = req.body;

  // Trim whitespace
  name = typeof name === "string" ? name.trim() : name;
  email = typeof email === "string" ? email.trim() : email;
  department = typeof department === "string" ? department.trim() : department;
  status = typeof status === "string" ? status.trim() : status;

  if (!name || name === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  if (!email || email === "") {
    return res.status(400).json({ error: "Email is required" });
  }

  // Regex check for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!department || department === "") {
    return res.status(400).json({ error: "Department is required" });
  }

  if (status && !["Active", "Inactive"].includes(status)) {
    return res.status(400).json({ error: "Status must be either Active or Inactive" });
  }

  // Attach sanitized fields to req.body
  req.body.name = name;
  req.body.email = email;
  req.body.department = department;
  if (status) req.body.status = status;

  next();
};

module.exports = validateEmployee;
