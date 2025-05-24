import { useAuthContext } from "../Hooks/UseAuthContext";
import { UsePost } from "../Hooks/UsePost";
import { useState } from "react";
import { UseSignInUp } from "../Hooks/UseSignInUp";

const PostCreator = () => {
  const { post, isLoading, error } = UsePost();
  const { user, loading } = useAuthContext();
  const { signInUp } = UseSignInUp();
  const [formData, setFormData] = useState({
    text: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Object.assign(formData, { userId: user.userId });
    const json = await post(formData, "create");
    const newPostId = json?.post?.id;
    if (newPostId) {
      if (user.postsId)
        Object.assign(user, { postsId: [...user.postsId, newPostId] });
      else Object.assign(user, { postsId: [newPostId] });
      signInUp({ ...user }, "update");
      setFormData({ text: "" }); // Clear input after post
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <img
            src={user.profilePicture || "/images/default-profile.png"}
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
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2 text-gray-500 text-xl">
                <span className="cursor-pointer hover:text-blue-500" title="Add Photo">📷</span>
                <span className="cursor-pointer hover:text-green-600" title="Add Video">🎥</span>
                <span className="cursor-pointer hover:text-yellow-500" title="Add Feeling">😊</span>
                <span className="cursor-pointer hover:text-pink-500" title="Tag Friends">🏷️</span>
              </div>
              <button
                type="submit"
                disabled={isLoading || !formData.text.trim()}
                className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold px-6 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 disabled:opacity-60"
              >
                {isLoading ? "Posting..." : "Post"}
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