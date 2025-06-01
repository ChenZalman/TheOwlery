import { useState,useEffect } from "react";
import axios from "axios";
import BarPlot from "./barPlot";
import PieChart from "./pieChart";

const AnalyticsPage = ({user}) => {
    const [likesData,setLikesData] = useState([]);
    const [commentsData,setCommentsData] = useState([]);
    const [postsCount,setPostCount] = useState([]);
    const [friends,setFriends] = useState([]);
    const [posts, setPosts] = useState([]);
    const address = process.env.REACT_APP_ADDRESS;
    const port = process.env.REACT_APP_PORT;

    useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.userId) return;
      const res = await axios.post(`http://${address}:${port}/api/posts`, {
        command: "get",
        data: { userId: user.userId }
      });
      setPosts(res.data.posts || []);
    };
    const fetchFriends = async () => {
      if (!user?.userId) return;
      const res = await axios.post(`http://${address}:${port}/api/users`, {
        command: "getUserFriends",
        data: { userId: user.userId }
      });
      console.log("The friends retrived",res.data.friends)
      setFriends(res.data.friends || []);
    };
    fetchPosts();
    fetchFriends();
  }, [user]);

  useEffect(() =>{
    setLikesData(posts.filter(post => post.userId === user.userId).map(post =>({x:post.createdAt,y:post.likes})))
    setCommentsData(posts.filter(post => post.userId === user.userId).map(post =>({x:post.createdAt,y:post.comments.length})))
    setPostCount(posts.map(post => ({x:post.userId,y:'1',name:(friends.find(f => f._id === post.userId) || user).name}
            )
        )
    )
    console.log(likesData)
  },[posts])
    
    return ( 
        <div>
            <h1>
                number of Likes for posts based on days of the week
            </h1>
            <BarPlot data = {likesData}/>
            <h1>
                number of comments for posts based on days of the week
            </h1>
            <BarPlot data = {commentsData}/>
            <h1>
                number of posts per user in friends list compared to me
            </h1>
            {friends && <PieChart data = {postsCount}/>}
        </div>
     );
}
 
export default AnalyticsPage;