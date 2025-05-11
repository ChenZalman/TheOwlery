import { useState } from "react";

const Post = ({ userName, profilePicture , textContent, mediaUrl, mediaType }) => {
  const [likes, setLikes] = useState(0);
  profilePicture = `https://cdn.pixabay.com/photo/2012/04/18/23/36/boy-38262_1280.png`
  
  const handleLike = () => {
    //Here needs to update the DataBase
    setLikes((prev) => prev + 1);
  };

  return (
    <div
      style={{
        maxWidth: "400px",
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
    <img src={profilePicture} alt="picture" style={{
                // width: "100%",
                // maxHight: "50px",
                width:"50px",
                height:"50px",
                objectFit: "cover",
                borderRadius: "12px",
                borderColor:"#c1c1c1",
                border:"solid"
              }}/>
      <h2 style={{ fontSize: "20px", marginBottom: "0.75rem" }}>{userName}</h2>
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
        <button
          onClick={handleLike}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "6px 16px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Like
        </button>
      </div>
    </div>
  );
};

export default Post;