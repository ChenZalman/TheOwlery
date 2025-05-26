const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const groupSchema = require('../models/groupSchema'); // Make sure this is the correct path
const Group = mongoose.model('Group', groupSchema);

router.post('/', async (req, res) => {
  const { command, data } = req.body;
  try {
    switch (command) {
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