import React, { useEffect, useState } from "react";
import Post from "./post";
import axios from "axios";
 const address = process.env.REACT_APP_ADDRESS;
    const port = process.env.REACT_APP_PORT;
export default function Feed({ posts, userId }) {
    const [profileImage, setProfileImage] = useState("noProfile_lswfza");//default fron cloudinary

    useEffect(() => {
        const fetchProfileImage = async () => {
            if (!userId) return;
            const res =await axios.post(`http://${address}:${port}/api/users`,{
                command: "getProfilePicture",
                data: { userId }
            });
            if (res.data && res.data.profilePicture) {
                setProfileImage(res.data.profilePicture);
                console.log("Pdata:",res.data.profilePicture);
              
            }
        };
        fetchProfileImage();
    }, [userId]);
console.log("Profile Image:", profileImage); 
 
console.log("userId:", userId);
  
    return (
        <div style={{
            padding: "20px",
            backgroundColor: "#23272A",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
        }}>
            {posts && posts.length > 0 ? posts.map((post) => (
                <Post
                    key={post.id || post._id}
                    post={{
                        userName: post.userName,
                        profilePicture: profileImage,
                        textContent: post.text || post.textContent,
                        imagePublicId: post.images && post.images.length > 0 ? post.images[0] : null,
                        videoPublicId: post.videos && post.videos.length > 0 ? post.videos[0] : null,
                        postId: post.id || post._id,
                    }}
                />
            )) : (
                <Post post={{ textContent: "Nothing to show. Create a post to share!" }} />
            )}
        </div>
    );
} 