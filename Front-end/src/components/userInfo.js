import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fetchProfileImage from "../requests/getProfileImage";
import { useAuthContext } from "../Hooks/UseAuthContext";

const UserInfo = ({ userId, open, onClose }) => {
  const { user: currentUser } = useAuthContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [addFriendError, setAddFriendError] = useState("");
  const address = process.env.REACT_APP_ADDRESS;
  const port = process.env.REACT_APP_PORT;
 
 
  useEffect(() => {
    if (!open) return;
    const fetchUser = async () => {
      try {
        const res = await axios.post(`http://${address}:${port}/api/users`, {
          command: 'update',
          data: { userId },
        });
        let userData = res.data.user;
        if (userData && userData.userId) {
          const img = await fetchProfileImage(userData.userId);
          userData = { ...userData, profilePicture: img };
        }
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchUser();
  }, [userId, address, port, open]);
  
  // Send friend request handler
  const handleSendFriendRequest = async () => {
    setSendingRequest(true);
    setAddFriendError("");
    try {
      await axios.post(`http://${address}:${port}/api/users`, {
        command: "sendFriendRequest",
        data: { fromUserId: currentUser.userId, toUserId: userId },
      });
      setRequestSent(true);
    } catch (err) {
      setAddFriendError("Failed to send friend request.");
    } finally {
      setSendingRequest(false);
    }
  };



  // Format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    let d;
    if (typeof dateStr === 'object' && dateStr !== null && ('seconds' in dateStr)) {
      d = new Date(dateStr.seconds * 1000);
    } else if (typeof dateStr === 'number' || (typeof dateStr === 'string' && /^\d+$/.test(dateStr))) {
      const num = Number(dateStr);
      d = new Date(num < 1000000000000 ? num * 1000 : num);
    } else {
      d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) return '-';
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,25,26,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="max-w-md text-white rounded-lg shadow-lg p-8 border border-gray-700 relative" style={{ background: '#23272a', minWidth: 350 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, color: '#fff', background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>&times;</button>
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#8E7B53' }}>User Info</h2>
        {loading ? (
          <div className="text-gray-400 p-8">Loading user info...</div>
        ) : !user ? (
          <div className="text-red-400 p-8">User not found.</div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6">
              <img
                src={user.profilePicture || '/images/noProfile.png'}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-700 mb-2"
              />
              <div className="text-xl font-semibold mb-1">{user.name}</div>
            </div>
            <div className="space-y-3 text-lg">
              {/* Friend request logic */}
              {currentUser && user && currentUser.userId !== userId &&
                !(user.friendsId || []).includes(currentUser.userId) &&
                !((user.friendRequests || []).includes(currentUser.userId)) &&
                !requestSent && (
                <div className="mb-3">
                  <button
                    onClick={handleSendFriendRequest}
                    disabled={sendingRequest}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                  >
                    {sendingRequest ? "Sending..." : "Send Friend Request"}
                  </button>
                  {addFriendError && <div className="text-red-400 mt-2">{addFriendError}</div>}
                </div>
              )}
              {((user.friendRequests || []).includes(currentUser?.userId) || requestSent) && (
                <div className="mb-3 text-blue-400">Friend request sent</div>
              )}
              <div><span className="font-semibold text-gray-300">Birthdate:</span> {formatDate(user.birthDate)}</div>
              <div><span className="font-semibold text-gray-300">Gender:</span> {user.gender || '-'}</div>
              <div><span className="font-semibold text-gray-300">Number of friends:</span> {Array.isArray(user.friendsId) ? user.friendsId.length : 0}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
