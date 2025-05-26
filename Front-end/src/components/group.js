
import { Users, Share2, Search, MoreHorizontal, Heart, MessageCircle, Camera, UserPlus, FileText, Plus, Globe, Eye } from 'lucide-react';
 import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import InviteFriendsModal from "./popups/groupPage/invitePeopleToGroup";
import AddCoverPhotoModal from "./popups/groupPage/addCoverPhoto";
import { useAuthContext } from "../Hooks/UseAuthContext";  
import axios from "axios";
const GroupPage = () => {
const { groupId } = useParams();
const [group, setGroup] = useState(null);
const [activeTab, setActiveTab] = useState('Discussion');  const [showSetupPanel, setShowSetupPanel] = useState(true);
const [liked, setLiked] = useState(false);
const [showInviteModal, setShowInviteModal] = useState(false);
const [showCoverPicker,setShowCoverPicker] = useState(false);
const { user } = useAuthContext();  
const tabs = ['Discussion', 'Events', 'Media', 'Files', 'People'];
useEffect(() => {
   const fetchGroup = async () => {
    try {
       const address = process.env.REACT_APP_ADDRESS;
       const port = process.env.REACT_APP_PORT;
       const res = await axios.post(`http://${address}:${port}/api/groups`, {
         command: "getGroupById",
          data: { groupId }
       });
      setGroup(res.data.group);
     } catch (err) {
        setGroup(null);
      }
    };
    fetchGroup();
 }, [groupId]);
 if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading group...
      </div>
    );
  }

  return (
  <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: "#1c1e21" }}>
    {/* Sparkle and Particle Effects */}
    <div className="absolute inset-0 pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            boxShadow: "0 0 10px #e6c47a",
          }}
        ></div>
      ))}
    </div>
    <div className="absolute inset-0 pointer-events-none z-0">
      {[...Array(8)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute text-yellow-200 text-xs opacity-60"
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
      {/* Header with Illustration */}
      <div className="relative h-64 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20">
         <img
    src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/${group.coverImage}.jpg`}
    alt="Group Cover"
    className="w-full h-64 object-cover"
  />
        
        </div>
       

        {/* Edit button */}
        <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">
          ✏️ Edit
        </button>
      </div>

          {/* Group Info */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            <div className="flex items-center text-gray-400 text-sm space-x-4">
              <span className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                {group.isPublic ? "Public group" : "Private group"}
              </span>
              <span>•</span>
              <span>{group.members?.length || 1} member{(group.members?.length || 1) > 1 ? "s" : ""}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <UserPlus className="w-4 h-4" />
              <span>Invite</span>
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          {/* Navigation Tabs */}
          <div className="px-6 border-b border-gray-700">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <div className="flex-1"></div>
              <button className="py-4 px-2 text-gray-400 hover:text-gray-300">
                <Search className="w-5 h-5" />
              </button>
              <button className="py-4 px-2 text-gray-400 hover:text-gray-300">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Post Creation */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <textarea
                  placeholder="Write something..."
                  className="w-full bg-gray-800 rounded-lg p-3 resize-none text-gray-300 placeholder-gray-500 border border-gray-700 focus:border-blue-500 focus:outline-none"
                  rows="3"
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                      <span className="text-blue-500 bg-blue-500/20 rounded px-2 py-1 text-sm">📝</span>
                      <span className="text-sm">Anonymous Post</span>
                    </button>
                    <button className="flex items-center space-x-2 text-orange-400 hover:text-orange-300">
                      <span className="text-orange-500 bg-orange-500/20 rounded px-2 py-1 text-sm">📊</span>
                      <span className="text-sm">Poll</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">Featured</h3>
                <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">1 new</span>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm">Add</button>
            </div>
          </div>

          {/* Group Creation Post */}
          <div className="p-6">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold">Tami Mesengiser</span>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">Admin</span>
                  <span className="text-gray-400 text-sm">created the group</span>
                  <span className="font-semibold">hh</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">Just now • 🌍</p>
                
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center space-x-2 ${liked ? 'text-red-400' : 'text-gray-400'} hover:text-red-300 transition-colors`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>Comment</span>
                  </button>
                </div>

                <div className="mt-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex-shrink-0"></div>
                  <input
                    type="text"
                    placeholder="Write a public comment..."
                    className="flex-1 bg-transparent text-gray-300 placeholder-gray-500 outline-none"
                  />
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-300">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Setup Panel */}
        {showSetupPanel && (
          <div className="w-80 p-6 bg-gray-800 border-l border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Finish setting up your group</h3>
              <button 
                onClick={() => setShowSetupPanel(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-400 mb-4">
              <span className="text-orange-400 font-semibold">0 of 4</span> steps completed
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Continue adding key details and start engaging with your community.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                <UserPlus className="w-5 h-5 text-gray-400" />
               <button
  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
  onClick={() => setShowInviteModal(true)}
>
  <UserPlus className="w-4 h-4" />
  <span>Invite people To Join</span>
</button>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                <Camera className="w-5 h-5 text-gray-400" />
                <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                onClick={() => setShowCoverPicker(true)}
                
                
                >
                
  <          span>Choose cover</span>
                </button>

              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                <FileText className="w-5 h-5 text-gray-400" />
                <span>Add a description</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                <Plus className="w-5 h-5 text-gray-400" />
                <span>Create a post</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold mb-4">About</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium">Public</div>
                    <div className="text-sm text-gray-400">Anyone can see who's in the group and what they post.</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium">Visible</div>
                    <div className="text-sm text-gray-400">Anyone can find this group.</div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 text-center py-2 text-blue-400 hover:text-blue-300 transition-colors">
                Learn more
              </button>
            </div>
          </div>
        )}
      </div>
      {showInviteModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <InviteFriendsModal
      userId={user?.userId}
      onClose={() => setShowInviteModal(false)}
    />
    
  
  </div>
)}
{showCoverPicker && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <AddCoverPhotoModal
      onClose={() => setShowCoverPicker(false)}
      onSave={async (url, publicId) => {
        // Update group with new coverImage publicId
        try {
          const address = process.env.REACT_APP_ADDRESS;
          const port = process.env.REACT_APP_PORT;
          await axios.post(`http://${address}:${port}/api/groups`, {
            command: "updateCoverImage",
            data: { groupId, coverImage: publicId }
          });
          // Optionally update local state to reflect the new cover image
          setGroup((prev) => ({ ...prev, coverImage: publicId }));
        } catch (err) {
          alert("Failed to update group cover image.");
        }
        setShowCoverPicker(false);
      }}
    />
  </div>
)}
    </div>
  );
};

export default GroupPage;