import React, { useEffect, useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5); // users per page
  const [formData, setFormData] = useState({ fullname: "", email: "", password: "" });
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/users", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search filter
  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.fullname.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // reset to page 1 on search
  }, [search, users]);

  // Pagination logic
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / perPage);

  // Handle form change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submit (Add or Edit user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingUser
        ? `http://127.0.0.1:5000/users/${editingUser.id}`
        : "http://127.0.0.1:5000/users";

      const method = editingUser ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchUsers();
        setFormData({ fullname: "", email: "", password: "" });
        setEditingUser(null);
      } else {
        const err = await res.json();
        alert(err.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // Handle delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://127.0.0.1:5000/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Handle edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ fullname: user.fullname, email: user.email, password: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">👥 User Management</h2>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col gap-3"
      >
        <h3 className="text-lg font-semibold">
          {editingUser ? "✏️ Edit User" : "➕ Add New User"}
        </h3>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder={editingUser ? "Leave blank to keep current password" : "Password"}
          value={formData.password}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {editingUser ? "Update User" : "Create User"}
        </button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 border px-3 py-2 rounded-lg w-full"
      />

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">#</th>
              <th className="p-3 border-b">Full Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{indexOfFirst + index + 1}</td>
                <td className="p-3 border-b">{user.fullname}</td>
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-400 px-3 py-1 rounded-lg hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          ◀ Prev
        </button>
        <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
