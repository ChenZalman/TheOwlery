

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const groupSchema = require('../models/groupSchema'); 
const userSchema = require('../models/userSchema'); 
const Group = mongoose.model('Group', groupSchema);
const User = mongoose.model('User', userSchema);  

router.post('/', async (req, res) => {
  const { command, data } = req.body;
  try {
    switch (command) {
      case 'approveJoinRequest': {
        // data: { groupId, userId }
        const { groupId, userId } = data;
        if (!groupId || !userId) {
          return res.status(400).json({ message: "Missing groupId or userId" });
        }
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        group.membersIds = group.membersIds || [];
        group.pendingRequests = group.pendingRequests || [];
        if (!group.membersIds.includes(userId)) {
          group.membersIds.push(userId);
        }
        // Sanitize both uid and userId for comparison
        function normalizeId(id) {
          if (id && typeof id === 'object' && id.$oid) id = id.$oid;
          if (typeof id === 'string' && id.endsWith('"')) id = id.slice(0, -1);
          return String(id);
        }
        const normalizedUserId = normalizeId(userId);
        group.pendingRequests = group.pendingRequests.filter(uid => normalizeId(uid) !== normalizedUserId);
        await group.save();
        return res.json({ message: "User added to group", group });
      }
      case 'disapproveJoinRequest': {
        // data: { groupId, userId }
        const { groupId, userId } = data;
        if (!groupId || !userId) {
          return res.status(400).json({ message: "Missing groupId or userId" });
        }
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        group.pendingRequests = group.pendingRequests || [];
        group.pendingRequests = group.pendingRequests.filter(uid => uid !== userId);
        await group.save();
        return res.json({ message: "Join request disapproved", group });
      }
      case 'requestJoinGroup': {
        // data: { groupId, userId }
        const { groupId, userId } = data;
        if (!groupId || !userId) {
          return res.status(400).json({ message: "Missing groupId or userId" });
        }
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        group.pendingRequests = group.pendingRequests || [];
        // Only add if not already requested or member
        if (!group.pendingRequests.includes(userId) && !group.membersIds.includes(userId)) {
          group.pendingRequests.push(userId);
          await group.save();
          return res.json({ message: "Join request sent", group });
        } else {
          return res.status(400).json({ message: "Already requested or already a member" });
        }
      }
      case 'create': {
 
        if (!data.name || !Array.isArray(data.membersIds) || !Array.isArray(data.adminIds)) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        const group = new Group({
          name: data.name,
          description: data.description || "",
          membersIds: data.membersIds,
          postsId: data.postsId || [],
          adminIds: data.adminIds,
          blockedIds: data.blockedIds || [],
          createdAt: Date.now(),
          privacy: data.isPublic === false ? "private" : "public",
        });
        const savedGroup = await group.save();
        const groupObj = savedGroup.toObject();
        groupObj.id = groupObj._id.toString();
        delete groupObj._id;
        delete groupObj.__v;
        return res.status(201).json({ message: "Group created", group: groupObj });
      }
       case 'getUserGroups': {
        if (!data.userId) {
          return res.status(400).json({ message: "Missing userId" });
        }
        
        const groups = await Group.find({ membersIds: data.userId });
        return res.status(200).json({ groups });
      }
      case 'getGroupById': {
  if (!data.groupId) {
    return res.status(400).json({ message: "Missing groupId" });
  }
  const group = await Group.findById(data.groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }
  const groupObj = group.toObject();
  groupObj.id = groupObj._id.toString();
  delete groupObj._id;
  delete groupObj.__v;
  return res.status(200).json({ group: groupObj });
}
case 'updateCoverImage': {

  const group = await Group.findByIdAndUpdate(
    data.groupId,
    { coverImage: data.coverImage },
    { new: true }
  );
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }
  return res.status(200).json({ group });
}
case 'updateDescription': {
  if (!data.groupId || typeof data.description !== "string") {
    return res.status(400).json({ message: "Missing groupId or description" });
  }
  const group = await Group.findByIdAndUpdate(
    data.groupId,
    { description: data.description },
    { new: true }
  );
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }
  return res.status(200).json({ group });
}
case 'getAllGroups': {
  const groups = await Group.find({});
  return res.status(200).json({ groups });
}
case 'createGroupPost': {
  const { text, userId, groupId, images = [], videos = [] } = data;
  if (!text || !userId || !groupId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const Post = mongoose.model('Post');
  const User = mongoose.model('User');
  const Group = mongoose.model('Group');
  const newPost = new Post({
    text,
    userId,
    likes: 0,
    images,
    videos,
    comments: [],
    createdAt: Date.now()
  });
  const savedPost = await newPost.save();


  await User.findByIdAndUpdate(userId, { $push: { postsId: savedPost._id.toString() } });

  await Group.findByIdAndUpdate(groupId, { $push: { postsId: savedPost._id.toString() } });

  const postObj = savedPost.toObject();
  postObj.id = postObj._id.toString();
  delete postObj._id;
  delete postObj.__v;

  return res.status(201).json({ message: "Post created", post: postObj });
}
case 'inviteToGroup': {
  // data: { groupId, userIds: [ ... ] }
  const { groupId, userIds } = data;
  console.log('InviteToGroup called with:', { groupId, userIds }); // Log incoming data
  if (!groupId || !Array.isArray(userIds)) {
    return res.status(400).json({ message: "Missing groupId or userIds" });
  }
  // Store pending invites in group (add a new field if not exists)
  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });
  if (!Array.isArray(group.pendingInvites)) group.pendingInvites = [];
  console.log('Before update, pendingInvites:', group.pendingInvites);
  userIds.forEach(uid => {
    const uidStr = String(uid);
    const pendingStrs = group.pendingInvites.map(String);
    const memberStrs = group.membersIds.map(String);
    console.log('Checking uid:', uidStr, 'pending:', pendingStrs, 'members:', memberStrs);
    if (!pendingStrs.includes(uidStr) && !memberStrs.includes(uidStr)) {
      group.pendingInvites.push(uidStr);
      console.log('Added to pendingInvites:', uidStr);
    } else {
      console.log('Skipped (already invited or member):', uidStr);
    }
  });
  console.log('After update, pendingInvites:', group.pendingInvites); // Debug log
  await group.save();
  return res.json({ message: "Invites sent", group });
}

case 'approveGroupInvite': {
  // data: { groupId, userId }
  const { groupId, userId } = data;
  if (!groupId || !userId) {
    return res.status(400).json({ message: "Missing groupId or userId" });
  }
  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });
  group.membersIds = group.membersIds || [];
  group.pendingInvites = group.pendingInvites || [];
  if (!group.membersIds.includes(userId)) {
    group.membersIds.push(userId);
  }
  group.pendingInvites = group.pendingInvites.filter(uid => uid !== userId);
  await group.save();
  return res.json({ message: "User added to group", group });
}

case 'rejectGroupInvite': {
  // data: { groupId, userId }
  const { groupId, userId } = data;
  if (!groupId || !userId) {
    return res.status(400).json({ message: "Missing groupId or userId" });
  }
  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });
  group.pendingInvites = group.pendingInvites || [];
  group.pendingInvites = group.pendingInvites.filter(uid => uid !== userId);
  await group.save();
  return res.json({ message: "Invitation rejected", group });
}
case 'getGroupMembers': {
  const { groupId } = data;
  if (!groupId) return res.status(400).json({ message: "Missing groupId" });
  const group=await Group.findById(groupId);
  const membersIds = group ? group.membersIds : [];
  const users = await User.find({ _id: { $in: membersIds } });
  //REMOVING SENSITIVE DATA ABOUT USER
  const usersSafe = users.map(u => {
    const obj = u.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
  });

  return res.json({ members : usersSafe });

  
}
case 'getUserInvites': {
  const { userId } = data;
  if (!userId) return res.status(400).json({ message: "Missing userId" });
  console.log('Searching for pending invites for userId:', userId); // Debug log
  const groups = await Group.find({ pendingInvites: userId });
  console.log('Found groups:', groups); // Debug log
  return res.json({ groups });
}
 
      case 'searchByText': {
        // data: { groupId, text }
        const { groupId, text } = data;
        if (!groupId || !text) {
          return res.status(400).json({ message: "Missing groupId or text" });
        }
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        const Post = mongoose.model('Post');
        // Find posts by IDs in group.postsId and text match
        const posts = await Post.find({
          _id: { $in: group.postsId },
          text: { $regex: text, $options: 'i' }
        });
        return res.json({ posts });
      }
      default: {
        return res.status(400).json({ message: "No valid command was found" });
      }
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;