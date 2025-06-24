import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import BarPlot from "./barPlot";
import PieChart from "./pieChart";

const AnalyticsPage = ({ user }) => {
  const [likesData, setLikesData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [postsCount, setPostCount] = useState([]);
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const address = process.env.REACT_APP_ADDRESS;
  const port = process.env.REACT_APP_PORT;

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

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.userId) return;
      const res = await axios.post(`http://${address}:${port}/api/posts`, {
        command: "get",
        data: { userId: user.userId },
      });
      setPosts(res.data.posts || []);
    };
    const fetchFriends = async () => {
      if (!user?.userId) return;
      const res = await axios.post(`http://${address}:${port}/api/users`, {
        command: "getUserFriends",
        data: { userId: user.userId },
      });
      setFriends(res.data.friends || []);
    };
    fetchPosts();
    fetchFriends();
  }, [user]);

  useEffect(() => {
    setLikesData(
      posts.filter((post) => post.userId === user.userId).map((post) => ({ x: post.createdAt, y: post.likes }))
    );
    setCommentsData(
      posts.filter((post) => post.userId === user.userId).map((post) => ({ x: post.createdAt, y: post.comments.length }))
    );
    setPostCount(
      posts.map((post) => ({
        x: post.userId,
        y: "1",
        name: (friends.find((f) => f._id === post.userId) || user).name,
      }))
    );
  }, [posts, friends, user]);

  return (
    <div
      className="min-h-screen text-gold relative overflow-hidden font-serif"
      style={{ backgroundColor: "#1D1E22" }}
    >
      {magicalSparkles}
      {floatingParticles}
      <div className="relative z-10 px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">
          Number of Likes for posts based on days of the week
        </h1>
        <BarPlot data={likesData} />
        <h1 className="text-2xl font-bold my-6 text-gold text-center">
          Number of comments for posts based on days of the week
        </h1>
        <BarPlot data={commentsData} />
        <h1 className="text-2xl font-bold my-6 text-gold text-center">
          Number of posts per user in friends list compared to me
        </h1>
        {friends && <PieChart data={postsCount} />}
      </div>
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-15px) translateX(8px);
          }
          50% {
            transform: translateY(-8px) translateX(-5px);
          }
          75% {
            transform: translateY(-20px) translateX(3px);
          }
        }
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsPage;