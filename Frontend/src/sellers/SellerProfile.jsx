// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { FiUser, FiLock, FiShield, FiMail, FiPhone } from "react-icons/fi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    firstname: "",
    secondname: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/profile", {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setFormData({
            firstname: data.user.firstname || "",
            secondname: data.user.secondname || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    
    fetchUser();
  }, []);

  // Handle profile picture upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Update profile information
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formDataToSend = new FormData();
      if (profilePic) {
        formDataToSend.append("profile_pic", profilePic);
      }
      formDataToSend.append("firstname", formData.firstname);
      formDataToSend.append("secondname", formData.secondname);
      formDataToSend.append("phone", formData.phone);

      const res = await fetch("http://localhost:5000/update_profile", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("Profile updated successfully!");
        setUser(data.user);
      } else {
        setMessage(data.error || "Failed to update profile");
      }
    } catch (err) {
      setMessage("Error updating profile");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/update_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("Password updated successfully!");
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage(data.error || "Failed to update password");
      }
    } catch (err) {
      setMessage("Error updating password");
      console.error("Error updating password:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h2>

      {/* Tabs Navigation */}
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

      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            {preview || user.profile_pic ? (
              <img
                src={preview || `http://localhost:5000/uploads/profile_pictures/${user.profile_pic}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex items-center justify-center text-white text-3xl font-bold">
                {user.firstname?.[0]?.toUpperCase()}{user.secondname?.[0]?.toUpperCase()}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1 flex items-center">
                <FiUser className="mr-2" /> First Name
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="secondname"
                value={formData.secondname}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1 flex items-center">
              <FiMail className="mr-2" /> Email
            </label>
            <input
              type="email"
              value={formData.email}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 bg-gray-100"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1 flex items-center">
              <FiPhone className="mr-2" /> Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Account Type
            </label>
            <input
              type="text"
              value={user.account_type?.charAt(0).toUpperCase() + user.account_type?.slice(1)}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 bg-gray-100"
              disabled
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiLock className="mr-2" /> Change Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
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
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 5 characters with at least one uppercase, one lowercase, and one number
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                />
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
                  className="sr-only peer"
                  disabled
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                <span className="ml-2 text-sm text-gray-500">Coming soon</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg transition-colors"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}