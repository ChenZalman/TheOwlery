import Feed from "./feed";
import { useSignout } from "../Hooks/UseSignout.js"
import { UseSignInUp } from "../Hooks/UseSignInUp.js"
import { useNavigate, Link } from "react-router-dom";
import PostCreator from "./postCreator.js";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const ProfilePage = ({ user }) => {
  const { signOut } = useSignout();
  const { signInUp, isLoading, error } = UseSignInUp();
  const [posts, setPosts] = useState([]);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || `https://cdn.pixabay.com/photo/2012/04/18/23/36/boy-38262_1280.png`);
  const address = process.env.REACT_APP_ADDRESS;
  const port = process.env.REACT_APP_PORT;

  // For fade-in animation
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  const handleClick = async () => {
    await signInUp(user, "delete");
    signOut();
  };

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
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-6 max-w-3xl mx-auto transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
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
            border: '1px solid #ccc',
            background: 'rgba(255,255,255,0.04)',
          }}>
           
          <Feed posts={posts} profileImage={user.profileImage} userId={user.userId} />
          </div>
        </div>
      </div>

      {/* Styles */}
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

export default ProfilePage;