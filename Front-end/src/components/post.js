import axios from "axios";
import { Edit2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthContext } from "../Hooks/UseAuthContext";
import Comment from "./comment";
import { useNavigate } from 'react-router-dom';
import UserInfo from './userInfo';
import { UseSignInUp } from "../Hooks/UseSignInUp";

const CLOUDINARY_NAME = process.env.REACT_APP_CLOUDINARY_NAME;

// Helper to build Cloudinary URL from public_id
function getCloudinaryUrl(publicId, resourceType = "image", format = "jpg") {
  if (!publicId) return null;
  return `https://res.cloudinary.com/${CLOUDINARY_NAME}/${resourceType}/upload/${publicId}.${format}`;
}

const Post = ({ post }) => {
  const { userName, profilePicture, textContent, imagePublicId, videoPublicId, postId, userId, date } = post;
  // Format date 
  let formattedDate = "";
  if (date) {
    const d = new Date(date);
    formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  
  }

  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(textContent || "");
  const address = process.env.REACT_APP_ADDRESS;
  const port = process.env.REACT_APP_PORT;
  const { user, dispatch } = useAuthContext(); // Add dispatch to update user context
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [postUserName, setPostUserName] = useState("");
  const [showUserInfo, setShowUserInfo] = useState(false);
  const { signInUp } = UseSignInUp();
  const navigate = useNavigate();

  // Fetch the post user's name by userId
  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId) return;
      try {
        const res = await axios.post(`http://${address}:${port}/api/users`, {
          command: "update", // Use update to get user by id (or create a new command for getUserById)
          data: { userId },
        });
        if (res.data && res.data.user && res.data.user.name) {
          setPostUserName(res.data.user.name);
        }
      } catch (err) {
        setPostUserName("");
      }
    };
    fetchUserName();
  }, [userId, address, port]);

  useEffect(() => {
    if (user && Array.isArray(user.likedPosts)) {
      setIsLiked(user.likedPosts.includes(postId));
      console.log(`postId: ${postId} is in user's list: ${user.likedPosts.includes(postId)}`)
    }
  }, [user, postId]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axios.post(`http://${address}:${port}/api/posts`, {
          command: "getPostById",
          data: { postId },
        });
        if (res.data && res.data.post && typeof res.data.post.likes === "number") {
          setLikes(res.data.post.likes);
        }
      } catch (err) {
        console.error("Failed to fetch likes:", err);
        console.log(" number of likes:", likes);
      }
    };
    fetchLikes();
  }, [postId]);

  const handleLike = async () => {
    try {
      const command = isLiked ? "unlikePost" : "likePost";
      const res = await axios.post(`http://${address}:${port}/api/users`, {
        command: command,
        data: {
          userId: user.userId,
          postId: postId,
        },
      });

      if (res.status !== 200) {
        console.error("Error:", res.data.message);
      } else {
        setIsLiked((prev) => !prev);

        // Update likes from backend response
        if (res.data && res.data.post && typeof res.data.post.likes === "number") {
          setLikes(res.data.post.likes);
        }

        const updatedUser = { ...user };
        if (isLiked) {
          // filters postId out of likedPosts array
          updatedUser.likedPosts = user.likedPosts.filter((id) => id !== postId);
        } else {
          // Add postId to likedPosts array
          updatedUser.likedPosts = [...(user.likedPosts || []), postId];
        }

        dispatch({ type: "LOGIN", payload: updatedUser });
        localStorage.setItem("user", JSON.stringify(updatedUser)) //Saves the updated user to local storage in addition to the DB user
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`http://${address}:${port}/api/posts`, {
        command: "addComment",
        data: {
          postId,
          userId: user.userId,
          text: commentText,
        },
      });
      setCommentText("");
      setShowCommentInput(false);

      // Refresh comments after adding
      fetchComments();
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.post(`http://${address}:${port}/api/posts`, {
        command: "getCommentsByPostId",
        data: { postId },
      });
      if (res.data && Array.isArray(res.data.comments)) {
        setCommentsList(res.data.comments);
        setComments(res.data.comments.length);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(textContent);
  };

  const handleEditSave = async () => {
    try {
      await axios.post(`http://${address}:${port}/api/posts`, {
        command: "update",
        data: {
          postId,
          text: editText,
        },
      });
      setIsEditing(false);
      window.location.reload(); 
    } catch (err) {
      alert("Failed to update post");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(`http://${address}:${port}/api/posts`, {
        command: "delete",
        data: {
          postId,
          text: editText,
        },
      });
      setIsEditing(false);
      
      window.location.reload(); 
    } catch (err) {
      alert("Failed to update post");
    }
  };

  const imageUrl = getCloudinaryUrl(imagePublicId, "image", "jpg");
  const videoUrl = getCloudinaryUrl(videoPublicId, "video", "mp4");

  const isOwner = user && user.userId && userId && user.userId === userId;

  return (
    <>
      <div
        style={{
          width: "480px",
          margin: "0 auto",
          padding: "2rem",
          transform: "translateY(-5px)",
          backgroundColor: "#23272a",
          border: "1px solid #374151",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
          color: "#e5e7eb",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <img
            src={profilePicture}
            alt='Profile'
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "9999px",
              background: "#4b5563",
              cursor: "pointer"
            }}
            onClick={() => setShowUserInfo(true)}
          />
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, paddingRight: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "20px", marginBottom: 0, fontWeight: "bold", color: "#8E7B53", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>{postUserName || userName}</h2>
              {formattedDate && (
                <span style={{ fontSize: "13px", color: "#fff", marginLeft: "8px", whiteSpace: "nowrap", background: "#23242a", padding: "2px 8px", borderRadius: "6px" }}>{formattedDate}</span>
              )}
            </div>
          </div>
          <div style={{display: "flex", alignItems: "flex-right", marginLeft: "auto", gap: "10px"}}>
            {isOwner && !isEditing && (
              <button
                onClick={handleEdit}
                style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "auto" }}
                aria-label="Edit Post"
              >
                <Edit2 color="#fff" size={20} />
              </button>)}
            {isOwner && !isEditing && (
              <button
                onClick={handleDelete}
                style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "auto" }}
                aria-label="Delete Post"
              >
                <Trash2 color="#fff" size={20} />
              </button>)}  
          </div>
        </div>
        {isEditing ? (
          <div style={{ marginBottom: "1rem" }}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{ width: "100%", minHeight: "60px", borderRadius: "8px", border: "1px solid #374151", background: "#1f2937", color: "#e5e7eb", padding: "8px" }}
            />
            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
              <button
                onClick={handleEditSave}
                style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer" }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{ background: "#374151", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: "16px", marginBottom: "1rem", color: "#d1d5db" }}>{textContent}</p>
        )}

        {imageUrl && (
          <div style={{ marginBottom: "1rem" }}>
            <img
              src={imageUrl}
              alt='Post media'
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          </div>
        )}

        {videoUrl && (
          <div style={{ marginBottom: "1rem" }}>
            <video
              controls
              style={{
                width: "100%",
                maxHeight: "300px",
                borderRadius: "12px",
              }}
            >
              <source src={videoUrl} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <span style={{ fontSize: "14px", color: "#9ca3af" }}>{likes} Likes</span>
          <span style={{ fontSize: "14px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px" }}>
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#9ca3af'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              style={{ marginRight: "4px" }}
            >
              <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
            </svg>
            {comments} comments
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleLike}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label='Like'
            >
              <svg
                width='28'
                height='28'
                viewBox='0 0 24 24'
                fill={isLiked ? "red" : "none"}
                stroke='red'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
              </svg>
            </button>
            <button
              onClick={() => setShowCommentInput((prev) => !prev)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#60a5fa",
                fontSize: "16px",
              }}
              aria-label='Comment'
            >
              Comment
            </button>
          </div>
        </div>

        {showCommentInput && (
          <div style={{ marginTop: "1rem" }}>
            <input
              type='text'
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder='Write a comment...'
              style={{
                width: "80%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#1f2937",
                color: "#e5e7eb",
                marginRight: "8px",
              }}
            />
            <button
              onClick={handleComment}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Post
            </button>
          </div>
        )}

        {/* show comments below the post */}
        {commentsList.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            {commentsList.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>
        )}
      </div>
      <UserInfo userId={userId} open={showUserInfo} onClose={() => setShowUserInfo(false)} />
    </>
  );
};

export default Post;
