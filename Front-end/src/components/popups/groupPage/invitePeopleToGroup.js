import React, { useState, useEffect } from 'react';
import fetchProfileImage from '../../../requests/getProfileImage';

export default function InviteFriendsModal({ userId, onClose , groupId }) {
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch friends from backend
  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const address = process.env.REACT_APP_ADDRESS;
        const port = process.env.REACT_APP_PORT;
        const res = await fetch(`http://${address}:${port}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            command: "getUserFriends",
            data: { userId }
          })
        });
        const data = await res.json();
        // Fetch profile images for each friend
        const friendsWithPFP = await Promise.all(
          (data.friends || []).map(async (friend) => {
            const userPFP = await fetchProfileImage(friend.userId || friend._id);
            return { ...friend, userProfilePicture: userPFP };
          })
        );
        setFriends(friendsWithPFP);
      } catch (err) {
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [userId]);

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(search.toLowerCase())
  );
 const handleSendInvites = async () => {
    if (selected.length === 0) return;
    // Ensure all IDs are strings and log them
    const selectedStr = selected.map(id => String(id));
    console.log('Inviting userIds:', selectedStr);
    try {
      const address = process.env.REACT_APP_ADDRESS;
      const port = process.env.REACT_APP_PORT;
      await fetch(`http://${address}:${port}/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: "inviteToGroup",
          data: { groupId, userIds: selectedStr }
        })
      });
      onClose();
    } catch (err) {
      alert("Failed to send invites");
    }
  };
  return (
    <div className="w-[600px] h-[700px] bg-[#1c1e21] text-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">Invite friends to this group</h2>
       <button className="text-gray-400 hover:text-white text-lg" onClick={onClose}>×</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-4 overflow-y-auto border-r border-gray-700">
          <input
            type="text"
            placeholder="Search for friends by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-3 py-2 bg-gray-800 text-white rounded-md outline-none"
          />
          <div className="text-sm text-gray-400 mb-2">Suggested</div>
          {loading ? (
        <div className="text-gray-400">Loading friends...</div>
      ) : friends.length === 0 ? (
        <div className="text-gray-400">No friends found.</div>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto mb-4">
          {filteredFriends.map((friend) => (
            <li
              key={friend.userId || friend._id}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                selected.includes(friend.userId || friend._id)
                  ? "bg-blue-100"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => toggleSelection(friend.userId || friend._id)}
            >
              <img
                src={friend.userProfilePicture || "/images/noProfile.png"}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <span className="font-medium text-gray-800">{friend.name}</span>
              {selected.includes(friend.userId || friend._id) && (
                <span className="ml-auto text-blue-600 font-bold">✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
        </div>

         
        <div className="w-1/2 p-4">
          <div className="text-gray-400 mb-2">
            {selected.length} friend{selected.length !== 1 ? 's' : ''} selected
          </div>
        </div>
      </div>

     
      <div className="border-t border-gray-700 p-4 text-sm flex justify-between items-center bg-gray-900">
        <div className="flex items-center gap-2">
         
         
        </div>
        <div className="flex gap-3">
          <button className="text-gray-400 hover:text-white" onClick={onClose}>Cancel</button>
   <button
    className={`px-4 py-2 rounded bg-blue-600 text-white ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={selected.length === 0}
    onClick={handleSendInvites}
  >
    Send invites
  </button>
        </div>
      </div>
    </div>
  );
}
