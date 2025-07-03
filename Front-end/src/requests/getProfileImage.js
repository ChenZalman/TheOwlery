import axios from "axios";

const address = process.env.REACT_APP_ADDRESS;
const port = process.env.REACT_APP_PORT;
const cloudName = process.env.REACT_APP_CLOUDINARY_NAME;

const defaultProfileImage = "https://res.cloudinary.com/dtdsjszuk/image/upload/noProfile_lswfza.png";

async function fetchProfileImage(userId) {
  if (!userId) return defaultProfileImage;
  const res = await axios.post(`http://${address}:${port}/api/users`, {
    command: "getProfilePicture",
    data: { userId },
  });
  let img = res.data.profilePicture;
  // console.log("[fetchProfileImage] profilePicture:", img);
  if (!img || img === "") return defaultProfileImage;
  // If it's already a URL, return as is
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  // Otherwise, treat as Cloudinary public ID
  return `https://res.cloudinary.com/${cloudName}/image/upload/${img}.jpg`;
}

export default fetchProfileImage;
