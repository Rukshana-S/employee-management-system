import { useState } from "react";
import { addEmployee } from "../services/api";
import { toast } from "react-toastify";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    department: "",
  });

  // Clear error while typing
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      department: "",
    };

    // Frontend Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required.";
    }

    setErrors(newErrors);

    // Stop if validation fails
    if (Object.values(newErrors).some((value) => value !== "")) {
      return;
    }

    try {
      await addEmployee(formData);

      toast.success("Employee added successfully!");

      // Clear form
      setFormData({
        name: "",
        email: "",
        department: "",
      });

      // Clear errors
      setErrors({
        name: "",
        email: "",
        department: "",
      });
    } catch (error) {
      switch (error.status) {
        case 400:
          toast.warning(error.message || "Please check your inputs.");
          break;

        case 409:
          setErrors((prev) => ({
            ...prev,
            email: "Email already exists.",
          }));
          break;

        case 500:
          toast.error("Server error. Please try again.");
          break;

        default:
          toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Add Employee
        </h1>

        {/* Name */}
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Department */}
        <div className="mb-6">
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              errors.department ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">
              {errors.department}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;