import Feed from "./feed";
import { useSignout } from "../Hooks/UseSignout.js"
import { UseSignInUp } from "../Hooks/UseSignInUp.js"
import { useNavigate, Link } from "react-router-dom";
import PostCreator from "./postCreator.js";
import { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = ({ user }) => {
  const { signOut } = useSignout();
  const { signInUp, isLoading, error } = UseSignInUp();
  const [posts, setPosts] = useState([]);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || `https://cdn.pixabay.com/photo/2012/04/18/23/36/boy-38262_1280.png`);
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
    fetchPosts();
  }, [user]);

  const handleClick = async () => {
    await signInUp(user, "delete");
    signOut();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PostCreator />
      <div style={{
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '1rem',
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <img
          src={profilePicture}
          alt="Profile"
          style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{user.name || `Annonymus user`}</h1>
          <p style={{ color: 'gray', marginTop: '0.25rem' }}>{user.bio || `Bio - comming soon`}</p>
        </div>
        <Link to={'/editprofile'}>edit user</Link>
      </div>

      <div style={{
        padding: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '1rem',
        border: '1px solid #ccc'
      }}>
        <Feed posts={posts} />
      </div>
    </div>
  );
};

export default ProfilePage;