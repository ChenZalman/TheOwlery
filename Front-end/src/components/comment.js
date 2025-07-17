import React, { useEffect, useState } from "react";
import axios from "axios";
import fetchProfileImage from "../requests/getProfileImage";

const Comment = ({ comment }) => {
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const address = process.env.REACT_APP_ADDRESS;
  const port = process.env.REACT_APP_PORT;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!comment.userId) return;
      try {
        // Fetch user name
        const res = await axios.post(`http://${address}:${port}/api/users`, {
          command: "update", // Use update to get user by id (or create a new command for getUserById)
          data: { userId: comment.userId },
        });
        if (res.data && res.data.user) {
          setUserName(res.data.user.name || "User");
        } else {
          setUserName("User");
        }
        // Fetch profile image using  function
        const img = await fetchProfileImage(comment.userId);
        setProfilePicture(img);
      } catch (err) {
        setUserName("User");
        setProfilePicture("");
      }
    };
    fetchUserData();
  }, [comment.userId, address, port]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        marginBottom: "18px",
        padding: "12px 0",
        borderBottom: "1px solid #2d3238",
        borderRadius: "14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Profile picture */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "9999px",
          background: "#374151",
          overflow: "hidden",
          flexShrink: 0,
          border: "2px solid #23272a",
        }}
      >
        <img
          src={profilePicture || "https://ui-avatars.com/api/?name=U&background=374151&color=fff"}
          alt="Profile"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "9999px",
          }}
        />
      </div>
      {/* Comment frame */}
      <div
        style={{
          background: "#23272a",
          borderRadius: "14px",
          padding: "10px 16px",
          color: "#e5e7eb",
          fontSize: "15px",
          maxWidth: "420px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
          border: "1px solid #31343b",
        }}
      >
        <span style={{ fontWeight: 600, color: "#fff", fontSize: "15px" }}>
          {userName}
        </span>
        <span style={{ color: "#d1d5db", marginLeft: 6 }}>{comment.text}</span>
      </div>
    </div>
  );
};

export default Comment;