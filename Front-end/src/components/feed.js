import React, { useEffect, useState } from "react";
import Post from "./post";
import axios from "axios";
 const address = process.env.REACT_APP_ADDRESS;
    const port = process.env.REACT_APP_PORT;
export default function Feed({ posts, userId }) {
    const [profilePicture, setProfilePicture] = useState("https://www.gravatar.com/avatar/");

    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (!userId) return;
            const res =await axios.post(`http://${address}:${port}/api/users`,{
                command: "getProfilePicture",
                data: { userId }
            });
            if (res.data && res.data.profilePicture) {
                setProfilePicture(res.data.profilePicture);
            }
        };
        fetchProfilePicture();
    }, [userId]);

    return (
        <div style={{
            padding: "20px",
            backgroundColor: "#f2f2f2",
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
                        profilePicture: profilePicture,
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