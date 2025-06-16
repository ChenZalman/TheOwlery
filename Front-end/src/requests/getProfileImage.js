import axios from "axios";

const address = process.env.REACT_APP_ADDRESS;
const port = process.env.REACT_APP_PORT;

async function fetchProfileImage(userId) {
  if (!userId) return;
  const res = await axios.post(`http://${address}:${port}/api/users`, {
    command: "getProfilePicture",
    data: { userId },
  });
  return res.data.profilePicture;
}

export default fetchProfileImage;
