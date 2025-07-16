import { useState, useRef, useEffect } from "react";
import Feed from "./feed";
import { UseSignInUp } from "../Hooks/UseSignInUp";
import { useAuthContext } from "../Hooks/UseAuthContext";
import axios from "axios";
import fetchProfileImage from "../requests/getProfileImage";

export default function EditProfilePage() {
  const { user } = useAuthContext();
  const { signInUp, isLoading, error } = UseSignInUp();
  const [formData, setFormData] = useState(user);
  const [visible, setVisible] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [fetchedProfileImage, setFetchedProfileImage] = useState("");
  const profileImageInputRef = useRef(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const fetchImg = async () => {
      if (!profileImageFile && user && (user._id || user.userId)) {
        
        if (user.userId) {
          const img = await fetchProfileImage(user.userId);
          if (isMounted) setFetchedProfileImage(img);
        }
      }
    };
    fetchImg();
    return () => {
      isMounted = false;
    };
  }, [user, profileImageFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const handleProfileImageClick = () => {
    if (profileImageInputRef.current) profileImageInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profileImagePublicId = user.profileImage;
    if (profileImageFile) {
      const data = new FormData();
      data.append("file", profileImageFile);
      data.append("upload_preset", "UploadToCloud");
      data.append("folder", "profile");
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`;
      try {
        const res = await axios.post(cloudinaryUrl, data);
        profileImagePublicId = res.data.public_id;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
      }
    }
    Object.assign(user, { ...formData });
    const postsId = (user.posts || []).map((post) => post.id);
    Object.assign(user, { postsId: postsId, profileImage: profileImagePublicId });
    console.log("Updated profile:", user);
    await signInUp({ ...user }, "update");
    setProfileImageFile(null);
    setShowSavedModal(true);
    setTimeout(() => setShowSavedModal(false), 1800);
  };

  return (
    <div
      className="min-h-screen text-gold relative overflow-hidden font-serif"
      style={{ backgroundColor: "#1D1E22" }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Edit Profile
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Profile Image Upload */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Profile Image</label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                src={
                  profileImageFile
                    ? URL.createObjectURL(profileImageFile)
                    : fetchedProfileImage || "/images/noProfile.png"
                }
                alt="Profile"
                style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={handleProfileImageClick}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#7c3aed", 
                  color: "#fff",
                  border: "1px solid #7c3aed",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#6d28d9')}
                onMouseOut={e => (e.currentTarget.style.background = '#7c3aed')}
              >
                Change
              </button>
              <input
                type="file"
                accept="image/*"
                ref={profileImageInputRef}
                style={{ display: "none" }}
                onChange={handleProfileImageChange}
              />
            </div>
          </div>

          {/* Name */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <label style={labelStyle}>Password</label>
          <div style={{ display: 'flex', marginBottom: "1rem" }}>
            <input
              type={visible ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password"
              style={inputStyle}
            />
            <img
              src={visible ? "images/img_eye_on.svg" : "images/img_eye_off.svg"}
              alt="Eye"
              className="h-[24px] w-[24px]"
              onClick={() => { setVisible(!visible) }}
            />
          </div>

          {/* Birth Date */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Gender */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Bio - coming soon</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="coming soon"
              disabled={true}
              rows={4}
              style={inputStyle}
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#7c3aed", // purple-600
              color: "#fff",
              border: "1px solid #7c3aed",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1.1rem",
              transition: "background 0.2s, color 0.2s",
              marginTop: "0.5rem"
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#6d28d9')}
            onMouseOut={e => (e.currentTarget.style.background = '#7c3aed')}
          >
            Save Changes
          </button>
        </form>

        {showSavedModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}>
            <div style={{
              background: "#23272a",
              color: "#fff",
              padding: "2rem 2.5rem",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              fontSize: "1.3rem",
              fontWeight: "bold",
              textAlign: "center",
              minWidth: 220,
            }}>
              ✓ Changes Saved!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable style constants
const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "500",
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
};