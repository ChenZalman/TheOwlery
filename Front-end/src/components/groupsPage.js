import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../Hooks/UseAuthContext"; 
const GroupsPage = () => {
  const { user } = useAuthContext();  
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
 const address = process.env.REACT_APP_ADDRESS;
    const port = process.env.REACT_APP_PORT;
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.userId) {
        setGroups([]);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.post(`http://${address}:${port}/api/groups`,{
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
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-purple-900">Your Groups</h2>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupsPage;