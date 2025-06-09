import React, { useState, useEffect } from 'react';

export default function InviteFriendsModal({ userId, onClose , groupId }) {
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  // Fetch friends from backend
  useEffect(() => {
    const fetchFriends = async () => {
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
        setFriends(data.friends || []);
      } catch (err) {
        setFriends([]);
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
    try {
      const address = process.env.REACT_APP_ADDRESS;
      const port = process.env.REACT_APP_PORT;
      await fetch(`http://${address}:${port}/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: "inviteToGroup",
          data: { groupId, userIds: selected }
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
        {/* Left - Friend list */}
        <div className="w-1/2 p-4 overflow-y-auto border-r border-gray-700">
          <input
            type="text"
            placeholder="Search for friends by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-3 py-2 bg-gray-800 text-white rounded-md outline-none"
          />
          <div className="text-sm text-gray-400 mb-2">Suggested</div>
          <ul className="space-y-3">
            {filteredFriends.map((friend) => (
              <li
                key={friend.name}
                className="flex items-center justify-between hover:bg-gray-700 px-2 py-1 rounded"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{friend.name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selected.includes(friend.name)}
                  onChange={() => toggleSelection(friend.name)}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Right - Selected count */}
        <div className="w-1/2 p-4">
          <div className="text-gray-400 mb-2">
            {selected.length} friend{selected.length !== 1 ? 's' : ''} selected
          </div>
        </div>
      </div>

      {/* Footer */}
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
