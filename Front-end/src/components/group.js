import axios from "axios";
import {
  Camera,
  Eye,
  FileText,
  Globe,
  MoreHorizontal,
  Plus,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState, useMemo, use } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../Hooks/UseAuthContext";
import fetchProfileImage from "../requests/getProfileImage";
import AddCoverPhotoModal from "./popups/groupPage/addCoverPhoto";
import DescriptionModal from "./popups/groupPage/description";
import InviteFriendsModal from "./popups/groupPage/invitePeopleToGroup";
import Post from "./post";

const GroupPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("Discussion");
  const [showSetupPanel, setShowSetupPanel] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const { user } = useAuthContext();
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [members, setMembers] = useState([]);
 const address = process.env.REACT_APP_ADDRESS;
 const port = process.env.REACT_APP_PORT;
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.post(`http://${address}:${port}/api/groups`, {
          command: "getGroupById",
          data: { groupId },
        });
        setGroup(res.data.group);

        // Fetch posts for this group
        const postsRes = await axios.post(`http://${address}:${port}/api/posts`, {
          command: "getGroupPosts",
          data: { groupId },
        });
        // Fetch user names and profile pictures for each post
        const postsWithUserData = await Promise.all(
          postsRes.data.posts.map(async (post) => {
            // Fetch user name
            let userName = "Unknown";
            try {
              const userRes = await axios.post(`http://${address}:${port}/api/users`, {
                command: "getUserById",
                data: { userId: post.userId },
              });
              userName = userRes.data.user?.name || "Unknown";
            } catch (e) {}
            // Fetch profile picture
            const userProfilePicture = await fetchProfileImage(post.userId);
            return { ...post, userName, userProfilePicture };
          })
        );
        setPosts(postsWithUserData || []);
      } catch (err) {
        setGroup(null);
        setPosts([]);
      }
    };
    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user && user.userId) {
        const userProfilePicture = await fetchProfileImage(user.userId);
        setUserProfilePicture(userProfilePicture);
      }
    };
    fetchProfilePicture();
  }, [user]);

useEffect(() => {
    const fetchMembers = async () => {
      if (!groupId) return;
      try {
   
        const res = await axios.post(`http://${address}:${port}/api/groups`, {
          command: "getGroupMembers",
          data: { groupId },
        });
        const members = await Promise.all(
          res.data.members.map(async (member) => {
            const profilePicture = await fetchProfileImage(member._id);
            //console.log("memberidddddddddd", member._id);
            return { ...member, profilePicture };
          })
        );
        setMembers(members);
      } catch (err) {
        setMembers([]);
      }
    }
    fetchMembers();
  }, [groupId]);
    
  
     
  const tabs = ["Discussion", "Events", "Media", "Files", "Members"];
  const handleCreatePost = async () => {
    if (!postText.trim()) return;
    try {
      const res = await axios.post(`http://${address}:${port}/api/groups`, {
        command: "createGroupPost",
        data: {
          text: postText,
          userId: user.userId,
          groupId: groupId,
          images: [],
          videos: [],
        },
      });
      setPostText("");
      alert("Post created!");
    } catch (err) {
      alert("Failed to create post.");
    }
  };

  const magicalSparkles = useMemo(
    () => (
      <div className='absolute inset-0 pointer-events-none z-0'>
        {[...Array(8)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className='absolute text-yellow-200 text-xs opacity-60'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>
    ),
    []
  );

  if (!group) {
    return <div className='min-h-screen flex items-center justify-center text-gray-400'>Loading group...</div>;
  }
//console.log("meberssssssssss", members);

  return (
    <div className='min-h-screen text-white relative overflow-hidden' style={{ backgroundColor: "#1c1e21" }}>
      {magicalSparkles}
      {/* Header with Illustration */}
      <div className='relative h-64 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20'>
          <img
            src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/${group.coverImage}.jpg`}
            alt='Group Cover'
            className='w-full h-64 object-cover'
          />
        </div>
        {/* Edit button */}
        <button
          className='absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors'
          onClick={() => setShowCoverPicker(true)}
        >
          ✏️ Edit
        </button>
      </div>

      {/* Group Info */}
      <div className='px-6 py-4 border-b border-gray-700'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>{group.name}</h1>
            <div className='flex items-center text-gray-400 text-sm space-x-4'>
              <span className='flex items-center'>
                <Globe className='w-4 h-4 mr-1' />
                {group.isPublic ? "Public group" : "Private group"}
              </span>
              <span>•</span>
              <span>
                {group.members?.length || 1} member{(group.members?.length || 1) > 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className='flex space-x-3'>
          </div>
        </div>
      </div>
      <div className='flex'>
        {/* Main Content */}
        <div className='flex-1 max-w-4xl'>
          {/* Navigation Tabs */}
          <div className='px-6 border-b border-gray-700'>
            <div className='flex space-x-8'>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <div className='flex-1'></div>
              <button className='py-4 px-2 text-gray-400 hover:text-gray-300'>
                <Search className='w-5 h-5' />
              </button>
              <button className='py-4 px-2 text-gray-400 hover:text-gray-300'>
                <MoreHorizontal className='w-5 h-5' />
              </button>
            </div>
          </div>

          {/* Post Creation or Members List depending on tab */}
          {activeTab === "Discussion" ? (
            <div className='p-6 border-b border-gray-700'>
              <div className='flex space-x-3'>
                {userProfilePicture ? (
                  <img
                    src={userProfilePicture}
                    alt='Profile'
                    className='w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-400'
                  />
                ) : (
                  <div className='w-10 h-10 bg-gray-600 rounded-full flex-shrink-0'></div>
                )}
                <div className='flex-1'>
                  <textarea
                    placeholder='Write something...'
                    className='w-full bg-gray-800 rounded-lg p-3 resize-none text-gray-300 placeholder-gray-500 border border-gray-700 focus:border-blue-500 focus:outline-none'
                    rows='3'
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                  />
                  <div className='flex justify-end mt-2'>
                    <button
                      className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'
                      onClick={handleCreatePost}
                      disabled={!postText.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "Members" ? (
            <div className="p-6 border-b border-gray-700">
              <h3 className="font-semibold mb-4">Group Members</h3>
              {members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <div key={member._id} className="flex items-center gap-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <img
                        src={member.profilePicture || "/images/noProfile.png"}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-600"
                      />
                      <span className="text-lg font-medium text-white">{member.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400">No members found.</div>
              )}
            </div>
          ) : null}
        </div>
        {/* Group Posts */}
        <div className='p-6'>
          <h3 className='font-semibold mb-4'>Posts</h3>
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id || post._id} className='mb-6 flex justify-center'>
                <Post
                  post={{
                    userName: post.userName,
                    profilePicture: post.userProfilePicture,
                    textContent: post.text || post.textContent,
                    imagePublicId: post.images && post.images.length > 0 ? post.images[0] : null,
                    videoPublicId: post.videos && post.videos.length > 0 ? post.videos[0] : null,
                    postId: post.id || post._id,
                    likes: post.likes,
                    userId: post.userId, 
                  }}
                />
              </div>
            ))
          ) : (
            <div className='text-gray-400'>No posts yet.</div>
          )}
        </div>
        {/* Setup Panel */}
        {showSetupPanel && (
          <div className='w-80 p-6 bg-gray-800 border-l border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
              <button onClick={() => setShowSetupPanel(false)} className='text-gray-400 hover:text-gray-300'>
                ✕
              </button>
            </div>
            <div className='text-sm text-gray-400 mb-4'></div>

            <div className='space-y-4'>
              <div className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors'>
                <UserPlus className='w-5 h-5 text-gray-400' />
                <button
                  className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'
                  onClick={() => setShowInviteModal(true)}
                >
                  <UserPlus className='w-4 h-4' />
                  <span>Invite people To Join</span>
                </button>
              </div>
              <div className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors'>
                <Camera className='w-5 h-5 text-gray-400' />
                <button
                  className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'
                  onClick={() => setShowCoverPicker(true)}
                >
                  <span>Choose cover</span>
                </button>
              </div>
              <div className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors'>
                <FileText className='w-5 h-5 text-gray-400' />
                <button
                  className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'
                  onClick={() => setShowDescriptionModal(true)}
                >
                  <span>Add A description</span>
                </button>
              </div>
              <div className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors'>
                <Plus className='w-5 h-5 text-gray-400' />
                <span>Create a post</span>
              </div>
            </div>

            <div className='mt-8'>
              <h4 className='font-semibold mb-4'>About</h4>
              <div className='space-y-3'>
                <div className='flex items-start space-x-3'>
                  <Globe className='w-5 h-5 text-gray-400 mt-1' />
                  <div>
                    <div className='font-medium'>Public</div>
                    <div className='text-sm text-gray-400'>Anyone can see who's in the group and what they post.</div>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <Eye className='w-5 h-5 text-gray-400 mt-1' />
                  <div>
                    <div className='font-medium'>Visible</div>
                    <div className='text-sm text-gray-400'>Anyone can find this group.</div>
                  </div>
                </div>
              </div>
              <button className='w-full mt-4 text-center py-2 text-blue-400 hover:text-blue-300 transition-colors'>
                Learn more
              </button>
            </div>
          </div>
        )}
      </div>
      {showInviteModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <InviteFriendsModal userId={user?.userId} groupId={groupId} onClose={() => setShowInviteModal(false)} />
        </div>
      )}
      {showCoverPicker && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <AddCoverPhotoModal
            onClose={() => setShowCoverPicker(false)}
            onSave={async (url, publicId) => {
              try {
                await axios.post(`http://${address}:${port}/api/groups`, {
                  command: "updateCoverImage",
                  data: { groupId, coverImage: publicId },
                });
                setGroup((prev) => ({ ...prev, coverImage: publicId }));
              } catch (err) {
                alert("Failed to update group cover image.");
              }
              setShowCoverPicker(false);
            }}
          />
        </div>
      )}
      {showDescriptionModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <DescriptionModal
            initialValue={group.description}
            onClose={() => setShowDescriptionModal(false)}
            onSave={async (newDescription) => {
              try {
                await axios.post(`http://${address}:${port}/api/groups`, {
                  command: "updateDescription",
                  data: { groupId, description: newDescription },
                });
                setGroup((prev) => ({ ...prev, description: newDescription }));
              } catch (err) {
                alert("Failed to update group description.");
              }
              setShowDescriptionModal(false);
            }}
          />
        </div>
      )}
   
    </div>
  );
};

export default GroupPage;
