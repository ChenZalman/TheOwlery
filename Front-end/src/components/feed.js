import { useEffect, useState } from "react";
import fetchProfileImage from "../requests/getProfileImage";
import Post from "./post";

export default function Feed({ posts, userId }) {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#23272A",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id || post._id}
            post={{
              userName: post.userName,
              profilePicture: post.profilePicture || "/images/noProfile.png",
              textContent: post.text || post.textContent,
              imagePublicId: post.images && post.images.length > 0 ? post.images[0] : null,
              videoPublicId: post.videos && post.videos.length > 0 ? post.videos[0] : null,
              postId: post.id || post._id,
              userId: post.userId,  
              date: post.createdAt  
            }}
          />
        ))
      ) : (
        <div style={{ color: '#e6c47a', textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>
          No posts to show
        </div>
      )}
    </div>
  );
}
