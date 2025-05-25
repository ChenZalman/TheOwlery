import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../Hooks/UseAuthContext";
const Post = ({post}) => {
  const { userId, profilePicture , textContent, mediaUrl, mediaType,postId } = post
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [isLiked,setIsLiked] = useState(false);
    const address = process.env.REACT_APP_ADDRESS;
   const port = process.env.REACT_APP_PORT;
  const { user } = useAuthContext();

  const handleLike = async () => {
  console.log("user id:", user.userId);
  console.log("POST id:", postId);
  try {
    const command = isLiked ? 'unlikePost' : 'likePost';
    const res = await axios.post(`http://${address}:${port}/api/users`, {
      command: command,
      data: {
        userId: user.userId,
        postId: postId,
      }
    });

    if (res.status !== 200) {
      console.error("Error:", res.data.message);
    } else {
      console.log(`${command} success:`, res.data);
      setIsLiked((prev) => !prev);
      setLikes((prev) => prev + (isLiked ? -1 : 1));
    }
  } catch (err) {
    console.error("Network error:", err);
  }
};

  return (
    <div
      style={{
        width: "480px",
        margin: "0 auto",
        padding: "2rem",
        transform: "translateY(-5px)",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
    <div style={{display:`flex`, gap: "10px"}}>
    <img src={profilePicture} alt="not found" style={{
                width:"50px",
                height:"50px",
                objectFit: "cover",
                borderRadius: "12px",
                borderColor:"#c1c1c1",
                border:"solid"
              }}/>
      <h2 style={{ fontSize: "20px", marginBottom: "0.75rem" }}>{userId}</h2>
      <img src="./images/delete.svg"/>
      </div>
      <p style={{ fontSize: "16px", marginBottom: "1rem", color: "#333" }}>
        {textContent}
      </p>

      {mediaUrl && (
        <div style={{ marginBottom: "1rem" }}>
          {mediaType === "image" ? (
            <img
              src={mediaUrl}
              alt="Post media"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          ) : mediaType === "video" ? (
            <video
              controls
              style={{
                width: "100%",
                maxHeight: "300px",
                borderRadius: "12px",
              }}
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "14px", color: "#666" }}>{likes} Likes</span>
        <span style={{ fontSize: "14px", color: "#666" }}>{comments} comments</span>
        <button
          onClick={handleLike}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          aria-label="Like"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={isLiked ? "red" : "none"}
            stroke="red"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Post;