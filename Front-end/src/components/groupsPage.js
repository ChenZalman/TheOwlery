import { useEffect, useState } from "react";
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
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Your Groups</h2>

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
              className="p-4 bg-purple-50 rounded-lg shadow flex flex-col gap-1 cursor-pointer hover:bg-purple-100 transition-colors duration-200"
              onClick={() => handleGroupClick(group._id || group.id)}
            >
              <span className="font-semibold text-lg text-purple-800">{group.name}</span>
              <span className="text-gray-600">{group.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupsPage;