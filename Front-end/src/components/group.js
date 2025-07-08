import axios from "axios";
import LockIcon from '@mui/icons-material/Lock';
import {
  Camera,
  FileText,
  Globe,
  MoreHorizontal,
  Search,
  UserPlus,
} from "lucide-react";
import { useEffect, useState, useMemo, use } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../Hooks/UseAuthContext";
import fetchProfileImage from "../requests/getProfileImage";
import AddCoverPhotoModal from "./popups/groupPage/addCoverPhoto";
import DescriptionModal from "./popups/groupPage/description";
import InviteFriendsModal from "./popups/groupPage/invitePeopleToGroup";
import Post from "./post";
import GroupPostCreator from "./GroupPostCreator";

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
  const [posts, setPosts] = useState([]);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [members, setMembers] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
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

        const postsRes = await axios.post(`http://${address}:${port}/api/posts`, {
          command: "getGroupPosts",
          data: { groupId },
        });

        const postsWithUserData = await Promise.all(
          postsRes.data.posts.map(async (post) => {
            const userProfilePicture = await fetchProfileImage(post.userId);
            return { ...post, userProfilePicture };
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
    if (group && user && Array.isArray(group.adminIds)) {
      setIsAdmin(group.adminIds.includes(user.userId));
    } else {
      setIsAdmin(false);
    }
  }, [group, user]);
useEffect(() => {
  const fetchPendingRequests = async () => {
    if (!group?.pendingRequests || !Array.isArray(group.pendingRequests) || group.pendingRequests.length === 0) {
      setPendingRequests([]);
      return;
    }
    try {
      const users = [];
      for (let userId of group.pendingRequests) {
        // Handle MongoDB ObjectId format: { $oid: "..." }
        if (userId && typeof userId === 'object' && userId.$oid) {
          userId = userId.$oid;
        }
        // Remove accidental trailing quote if present (data bug)
        if (typeof userId === 'string' && userId.endsWith('"')) {
          userId = userId.slice(0, -1);
        }
        try {
          const res = await axios.post(`http://${address}:${port}/api/users`, {
            command: "getUserName",
            data: { userId }
          });
          // Debug: log backend response
          console.log('getUserName backend response:', userId, res.data);
          let name = (res.data && typeof res.data.name === 'string') ? res.data.name : '';
          if (!name || name.trim() === '') {
            name = 'Unknown';
          }
          const profilePicture = await fetchProfileImage(userId);
          users.push({ _id: userId, name: name.trim(), profilePicture });
        } catch (err) {
          users.push({ _id: userId, name: 'Unknown', profilePicture: '' });
        }
      }
      setPendingRequests(users);
    } catch (err) {
      setPendingRequests([]);
    }
  };
  fetchPendingRequests();
}, [group?.pendingRequests]);
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
            return { ...member, profilePicture };
          })
        );
        setMembers(members);
      } catch (err) {
        setMembers([]);
      }
    };
    fetchMembers();
  }, [groupId]);

  const tabs = ["Discussion", "Events", "Media", "Members"];

  const refreshPosts = async () => {
    try {
      const postsRes = await axios.post(`http://${address}:${port}/api/posts`, {
        command: "getGroupPosts",
        data: { groupId },
      });
      const postsWithUserData = await Promise.all(
        postsRes.data.posts.map(async (post) => {
          let userName = "Unknown";
          try {
            const userRes = await axios.post(`http://${address}:${port}/api/users`, {
              command: "update",
              data: { userId: post.userId },
            });
            userName = userRes.data.user?.name || "Unknown";
          } catch (e) {}
          const userProfilePicture = await fetchProfileImage(post.userId);
          return { ...post, userName, userProfilePicture };
        })
      );
      setPosts(postsWithUserData || []);
    } catch (err) {
      setPosts([]);
    }
  };
console.log("the besttttttttt",pendingRequests);
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

  const isMember = group.membersIds && Array.isArray(group.membersIds) && user && group.membersIds.includes(user.userId);
  const isPrivate = group.privacy && group.privacy.toLowerCase().includes('private');
  const isPublic = group.privacy && group.privacy.toLowerCase().includes('public');
  const isPending = group.pendingRequests && Array.isArray(group.pendingRequests) && user && group.pendingRequests.includes(user.userId);

  const handleRequestJoin = async () => {
    try {
      await axios.post(`http://${address}:${port}/api/groups`, {
        command: "requestJoinGroup",
        data: { groupId, userId: user.userId }
      });
      setGroup((prev) => ({ ...prev, pendingRequests: [...(prev.pendingRequests || []), user.userId] }));
    } catch (err) {
      alert("Failed to request to join group.");
    }
  };

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
            <h1 className='text-5xl font-bold mb-2' style={{ color: '#8E7B53' }}>{group.name}</h1>
            <h2 className='text-1xl font-bold mb-1'>{group.description}</h2>
            <div className='flex items-center text-gray-400 text-sm space-x-4'>
              <span className='flex items-center'>
                {group.privacy && group.privacy.toLowerCase().includes('private') ? (
                  <LockIcon style={{ fontSize: 18, marginRight: 4, color: 'white', verticalAlign: 'middle' }} />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                )}
                {group.privacy && group.privacy.toLowerCase().includes('private') ? 'Private group' : 'Public group'}
              </span>
              <span>•</span>
              <span>
                {Array.isArray(group.membersIds) ? (group.membersIds.filter(Boolean).length) : 0} member{Array.isArray(group.membersIds) && group.membersIds.filter(Boolean).length !== 1 ? 's' : ''}
              </span>
            </div>
            {/* Request to Join Button */}
            {!isMember && !isPending && user && user.userId && (
              <button
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-colors"
                onClick={handleRequestJoin}
              >
                Request to Join Group
              </button>
            )}
            {!isMember && isPending && (
              <div className="mt-4 text-blue-400 font-semibold">Join request pending approval.</div>
            )}
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
          {activeTab === "Discussion" ? (
            <div className='p-6 border-b border-gray-700'>
              {isMember ? (
                <GroupPostCreator groupId={groupId} onPostCreated={refreshPosts} />
              ) : isPublic ? (
                <div className="text-gray-400 mb-4">You need to be a member to comment</div>
              ) : null}
            </div>
          ) : activeTab === "Media" ? (
            <div className="p-6 border-b border-gray-700">
              <h3 className="font-semibold mb-4">Group Images</h3>
              {/* Only show images if group is public or user is member */}
              {(isMember || isPublic) ? (
                posts && posts.some(post => post.images && post.images.length > 0) ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {posts
                        .filter(post => post.images && post.images.length > 0)
                        .flatMap(post => post.images.map((img, idx) => (
                          <div key={post.id + '-' + idx} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center cursor-pointer" onClick={() => setFullScreenImage(`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/${img}.jpg`)}>
                            <img
                              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/${img}.jpg`}
                              alt="Group Post"
                              className="object-cover w-full h-48"
                            />
                          </div>
                        )))}
                    </div>
                    {fullScreenImage && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" onClick={() => setFullScreenImage(null)}>
                        <img src={fullScreenImage} alt="Full Screen" className="max-w-full max-h-full rounded-lg shadow-lg" />
                        <button className="absolute top-8 right-8 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full px-4 py-2" onClick={e => { e.stopPropagation(); setFullScreenImage(null); }}>×</button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-400">No images found in group posts.</div>
                )
              ) : (
                <div className="text-gray-400">This group is private. Join to see media.</div>
              )}
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
          {/* Only show posts if user is member or group is public */}
          {(isMember || isPublic) ? (
            posts && posts.length > 0 ? (
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
                      date: post.createdAt  
                    }}
                  />
                </div>
              ))
            ) : (
              <div className='text-gray-400'>No posts yet.</div>
            )
          ) : (
            <div className='text-gray-400'>This group is private. Join to see posts.</div>
          )}
        </div>
        {/* Setup Panel */}
        {isAdmin && (
          <div className='w-80 p-6 bg-gray-800 border-l border-gray-700'>
            {/* Removed close X button to prevent hiding the setup panel */}
            <div className='mb-4'></div>
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
              
            </div>

            <div className='mt-8'>
              <h4 className='font-semibold mb-4'>About</h4>
              <div className='space-y-3'>
                {/* Show only the relevant privacy section */}
                {group.privacy && group.privacy.toLowerCase().includes('private') ? (
                  <div className='flex items-start space-x-3'>
                    <LockIcon className='w-5 h-5 text-gray-400 mt-1' />
                    <div>
                      <div className='font-medium'>Private</div>
                      <div className='text-sm text-gray-400'>Only members can see who's in the group and what they post.</div>
                    </div>
                  </div>
                ) : (
                  <div className='flex items-start space-x-3'>
                    <Globe className='w-5 h-5 text-gray-400 mt-1' />
                    <div>
                      <div className='font-medium'>Public</div>
                      <div className='text-sm text-gray-400'>Anyone can see who's in the group and what they post.</div>
                    </div>
                  </div>
                )}
              </div>
             {isAdmin && pendingRequests.length > 0 && (
  <div className="mt-6">
    <h4 className="font-semibold mb-2 text-yellow-300">Pending Join Requests</h4>
    <ul className="space-y-2">
      {pendingRequests.map((pendingUser) => (
        <li key={pendingUser._id} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <img src={pendingUser.profilePicture || '/images/noProfile.png'} alt="profile" className="w-8 h-8 rounded-full object-cover border border-gray-600" />
            <span>{pendingUser.name || pendingUser._id}</span>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              onClick={async () => {
                try {
                  await axios.post(`http://${address}:${port}/api/groups`, {
                    command: "approveJoinRequest",
                    data: { groupId, userId: pendingUser._id }
                  });
                  setGroup(prev => {
                    // Remove from pendingRequests and add to membersIds
                    const cleanId = typeof pendingUser._id === 'string' ? pendingUser._id : (pendingUser._id && pendingUser._id.$oid ? pendingUser._id.$oid : '');
                    return {
                      ...prev,
                      membersIds: [...(prev.membersIds || []), cleanId],
                      pendingRequests: (prev.pendingRequests || []).filter(id => {
                        let idStr = id;
                        if (id && typeof id === 'object' && id.$oid) idStr = id.$oid;
                        if (typeof idStr === 'string' && idStr.endsWith('"')) idStr = idStr.slice(0, -1);
                        return idStr !== cleanId;
                      })
                    };
                  });
                } catch (err) {
                  alert("Failed to approve join request.");
                }
              }}
            >Accept</button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              onClick={async () => {
                try {
                  await axios.post(`http://${address}:${port}/api/groups`, {
                    command: "disapproveJoinRequest",
                    data: { groupId, userId: pendingUser._id }
                  });
                  setGroup(prev => ({
                    ...prev,
                    pendingRequests: prev.pendingRequests.filter(id => id !== pendingUser._id)
                  }));
                } catch (err) {
                  alert("Failed to disapprove join request.");
                }
              }}
            >Refuse</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
)}
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
