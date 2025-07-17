import axios from "axios";

const address = process.env.REACT_APP_ADDRESS;
const port = process.env.REACT_APP_PORT;
///const cloudName = process.env.REACT_APP_CLOUDINARY_NAME;

const defaultProfileImage = "https://res.cloudinary.com/dtdsjszuk/image/upload/noProfile_lswfza.png";

async function fetchProfileImage(userId) {
  if (!userId) return defaultProfileImage;
  const res = await axios.post(`http://${address}:${port}/api/users`, {
    command: "getProfilePicture",
    data: { userId },
  });
  let img = res.data.profilePicture;
  if (!img || img === "") return defaultProfileImage;
  return img;


}

export default fetchProfileImage;
