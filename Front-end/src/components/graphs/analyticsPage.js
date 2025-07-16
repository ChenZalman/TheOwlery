import { useState, useEffect } from "react";
import axios from "axios";
import BarPlot from "./barPlot";
import PieChart from "./pieChart";
import Stars from "../Stars";

const AnalyticsPage = ({ user }) => {
  const [likesData, setLikesData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [postsCount, setPostCount] = useState([]);
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const address = process.env.REACT_APP_ADDRESS;
  const port = process.env.REACT_APP_PORT;

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
      <Stars />
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
    </div>
  );
};

export default AnalyticsPage;