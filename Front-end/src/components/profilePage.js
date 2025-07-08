import Feed from "./feed";
import { useNavigate, Link } from "react-router-dom";
import PostCreator from "./postCreator.js";
import { useAuthContext } from "../Hooks/UseAuthContext";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import fetchProfileImage from "../requests/getProfileImage";
import Filters from "./Filters";



function FriendRequestsSection({ friendRequests, accepting, refusing, actionError, handleAcceptFriend, handleRefuseFriend, address, port }) {
  const [names, setNames] = useState({});
  const [posts, setPosts] = useState([]);
      const { user } = useAuthContext();
  useEffect(() => {
    const fetchNames = async () => {
      const newNames = {};
      for (let i = 0; i < friendRequests.length; i++) {
        const fromId = friendRequests[i];
        if (!names[fromId]) {
          try {
            const res = await axios.post(`http://${address}:${port}/api/users`, {
              command: "getUserName",
              data: { userId: fromId }
            });
            newNames[fromId] = res.data.name || fromId;
          } catch (e) {
            newNames[fromId] = fromId;
          }
        }
      }
      setNames(prev => ({ ...prev, ...newNames }));
    };
    if (friendRequests.length > 0) fetchNames();
    // eslint-disable-next-line
  }, [friendRequests]);
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
  if (!friendRequests.length) return null;
  return (
    <div style={{
      background: '#23272a',
      borderRadius: '1rem',
      padding: '1rem',
      margin: '1rem 0',
      border: '1px solid #444',
    }}>
      <h2 style={{ color: '#e6c47a', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Friend Requests</h2>
      {friendRequests.map((fromId) => (
        <div key={fromId} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <span style={{ color: '#e6c47a', fontWeight: 'bold' }}>{names[fromId] || fromId}</span>
          <button
            onClick={() => handleAcceptFriend(fromId)}
            disabled={accepting === fromId}
            style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.3rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {accepting === fromId ? 'Accepting...' : 'Accept'}
          </button>
          <button
            onClick={() => handleRefuseFriend(fromId)}
            disabled={refusing === fromId}
            style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.3rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {refusing === fromId ? 'Refusing...' : 'Refuse'}
          </button>
        </div>
      ))}
      {actionError && <div style={{ color: 'red', marginTop: '0.5rem' }}>{actionError}</div>}
    </div>
  );
}
   
const ProfilePage = ({ user }) => {
  const { user: currentUser, dispatch } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [fetchedProfileImage, setFetchedProfileImage] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [accepting, setAccepting] = useState("");
  const [refusing, setRefusing] = useState("");
  const [actionError, setActionError] = useState("");
  // Filter states
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [hasImage, setHasImage] = useState("");
  // Only after pressing search
  const [pendingFilters, setPendingFilters] = useState({ month: "", day: "", year: "", hasImage: "" });
  const [searchTriggered, setSearchTriggered] = useState(false);
  
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
      const filterData = { userId: user.userId };
      if (pendingFilters.month) filterData.month = pendingFilters.month;
      if (pendingFilters.day) filterData.day = pendingFilters.day;
      if (pendingFilters.year) filterData.year = pendingFilters.year ? String(pendingFilters.year) : undefined;
      if (pendingFilters.hasImage) filterData.hasImage = pendingFilters.hasImage;
      const useFilters = !!(pendingFilters.month || pendingFilters.day || pendingFilters.year || pendingFilters.hasImage);
      const res = await axios.post(`http://${address}:${port}/api/posts`, {
        command: useFilters ? "getFiltered" : "get",
        data: filterData
      });
      // Fetch profile images for each post
      const postsWithProfile = await Promise.all(
        (res.data.posts || []).filter(post => post.userId === user.userId).map(async post => {
          let profilePicture = "/images/noProfile.png";
          try {
            profilePicture = await fetchProfileImage(post.userId);
          } catch (e) {}
          return { ...post, profilePicture };
        })
      );
      setPosts(postsWithProfile);
    };
    if (searchTriggered) {
      fetchPosts();
      setSearchTriggered(false);
    } else if (user && user.userId && posts.length === 0) {
      // Initial load
      fetchPosts();
    }
  }, [user, pendingFilters, searchTriggered]);

  // Fetch friend requests on mount
  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!user?.userId) return;
      try {
        const res = await axios.post(`http://${address}:${port}/api/users`, {
          command: "update",
          data: { userId: user.userId },
        });
        setFriendRequests(res.data.user.friendRequests || []);
      } catch (err) {
        setFriendRequests([]);
      }
    };
    fetchFriendRequests();
  }, [user]);

  // Accept friend request
  const handleAcceptFriend = async (fromUserId) => {
    setAccepting(fromUserId);
    setActionError("");
    try {
      await axios.post(`http://${address}:${port}/api/users`, {
        command: "acceptFriendRequest",
        data: { userId: user.userId, fromUserId },
      });
      setFriendRequests((prev) => prev.filter((id) => id !== fromUserId));
    } catch (err) {
      setActionError("Failed to accept friend request.");
    } finally {
      setAccepting("");
    }
  };
  // Refuse friend request
  const handleRefuseFriend = async (fromUserId) => {
    setRefusing(fromUserId);
    setActionError("");
    try {
      await axios.post(`http://${address}:${port}/api/users`, {
        command: "refuseFriendRequest",
        data: { userId: user.userId, fromUserId },
      });
      setFriendRequests((prev) => prev.filter((id) => id !== fromUserId));
    } catch (err) {
      setActionError("Failed to refuse friend request.");
    } finally {
      setRefusing("");
    }
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
          {/* Filters and Search Button */}
          <Filters
            month={month}
            onMonthChange={setMonth}
            userName={undefined}
            onUserNameChange={() => {}}
            hasImage={hasImage}
            onHasImageChange={setHasImage}
          />
          <div className="flex justify-center mb-6">
            <select
              value={day}
              onChange={e => setDay(e.target.value)}
              className="px-3 py-2 rounded border border-gold bg-[#23242a] text-gold mr-2"
              style={{ minWidth: 120 }}
            >
              <option value="">All Days</option>
              {[...Array(31)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="Year"
              className="px-3 py-2 rounded border border-gold bg-[#23242a] text-gold mr-2"
              style={{ minWidth: 100 }}
              min="1900"
              max={new Date().getFullYear()}
            />
            <button
              className="px-6 py-2 rounded bg-gold text-black font-bold transition"
              style={{ backgroundColor: '#e6c47a' }}
              onClick={() => {
                setPendingFilters({ month, day, year, hasImage });
                setSearchTriggered(true);
              }}
            >
              Search
            </button>
          </div>

          {/* Friend Requests Section */}
<FriendRequestsSection
  friendRequests={friendRequests}
  accepting={accepting}
  refusing={refusing}
  actionError={actionError}
  handleAcceptFriend={handleAcceptFriend}
  handleRefuseFriend={handleRefuseFriend}
  address={address}
  port={port}
/>

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