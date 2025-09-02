// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { FiUser, FiLock, FiShield } from "react-icons/fi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // profile | security

  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    twoFactor: false,
  });

  // ✅ Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/get_current_user", {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Handle profile picture upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Update profile (name, email, picture)
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }
    formData.append("fullname", user?.fullname || "");
    formData.append("email", user?.email || "");

    try {
      const res = await fetch("http://localhost:5000/update_profile", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      alert("Profile updated successfully!");
      setUser(data);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // ✅ Handle security form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Save security settings
  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/update_security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert(data.message || "Security settings updated!");
    } catch (err) {
      console.error("Error updating security:", err);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h2>

      {/* ✅ Tabs Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "profile"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "security"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
      </div>

      {/* ✅ Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            {preview || user.profile_pic ? (
              <img
                src={preview || user.profile_pic}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex items-center justify-center text-white text-3xl font-bold">
                {(user.fullname || "")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
            <label className="mt-4 cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
              Upload Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={user.fullname || ""}
              onChange={(e) => setUser({ ...user, fullname: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={user.email || ""}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* ✅ Security Tab */}
      {activeTab === "security" && (
        <form onSubmit={handleSaveSecurity} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiLock className="mr-2" /> Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 8 characters with at least one number
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1 flex items-center">
                  <FiShield className="mr-2" /> Two-Factor Authentication
                </h2>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="twoFactor"
                  checked={formData.twoFactor}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Update Security
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
