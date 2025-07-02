import { useState } from "react";
import InviteFriendsModal from "./popups/groupPage/invitePeopleToGroup";

const CreateGroupModal = ({ userId, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState(null);
  const address = process.env.REACT_APP_ADDRESS;
  const port = process.env.REACT_APP_PORT;

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    try {
      // Create group
      const res = await fetch(`http://${address}:${port}/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: "create",
          data: {
            name: groupName,
            membersIds: [userId],
            adminIds: [userId],
            isPublic,
          },
        }),
      });
      const data = await res.json();
      if (data.group && data.group.id) {
        setCreatedGroupId(data.group.id);
        if (onGroupCreated) onGroupCreated(data.group); // This will refresh groups page
      }
    } catch (err) {
      alert("Failed to create group");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg p-8 w-full max-w-md relative text-white shadow-2xl border border-neutral-700">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>×</button>
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Create New Group</h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Group Name</label>
          <input
            type="text"
            className="w-full border border-neutral-600 bg-neutral-900 text-white rounded px-3 py-2 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Group Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="accent-purple-500 bg-neutral-900 border-neutral-600"
              />
              <span className="text-gray-200">Public</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="accent-purple-500 bg-neutral-900 border-neutral-600"
              />
              <span className="text-gray-200">Private</span>
            </label>
          </div>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold w-full mt-2"
          onClick={() => setShowInviteModal(true)}
        >
          Invite People
        </button>
        <button
          className="bg-purple-700 text-white px-6 py-2 rounded font-bold w-full mt-2"
          onClick={handleCreate}
          disabled={!groupName.trim()}
        >
          Save Group
        </button>
      </div>
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <InviteFriendsModal
            userId={userId}
            groupId={createdGroupId}
            onClose={() => setShowInviteModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CreateGroupModal;
