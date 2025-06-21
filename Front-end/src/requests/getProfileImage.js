import axios from "axios";

const address = process.env.REACT_APP_ADDRESS;
const port = process.env.REACT_APP_PORT;

const defaultProfileImage = "https://res.cloudinary.com/dtdsjszuk/image/upload/noProfile_lswfza.png";

async function fetchProfileImage(userId) {
  if (!userId) return;
  const res = await axios.post(`http://${address}:${port}/api/users`, {
    command: "getProfilePicture",
    data: { userId },
  });
  console.log(res.data.profilePicture);
  return res.data.profilePicture !== undefined && res.data.profilePicture !== null && res.data.profilePicture !== ""
    ? res.data.profilePicture
    : defaultProfileImage;
}

export default fetchProfileImage;
