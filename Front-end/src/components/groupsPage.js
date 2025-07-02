import { useEffect, useState } from "react";
import CreateGroupModal from "./CreateGroupModal";
import axios from "axios";
import { useAuthContext } from "../Hooks/UseAuthContext";
import { useNavigate } from "react-router-dom";

const GroupsPage = () => {
  const { user } = useAuthContext();
  const [groups, setGroups] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const address = process.env.REACT_APP_ADDRESS;
  const port = process.env.REACT_APP_PORT;

  // Fetch user's groups
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.userId) {
        setGroups([]);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.post(`http://${address}:${port}/api/groups`, {
          command: "getUserGroups",
          data: { userId: user.userId }
        });
        setGroups(res.data.groups || []);
      } catch (err) {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [user, address, port]);

  // Fetch group invites (requests)
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.userId) {
        setRequests([]);
        setLoadingRequests(false);
        return;
      }
      try {
        const res = await axios.post(`http://${address}:${port}/api/groups`, {
          command: "getUserInvites",
          data: { userId: user.userId }
        });
        console.log('Invites response:', res.data); // Debug log
        setRequests(res.data.groups || []);
      } catch (err) {
        setRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchRequests();
  }, [user, address, port]);

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const handleApprove = async (groupId) => {
    try {
      await axios.post(`http://${address}:${port}/api/groups`, {
        command: "approveGroupInvite",
        data: { groupId, userId: user.userId }
      });
      // Refresh groups and requests after approval
      // Fetch groups
      const resGroups = await axios.post(`http://${address}:${port}/api/groups`, {
        command: "getUserGroups",
        data: { userId: user.userId }
      });
      setGroups(resGroups.data.groups || []);
      // Fetch requests
      const resRequests = await axios.post(`http://${address}:${port}/api/groups`, {
        command: "getUserInvites",
        data: { userId: user.userId }
      });
      setRequests(resRequests.data.groups || []);
    } catch (err) {
      alert("Failed to approve invite.");
    }
  };

  // Add handleReject function
  const handleReject = async (groupId) => {
    try {
      await axios.post(`http://${address}:${port}/api/groups`, {
        command: "rejectGroupInvite",
        data: { groupId, userId: user.userId }
      });
      // Refresh requests after rejection
      const resRequests = await axios.post(`http://${address}:${port}/api/groups`, {
        command: "getUserInvites",
        data: { userId: user.userId }
      });
      setRequests(resRequests.data.groups || []);
    } catch (err) {
      alert("Failed to reject invite.");
    }
  };

  return (
    <div className="min-h-screen text-gold relative overflow-hidden font-serif" style={{ backgroundColor: "#1D1E22" }}>
      <div style={{ height: '60px' }}></div> {/* Spacer to push content down */}
      <h2 className="text-5xl font-extrabold mb-10 text-white text-center drop-shadow-lg">Your Groups</h2>
      <div className="flex justify-center mb-8">
        <button
          className="bg-purple-700 text-white px-6 py-2 rounded font-bold shadow hover:bg-purple-800 transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Group
        </button>
      </div>

      {/* Requests Section */}
      {loadingRequests ? (
        <div className="text-gray-500 mb-4">Loading requests...</div>
      ) : requests.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-purple-900 mb-2">Join Groups</h3>
          <ul className="space-y-2">
            {requests.map((group) => (
              <li key={group._id || group.id} className="flex justify-between items-center bg-purple-50 p-3 rounded">
                <span>{group.name}</span>
                <div>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleApprove(group._id || group.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleReject(group._id || group.id)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Groups Section */}
      {loading ? (
        <div className="text-gray-500">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="text-gray-400">No groups found.</div>
      ) : (
        <ul className="space-y-4">
          {groups.map((group) => (
            <li
              key={group._id || group.id}
              className="p-4 bg-purple-50 rounded-lg shadow flex flex-col gap-1 cursor-pointer hover:bg-purple-100 transition-colors duration-200 mx-auto w-full max-w-xs"
              onClick={() => handleGroupClick(group._id || group.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                {group.privacy && group.privacy.toLowerCase().includes('private') ? (
                  <span title="Private group" className="inline-block text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.828 0 1.5.672 1.5 1.5S12.828 14 12 14s-1.5-.672-1.5-1.5S11.172 11 12 11zm6 2V9a6 6 0 10-12 0v4M5 11h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2z" /></svg>
                  </span>
                ) : (
                  <span title="Public group" className="inline-block text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                  </span>
                )}
                <span className="font-semibold text-lg text-purple-800">{group.name}</span>
              </div>
              <span className="text-gray-600">{group.description}</span>
            </li>
          ))}
        </ul>
      )}

      {showCreateModal && (
        <CreateGroupModal
          userId={user?.userId}
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={async () => {
            // Refresh groups after creation
            try {
              const res = await axios.post(`http://${address}:${port}/api/groups`, {
                command: "getUserGroups",
                data: { userId: user.userId }
              });
              setGroups(res.data.groups || []);
            } catch (err) {
              setGroups([]);
            }
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default GroupsPage;