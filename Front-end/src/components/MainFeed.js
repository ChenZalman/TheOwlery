import { useMemo, useEffect, useState } from "react";
import Filters from "./Filters";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../Hooks/UseAuthContext";
import Post from "./post";
import fetchProfileImage from "../requests/getProfileImage";
import axios from "axios";
import UserInfo from "./userInfo";


const MainFeed = () => {
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
    const [userSearch, setUserSearch] = useState("");
    const [userResults, setUserResults] = useState([]);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const address = process.env.REACT_APP_ADDRESS;
    const port = process.env.REACT_APP_PORT;
    // Filter state managed here
    const [month, setMonth] = useState("");
    const [userName, setUserName] = useState("");
    const [hasImage, setHasImage] = useState("");

    // Only fetch posts when user presses search
    const [pendingFilters, setPendingFilters] = useState({ month: "", userName: "", hasImage: "" });
    const [searchTriggered, setSearchTriggered] = useState(false);

    const fetchPosts = async (filters) => {
        if (!user || !user.userId) return;
        try {
            // Only include non-empty filters
            const filterData = { userId: user.userId };
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    filterData[key] = value;
                }
            });
            const res = await axios.post(`http://${address}:${port}/api/posts`, {
                command: "getFiltered",
                data: filterData
            });
            setPosts(res.data.posts || []);
        } catch (err) {
            setPosts([]);
        }
    };

    // On mount, fetch all posts
    useEffect(() => {
        if (user && user.userId && !searchTriggered) {
            fetchPosts({ month: "", userName: "", hasImage: "" });
        }
    }, [user, address, port]);
    useEffect(() => {
        if (searchTriggered) {
            fetchPosts(pendingFilters);
            setSearchTriggered(false);
        }
    }, [searchTriggered]);

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

    // User search handler
    const handleUserSearch = async (e) => {
        setUserSearch(e.target.value);
        if (e.target.value.trim() === "") {
            setUserResults([]);
            return;
        }
        try {
            const res = await axios.post(`http://${address}:${port}/api/users`, {
                command: "searchByName",
                data: { name: e.target.value }
            });
            setUserResults(res.data.users || []);
        } catch (err) {
            setUserResults([]);
        }
    };

    return (
        <div className="min-h-screen text-gold relative overflow-hidden font-serif" style={{ backgroundColor: "#1D1E22" }}>
            <Filters
                month={month}
                onMonthChange={setMonth}
                userName={userName}
                onUserNameChange={setUserName}
                hasImage={hasImage}
                onHasImageChange={setHasImage}
            />
            <div className="flex justify-center mb-6">
                <button
                    className="px-6 py-2 rounded bg-gold text-black font-bold transition"
                    style={{ backgroundColor: '#e6c47a' }}
                    onClick={() => {
                        setPendingFilters({ month, userName, hasImage });
                        setSearchTriggered(true);
                    }}
                >
                    Search
                </button>
            </div>
            {/* User search input */}
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    value={userSearch}
                    onChange={handleUserSearch}
                    placeholder="Search  Users to see or add as friends "
                    className="px-4 py-2 rounded border border-gray-600 bg-gray-800 text-white w-80"
                />
            </div>
            {/* User search results */}
            {userResults.length > 0 && (
                <div className="flex flex-col items-center mb-8">
                    {userResults.map((u) => (
                        <button
                            key={u.userId || u._id}
                            className="text-lg text-gold hover:underline mb-2 bg-transparent border-none cursor-pointer"
                            onClick={() => { setSelectedUserId(u.userId || u._id); setShowUserInfo(true); }}
                        >
                            {u.name}
                        </button>
                    ))}
                </div>
            )}
            {magicalSparkles}
            {floatingParticles}
            <div className="flex flex-row items-start pt-24">
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
                                    date: post.createdAt,
                                }} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-xl text-gold/60 mt-20">No posts to show yet.</div>
                    )}
                </div>
            </div>
            {/* User info modal */}
            <UserInfo userId={selectedUserId} open={showUserInfo} onClose={() => setShowUserInfo(false)} />
        </div>
    );
}
 
export default MainFeed;