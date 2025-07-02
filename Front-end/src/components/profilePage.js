import Feed from "./feed";
import { useNavigate, Link } from "react-router-dom";
import PostCreator from "./postCreator.js";
import SearchBar from "./searchBar.js";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import fetchProfileImage from "../requests/getProfileImage";
const ProfilePage = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [fetchedProfileImage, setFetchedProfileImage] = useState("");
  const address = process.env.REACT_APP_ADDRESS;
  const port = process.env.REACT_APP_PORT;

  useEffect(() => {
    const fetchImg = async () => {
      if (user && ( user.userId)) {
        
        
          const img = await fetchProfileImage(user.userId);
          setFetchedProfileImage(img);
        }
    };
    fetchImg();
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.userId) return;
      const res = await axios.post(`http://${address}:${port}/api/posts`, {
        command: "get",
        data: { userId: user.userId }
      });
      // Filter posts to only those by the current user
      setPosts((res.data.posts || []).filter(post => post.userId === user.userId));
    };
    fetchPosts();
  }, [user]);

   

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

  return (
    <div className="min-h-screen text-gold relative overflow-hidden font-serif"
    style={{ backgroundColor: "#1D1E22" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Uncial+Antiqua&family=IM+Fell+English+SC&display=swap"
        rel="stylesheet"
      />
      {floatingParticles}
      {magicalSparkles}

      {/* Main content */}
      <div
        
      >
      <SearchBar/>
        <div style={{
          maxWidth: '800px',
          margin: '2rem auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          width: '100%',
        }}>
          <PostCreator />
          <div style={{
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '1rem',
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: 'rgba(255,255,255,0.04)',
          }}>
            <img
              src={fetchedProfileImage || "/images/noProfile.png"}
              alt="Profile"
              style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{user.name || `Annonymus user`}</h1>
              <p style={{ color: 'gray', marginTop: '0.25rem' }}>{user.bio || `Bio - comming soon`}</p>
            </div>
            <Link
              to={'/editprofile'}
              style={{
                background: '#7c3aed', // purple-600
                color: 'white',
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                fontSize: '1rem',
                marginLeft: 'auto',
                transition: 'background 0.2s',
                boxShadow: '0 2px 8px rgba(124,58,237,0.08)',
                display: 'inline-block',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#6d28d9')} // purple-700
              onMouseOut={e => (e.currentTarget.style.background = '#7c3aed')}
            >
              Edit User
            </Link>
          </div>

          <div style={{
            padding: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '1rem',
            border: '1px solid #ccc',
            background: 'rgba(255,255,255,0.04)',
          }}>
           
          <Feed posts={posts} profileImage={user.profileImage} userId={user.userId} />
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default ProfilePage;