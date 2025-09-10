import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    secondname: "",
    email: "",
    password: "",
    phone: "",
    accountType: "buyer", // Default account type
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gmail validation regex
  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Check Gmail validity
    if (!isValidGmail(formData.email)) {
      setError("Please enter a valid Gmail address (example@gmail.com).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(" http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies/sessions
        body: JSON.stringify({
          firstname: formData.firstname,
          secondname: formData.secondname,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          accountType: formData.accountType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
      } else {
        setSuccess("✅ Registration successful! Redirecting to login...");
        // Redirect to appropriate login based on account type
        setTimeout(() => {
          if (formData.accountType === "seller") {
            navigate("/seller-login");
          } else {
            navigate("/buyer-login");
          }
        }, 2000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your first name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Second Name</label>
          <input
            type="text"
            name="secondname"
            value={formData.secondname}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your second name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email (Gmail only)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your Gmail address"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
            required
            minLength={5}
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 5 characters with uppercase, lowercase, and number
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Account Type</label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registering..." : "REGISTER"}
        </button>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>
            Already have an account?{" "}
            <Link to="/buyer-login" className="text-blue-500 hover:underline">
              Login as Buyer
            </Link>{" "}
            or{" "}
            <Link to="/seller-login" className="text-blue-500 hover:underline">
              Login as Seller
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
