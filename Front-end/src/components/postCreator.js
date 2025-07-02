import { useAuthContext } from "../Hooks/UseAuthContext";
import { UsePost } from "../Hooks/UsePost";
import  { useState, useRef, useEffect } from "react";
import { UseSignInUp } from "../Hooks/UseSignInUp";
import axios from "axios";
import Picker from "@emoji-mart/react";
import fetchProfileImage from "../requests/getProfileImage";
const CLOUDINARY_Name = process.env.REACT_APP_CLOUDINARY_NAME;
//console.log("CLOUDINARY_Name:", CLOUDINARY_Name);


const PostCreator = () => {
  const { post, isLoading, error } = UsePost();
  const { user } = useAuthContext();
  const { signInUp } = UseSignInUp();
  const [formData, setFormData] = useState({ text: "" });
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // image or video
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState("");
const addEmoji = (emoji) => {
  setFormData((prev) => ({
    ...prev,
    text: prev.text + (emoji.native || ""),
  }));
  setShowEmojiPicker(false);
};
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const handleImageIconClick = () => {
    if (imageInputRef.current) imageInputRef.current.click();
  };

  const handleVideoIconClick = () => {
    if (videoInputRef.current) videoInputRef.current.click();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const handleFileChange = (e, type) => {
  setMedia(e.target.files[0]);
  setMediaType(type); 
};
const handleSubmit = async (e) => {
  e.preventDefault();
  let images = [];
  let videos = [];
  if (media) {
    setUploading(true);
    const data = new FormData();
    data.append("file", media);
    data.append("upload_preset", "UploadToCloud");  
    data.append("folder", "posts");
    let cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_Name}/${mediaType === "video" ? "video" : "image"}/upload`;
    try {
      const res = await axios.post(cloudinaryUrl, data);
      const publicId = res.data.public_id; 
      if (mediaType === "image") images = [publicId];
      if (mediaType === "video") videos = [publicId];
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
    }
    setUploading(false);
  }
  const postData = {
    text: formData.text,
    userId: user.userId,
    images,
    videos,
  };
  const json = await post(postData, "create");
  console.log(json)
  const newPostId = json?.id;
  if (newPostId) {
    if (user.postsId)
      Object.assign(user, { postsId: [...user.postsId, newPostId] });
    else Object.assign(user, { postsId: [newPostId] });
    signInUp({ ...user }, "update");
    setFormData({ text: "" });
    setMedia(null);
    setMediaType(null);
  }
};
useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user && user.userId) {
        const userProfilePicture = await fetchProfileImage(user.userId);
        setUserProfilePicture(userProfilePicture);
      }
    };
    fetchProfilePicture();
  }, [user]);

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <img
            src={userProfilePicture || "/images/default-profile.png"}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover border border-gray-300"
          />
          <div className="flex-1">
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder={`What's on your mind, ${user.userName || "wizard"}?`}
              className="w-full min-h-[60px] resize-none border-none focus:ring-0 text-lg bg-gray-100 rounded-lg p-3 mb-2"
              maxLength={500}
              required
            />
            {/* Hidden file inputs */}
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "image")}
            />
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "video")}
            />
            {/* Emoji Picker */}
            {showEmojiPicker && (
  <div style={{ position: "absolute", zIndex: 10 }}>
    <Picker onEmojiSelect={addEmoji} />
  </div>
)}
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2 text-gray-500 text-xl">
                <span
                  className="cursor-pointer hover:text-blue-500"
                  title="Add Photo"
                  onClick={handleImageIconClick}
                >
                  📷
                </span>
                <span
                  className="cursor-pointer hover:text-green-600"
                  title="Add Video"
                  onClick={handleVideoIconClick}
                >
                  🎥
                </span>
                <span
                  className="cursor-pointer hover:text-yellow-500"
                  title="Add Feeling"
                  onClick={() => setShowEmojiPicker((v) => !v)}
                >
                  😊
                </span>
              </div>
              <button
                type="submit"
                disabled={isLoading || !formData.text.trim() || uploading}
                className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold px-6 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 disabled:opacity-60"
              >
                {uploading ? "Uploading..." : isLoading ? "Posting..." : "Post"}
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostCreator;