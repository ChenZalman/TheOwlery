import { useMemo, useEffect, useState } from "react";
import { useAuthContext } from "../Hooks/UseAuthContext";
import Post from "./post";
import fetchProfileImage from "../requests/getProfileImage";
import axios from "axios";

const MainFeed = () => {
    // Floating particles and sparkles (like home page)
    const floatingParticles = useMemo(
        () => (
            <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-gold rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                            boxShadow: "0 0 10px #e6c47a",
                        }}
                    ></div>
                ))}
            </div>
        ),
        []
    );
    const magicalSparkles = useMemo(
        () => (
            <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={`sparkle-${i}`}
                        className="absolute text-gold text-xs opacity-60"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    >
                        ✨
                    </div>
                ))}
            </div>
        ),
        []
    );

    const { user } = useAuthContext();
    const [posts, setPosts] = useState([]);
    const [postsWithUserData, setPostsWithUserData] = useState([]);
    const address = process.env.REACT_APP_ADDRESS;
    const port = process.env.REACT_APP_PORT;

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user || !user.userId) return;
            try {
                const res = await axios.post(`http://${address}:${port}/api/posts`, {
                    command: "get",
                    data: { userId: user.userId },
                });
                setPosts(res.data.posts || []);
            } catch (err) {
                setPosts([]);
            }
        };
        fetchPosts();
    }, [user, address, port]);

    useEffect(() => {
        const fetchAllProfileImages = async () => {
            const postsWithData = await Promise.all(
                posts.map(async (post) => {
                    let profilePicture = "/images/noProfile.png";
                    try {
                        profilePicture = await fetchProfileImage(post.userId);
                    } catch (e) {}
                    return {
                        ...post,
                        profilePicture,
                    };
                })
            );
            setPostsWithUserData(postsWithData);
        };
        if (posts.length > 0) fetchAllProfileImages();
        else setPostsWithUserData([]);
    }, [posts]);

    return (
        <div className="min-h-screen text-gold relative overflow-hidden font-serif" style={{ backgroundColor: "#1D1E22" }}>
            {magicalSparkles}
            {floatingParticles}
            <div className="flex flex-row items-start pt-24">
                <div className="hidden md:flex flex-col items-center justify-start w-44 min-w-[120px] mr-2">
                    <img
                        src="/images/owl.png"
                        alt="Owl"
                        className="w-32 h-32 object-contain drop-shadow-lg mt-4 mb-2"
                        style={{ filter: "drop-shadow(0 0 16px #e6c47a)" }}
                    />
                </div>
                <div className="flex-1 flex flex-col items-center ml-0 md:ml-2">
                    {postsWithUserData.length > 0 ? (
                        postsWithUserData.map((post) => (
                            <div key={post._id || post.id} className="mb-8">
                                <Post post={{
                                    userName: post.userName,
                                    profilePicture: post.profilePicture,
                                    textContent: post.text || post.textContent,
                                    imagePublicId: post.images && post.images.length > 0 ? post.images[0] : null,
                                    videoPublicId: post.videos && post.videos.length > 0 ? post.videos[0] : null,
                                    postId: post._id || post.id,
                                    likes: post.likes,
                                    userId: post.userId,
                                }} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-xl text-gold/60 mt-20">No posts to show yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
 
export default MainFeed;