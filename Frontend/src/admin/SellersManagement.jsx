import React, { useEffect, useState } from "react";

const SellersManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all sellers
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/admin/sellers", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setSellers(data.sellers || data);
        setFilteredSellers(data.sellers || data);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to fetch sellers");
        setSellers([]);
        setFilteredSellers([]);
      }
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setError("Server error while fetching sellers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Delete seller
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/sellers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchSellers();
      } else {
        const err = await res.json();
        setError(err.error || "Failed to delete seller");
      }
    } catch (err) {
      console.error("Error deleting seller:", err);
      setError("Server error while deleting seller");
    }
  };

  // Toggle seller status (active ↔ suspended)
  const toggleSellerStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/sellers/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            status: currentStatus === "active" ? "suspended" : "active",
          }),
        }
      );

      if (res.ok) {
        fetchSellers();
      } else {
        const err = await res.json();
        setError(err.error || "Failed to update seller status");
      }
    } catch (err) {
      console.error("Error updating seller status:", err);
      setError("Server error while updating seller status");
    }
  };

  // Search filter
  useEffect(() => {
    const filtered = sellers.filter(
      (seller) =>
        seller.firstname?.toLowerCase().includes(search.toLowerCase()) ||
        seller.secondname?.toLowerCase().includes(search.toLowerCase()) ||
        seller.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSellers(filtered);
    setCurrentPage(1);
  }, [search, sellers]);

  // Pagination
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentSellers = filteredSellers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSellers.length / perPage);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading sellers...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Sellers</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <p className="mb-4 text-gray-700">
        View, activate, suspend, or remove sellers from the platform.
      </p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search sellers by name or email..."
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
          {currentSellers.map((seller) => (
            <tr key={seller.id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                {seller.firstname} {seller.secondname}
              </td>
              <td className="p-3">{seller.email}</td>
              <td className="p-3">{seller.phone || "N/A"}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    seller.status === "active"
                      ? "bg-green-100 text-green-800"
                      : seller.status === "suspended"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {seller.status || "active"}
                </span>
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => toggleSellerStatus(seller.id, seller.status)}
                  className={`px-3 py-1 text-white rounded text-sm ${
                    seller.status === "active"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {seller.status === "active" ? "Suspend" : "Activate"}
                </button>

                <button
                  onClick={() => handleDelete(seller.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {currentSellers.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                {sellers.length === 0
                  ? "No sellers found."
                  : "No matching sellers found."}
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
    </div>
  );
};

export default SellersManagement;
