import React, { useState, useEffect } from "react";
import { FiEdit, FiSave, FiUpload } from "react-icons/fi";
import { decrypt } from "../utils/util";
const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
import Cookies from "js-cookie";

const Profile = () => {
  const id = Cookies.get("userId");
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseUrl}/user/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.details.data);
        setEditedData({
          firstName: data.details.data.firstName,
          middleName: data.details.data?.middleName || "",
          lastName: decrypt(data.details.data.lastName),
          phone: decrypt(data.details.data.phone) || "",
          countryCode: data.details.data.countryCode || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const validatePhoneNumber = () => {
    const newErrors = {};

    if (editedData.phone && !editedData.countryCode) {
      newErrors.countryCode = "Country code is required with phone number";
    }

    if (editedData.countryCode && !/^\+\d{1,4}$/.test(editedData.countryCode)) {
      newErrors.countryCode = "Invalid country code format (e.g., +1)";
    }

    if (editedData.phone && !/^\d+$/.test(editedData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validatePhoneNumber()) return;

    try {
      console.log("Saving data:", editedData);
      setIsEditing(false);
      // Temporary success message, no api added yet
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#18274A] via-[#16213D] to-[#0B1326] px-4 py-20">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_12px_40px_rgba(92,225,230,0.1)] p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white funnel-display-bold">
            Profile
          </h1>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-6 py-2 text-teal-300 rounded-3xl transition-all 
                bg-white/20 hover:bg-white/30 cursor-pointer
                font-medium flex items-center space-x-2 hover:scale-105 shadow-lg"
            >
              <FiSave className="text-lg" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-white/20 text-amber-300 rounded-3xl hover:bg-white/30 
                transition-all font-medium flex items-center space-x-2 hover:scale-105 shadow-lg cursor-pointer"
            >
              <FiEdit className="text-lg" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-teal-300/80 mx-auto">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/10 font-semibold text-amber-300 text-5xl funnel-display-reg">
                {getInitials(userData.firstName, decrypt(userData.lastName))}
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 w-full bg-black/50 text-amber-300 text-center py-2 cursor-pointer hover:bg-white/30 transition-colors">
                <FiUpload className="inline-block mr-2" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Personal Information */}
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-300 funnel-display-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={decrypt(userData.email)}
                  disabled
                  className="w-full bg-white/5 border border-white/20 rounded-2xl p-3 text-white/80 cursor-not-allowed"
                />
              </div>

              {/* First Name Input */}
              <div>
                <label className="block text-sm font-medium text-amber-300 funnel-display-sm mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={editedData.firstName}
                  onChange={(e) =>
                    setEditedData({ ...editedData, firstName: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-2xl transition-all ${
                    !isEditing
                      ? "bg-white/5 border border-white/20 text-white/50 cursor-not-allowed"
                      : "bg-white/10 border border-amber-300/60 text-white focus:outline-none focus:ring-1 focus:ring-amber-300"
                  }`}
                />
              </div>

              {/* Middle Name Input */}
              <div>
                <label className="block text-sm font-medium text-amber-300 funnel-display-sm mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={editedData.middleName}
                  onChange={(e) =>
                    setEditedData({ ...editedData, middleName: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-2xl transition-all ${
                    !isEditing
                      ? "bg-white/5 border border-white/20 text-white/50 cursor-not-allowed"
                      : "bg-white/10 border border-amber-300/60 text-white focus:outline-none focus:ring-1 focus:ring-amber-300"
                  }`}
                />
              </div>

              {/* Last Name Input */}
              <div>
                <label className="block text-sm font-medium text-amber-300 funnel-display-sm mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editedData.lastName}
                  onChange={(e) =>
                    setEditedData({ ...editedData, lastName: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-2xl transition-all ${
                    !isEditing
                      ? "bg-white/5 border border-white/20 text-white/50 cursor-not-allowed"
                      : "bg-white/10 border border-amber-300/60 text-white focus:outline-none focus:ring-1 focus:ring-amber-300"
                  }`}
                />
              </div>
            </div>

            {/* Phone Number Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-amber-300 funnel-display-reg">
                Contact Information
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-300 funnel-display-sm mb-2">
                    Country Code
                  </label>
                  <input
                    type="text"
                    placeholder="+1"
                    value={editedData.countryCode}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        countryCode: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className={`w-full p-3 rounded-2xl transition-all ${
                      !isEditing
                        ? "bg-white/5 border border-white/20 text-white/50 cursor-not-allowed"
                        : "bg-white/10 border border-amber-300/60 text-white focus:outline-none focus:ring-1 focus:ring-amber-300"
                    } ${errors.countryCode ? "border-red-500" : ""}`}
                  />
                  {errors.countryCode && (
                    <p className="text-red-500 text-sm mt-1 funnel-display-sm">
                      {errors.countryCode}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-amber-300 funnel-display-sm mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editedData.phone}
                    onChange={(e) =>
                      setEditedData({ ...editedData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full p-3 rounded-2xl transition-all ${
                      !isEditing
                        ? "bg-white/5 border border-white/20 text-white/50 cursor-not-allowed"
                        : "bg-white/10 border border-amber-300/60 text-white focus:outline-none focus:ring-1 focus:ring-amber-300"
                    } ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 funnel-display-sm">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
