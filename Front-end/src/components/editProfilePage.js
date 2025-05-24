import { useState } from "react";
import Feed from "./feed";
import { UseSignInUp } from "../Hooks/UseSignInUp";

export default function EditProfilePage({user}) {
  const {signInUp,isLoading,error} = UseSignInUp()
  const [formData, setFormData] = useState(user);
  const [visible,setVisible] = useState(false)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Object.assign(user,{...formData})
    const postsId = user.posts.map((post) => post.id)
    Object.assign(user,{postsId:postsId})
    console.log("Updated profile:", user);
    await signInUp({...user},"update")
  };

 return (
  <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem" }}>
    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
      Edit Profile
    </h1>
    <form onSubmit={handleSubmit}>
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
      <div style={{display:'flex', marginBottom: "1rem" }}>
        <input
          type={visible ? 'text': 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New password"
          style={inputStyle}
        />
        <img src={visible ? "images/img_eye_on.svg" : "images/img_eye_off.svg"} alt="Eye" className="h-[24px] w-[24px]"  onClick={() => {setVisible(!visible)}}/>
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
          backgroundColor: "#4F46E5",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Save Changes
      </button>
    </form>

    <Feed posts={user.posts} />
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