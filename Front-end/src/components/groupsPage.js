import { useEffect, useState } from "react";
import axios from "axios";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: Fetch groups from backend (adjust endpoint as needed)
    const fetchGroups = async () => {
      try {
        const res = await axios.get("/api/groups"); // Adjust if your route is different
        setGroups(res.data.groups || []);
      } catch (err) {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-purple-900">Groups</h2>
      {loading ? (
        <div className="text-gray-500">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="text-gray-400">No groups found.</div>
      ) : (
        <ul className="space-y-4">
          {groups.map((group) => (
            <li
              key={group._id || group.id}
              className="p-4 bg-purple-50 rounded-lg shadow flex flex-col gap-1"
            >
              <span className="font-semibold text-lg text-purple-800">{group.name}</span>
              <span className="text-gray-600">{group.description}</span>
              {/* Add more group info here if needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupsPage;