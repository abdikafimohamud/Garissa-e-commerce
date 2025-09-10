import React, { useState, useEffect } from "react";

export default function Profilee({ user, setUser }) {
  const [profileData, setProfileData] = useState({
    firstname: user?.firstname || "",
    secondname: user?.secondname || "",
    phone: user?.phone || "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [securityMode, setSecurityMode] = useState(false);
  const [message, setMessage] = useState(null);

  // password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 🔑 Fetch current profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/profile", {
          method: "GET",
          credentials: "include", // ensure session cookie is sent
        });

        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          setProfileData({
            firstname: data.user.firstname || "",
            secondname: data.user.secondname || "",
            phone: data.user.phone || "",
          });
        } else {
          setMessage({ type: "error", text: data.error || "Failed to fetch profile" });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setMessage({ type: "error", text: "Error fetching profile" });
      }
    };

    fetchProfile();
  }, [setUser]);

  // Handle file input (with preview)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Handle profile form input
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (profilePic) formData.append("profile_pic", profilePic);
      formData.append("firstname", profileData.firstname);
      formData.append("secondname", profileData.secondname);
      formData.append("phone", profileData.phone);

      const res = await fetch("http://localhost:5000/update_profile", {
        method: "POST",
        body: formData,
        credentials: "include", // 🔑 always include cookies
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setEditMode(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setProfilePic(null);
        setPreview(null);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error updating profile" });
    }
  };

  // Handle password form input
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/update_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          old_password: passwordData.oldPassword,
          new_password: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setSecurityMode(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update password" });
      }
    } catch (error) {
      console.error("Password update error:", error);
      setMessage({ type: "error", text: "Error updating password" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {/* Flash message */}
      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile picture */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={
            preview
              ? preview
              : user?.profile_pic
              ? `http://localhost:5000/uploads/profile_pictures/${user.profile_pic}`
              : "https://via.placeholder.com/100"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        {editMode && <input type="file" accept="image/*" onChange={handleFileChange} />}
      </div>

      {/* Toggle buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editMode ? "Cancel Edit" : "Edit Profile"}
        </button>
        <button
          onClick={() => setSecurityMode((prev) => !prev)}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          {securityMode ? "Cancel Password" : "Change Password"}
        </button>
      </div>

      {/* Profile update form */}
      {editMode && (
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={profileData.firstname}
            onChange={handleProfileChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="secondname"
            placeholder="Second Name"
            value={profileData.secondname}
            onChange={handleProfileChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={profileData.phone}
            onChange={handleProfileChange}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            Save Changes
          </button>
        </form>
      )}

      {/* Change password form */}
      {securityMode && (
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}
