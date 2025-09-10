import React, { useEffect, useState } from "react";

const BuyersManagement = () => {
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [editBuyer, setEditBuyer] = useState(null);
  const [editForm, setEditForm] = useState({
    firstname: "",
    secondname: "",
    email: "",
    phone: "",
    status: "active",
  });

  // Fetch all buyers
  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/admin/buyers");

      if (res.ok) {
        const data = await res.json();
        setBuyers(data.buyers || data);
        setFilteredBuyers(data.buyers || data);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to fetch buyers");
      }
    } catch (err) {
      console.error("Error fetching buyers:", err);
      setError("Server error while fetching buyers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  // Delete buyer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this buyer?")) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/buyers/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchBuyers();
      } else {
        const err = await res.json();
        setError(err.error || "Failed to delete buyer");
      }
    } catch (err) {
      console.error("Error deleting buyer:", err);
      setError("Server error while deleting buyer");
    }
  };

  // Toggle buyer status
  const toggleBuyerStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/buyers/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: currentStatus === "active" ? "suspended" : "active",
          }),
        }
      );

      if (res.ok) {
        fetchBuyers();
      } else {
        const err = await res.json();
        setError(err.error || "Failed to update buyer status");
      }
    } catch (err) {
      console.error("Error updating buyer status:", err);
      setError("Server error while updating buyer status");
    }
  };

  // Open edit modal
  const openEditModal = (buyer) => {
    setEditBuyer(buyer);
    setEditForm({
      firstname: buyer.firstname || "",
      secondname: buyer.secondname || "",
      email: buyer.email || "",
      phone: buyer.phone || "",
      status: buyer.status || "active",
    });
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save buyer update
  const saveBuyerUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/buyers/${editBuyer.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      if (res.ok) {
        setEditBuyer(null);
        fetchBuyers();
      } else {
        const err = await res.json();
        setError(err.error || "Failed to update buyer");
      }
    } catch (err) {
      console.error("Error saving buyer update:", err);
      setError("Server error while updating buyer");
    }
  };

  // Search filter
  useEffect(() => {
    const filtered = buyers.filter(
      (buyer) =>
        buyer.firstname?.toLowerCase().includes(search.toLowerCase()) ||
        buyer.secondname?.toLowerCase().includes(search.toLowerCase()) ||
        buyer.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBuyers(filtered);
    setCurrentPage(1);
  }, [search, buyers]);

  // Pagination
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentBuyers = filteredBuyers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBuyers.length / perPage);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading buyers...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Buyers</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <p className="mb-4 text-gray-700">
        View, update, suspend/activate, and delete buyer accounts.
      </p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search buyers by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full max-w-md"
        />
      </div>

      <table className="w-full border-collapse bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBuyers.map((buyer) => (
            <tr key={buyer.id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                {buyer.firstname} {buyer.secondname}
              </td>
              <td className="p-3">{buyer.email}</td>
              <td className="p-3">{buyer.phone || "N/A"}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    buyer.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {buyer.status || "active"}
                </span>
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => setSelectedBuyer(buyer)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => openEditModal(buyer)}
                  className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleBuyerStatus(buyer.id, buyer.status)}
                  className={`px-3 py-1 text-white rounded text-sm ${
                    buyer.status === "active"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {buyer.status === "active" ? "Suspend" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(buyer.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {currentBuyers.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                {buyers.length === 0
                  ? "No buyers found."
                  : "No matching buyers found."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            ◀ Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Next ▶
          </button>
        </div>
      )}

      {/* View Buyer Modal */}
      {selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Buyer Details</h2>
            <p>
              <strong>Name:</strong> {selectedBuyer.firstname}{" "}
              {selectedBuyer.secondname}
            </p>
            <p>
              <strong>Email:</strong> {selectedBuyer.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedBuyer.phone || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedBuyer.status}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedBuyer(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Buyer Modal */}
      {editBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Buyer</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="firstname"
                value={editForm.firstname}
                onChange={handleEditChange}
                placeholder="First name"
                className="border px-3 py-2 w-full rounded"
              />
              <input
                type="text"
                name="secondname"
                value={editForm.secondname}
                onChange={handleEditChange}
                placeholder="Second name"
                className="border px-3 py-2 w-full rounded"
              />
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="Email"
                className="border px-3 py-2 w-full rounded"
              />
              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
                placeholder="Phone"
                className="border px-3 py-2 w-full rounded"
              />
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="border px-3 py-2 w-full rounded"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditBuyer(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={saveBuyerUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyersManagement;
