

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../models/userSchema");
const postSchema = require("../models/postSchema");

require("dotenv").config();
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;

// Create models from schemas without registering names globally
const User = mongoose.models._User || mongoose.model("User", userSchema);
const Post = mongoose.models._Post || mongoose.model("Post", postSchema);

router.post("/", async (req, res) => {
  const { command, data } = req.body;
  

  try {
    switch (command) {
      case "sendFriendRequest": {
        const { fromUserId, toUserId } = data;
        if (!fromUserId || !toUserId) {
          return res.status(400).json({ message: "Missing fromUserId or toUserId" });
        }
        // Add toUserId's friendRequests if not already present
        const toUser = await User.findById(toUserId);
        if (!toUser) return res.status(404).json({ message: "User not found" });
        if ((toUser.friendRequests || []).includes(fromUserId)) {
          return res.json({ message: "Request already sent" });
        }
        await User.findByIdAndUpdate(toUserId, { $addToSet: { friendRequests: fromUserId } });
        return res.json({ message: "Friend request sent" });
      }

      case "acceptFriendRequest": {
        const { userId, fromUserId } = data;
        if (!userId || !fromUserId) {
          return res.status(400).json({ message: "Missing userId or fromUserId" });
        }
        // Add each other as friends
        await User.findByIdAndUpdate(userId, { $addToSet: { friendsId: fromUserId }, $pull: { friendRequests: fromUserId } });
        await User.findByIdAndUpdate(fromUserId, { $addToSet: { friendsId: userId } });
        return res.json({ message: "Friend request accepted" });
      }

      case "refuseFriendRequest": {
        const { userId, fromUserId } = data;
        if (!userId || !fromUserId) {
          return res.status(400).json({ message: "Missing userId or fromUserId" });
        }
        await User.findByIdAndUpdate(userId, { $pull: { friendRequests: fromUserId } });
        return res.json({ message: "Friend request refused" });
      }
      case "update": {
        Object.assign(data, { _id: data.userId });
        delete data["userId"];
        const updateUser = await User.findByIdAndUpdate(data._id, data, { new: true });
        if (!updateUser) {
          return res.status(404).json({ message: "user not found" });
        }
        const userObj = updateUser.toObject();
        userObj.userId = userObj._id.toString();
        delete userObj._id;
        delete userObj.__v;
        return res.json({ message: "user updated", user: userObj });
      }

      case "delete": {
        const deleteUser = await User.findByIdAndDelete(data.userId);
        if (!deleteUser) {
          return res.status(404).json({ message: "user not found" });
        }
        return res.json({ message: "user deleted" });
      }

      case "signin": {
        let newUserDB = await User.findOne({ email: data.email, password: data.password });
        if (!newUserDB) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
        newUserDB = newUserDB.toObject();
        newUserDB.userId = newUserDB._id.toString();
        delete newUserDB._id;
        delete newUserDB.__v;
        return res.json({ message: `${data.email}`, user: newUserDB });
      }

      case "signup": {
        const newUser = new User({
          name: data.name,
          email: data.email,
          password: data.password,
          friendsId: data.friendsId,
          gender: data.gender,
          birthDate: data.birthDate,
        });
        let newUserDB = await User.findOne({ email: data.email});
        if(newUserDB){
          return res.status(403).json({message: "Email in use"})
        }
        const doc = await newUser.save();
        newUserDB = doc.toObject();
        newUserDB.userId = newUserDB._id.toString();
        delete newUserDB._id;
        delete newUserDB.__v;
        return res.json({ message: "user insert", user: newUserDB });
      }

      case "getProfilePicture": {
        console.log("BACCKENDPRINT:", data);
        const { userId } = data;
        if (!userId) {
          return res.status(400).json({ message: "Missing userId" });
        }

        const objectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;

        const user = await User.findById(objectId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        let profilePictureUrl = "";
        if (user.profileImage) {
          const profileImageId = user.profileImage.trim();
          profilePictureUrl = `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/${profileImageId}`;
          
        }

        return res.json({
          message: "Profile picture retrieved",
          profilePicture: profilePictureUrl,
          hasCustomPicture: !!user.profileImage,
        });
      }

      case "likePost": {
        const { userId, postId } = data;
        console.log("post id aaaaaaaaa:", postId);
        if (!userId || !postId) {
          return res.status(400).json({ message: "Missing userId or postId" });
        }
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
        post.likes = (post.likes || 0) + 1;
        await post.save();
        await User.findByIdAndUpdate(userId, { $addToSet: { likedPosts: postId } });

        return res.json({ message: "Post liked", post });
      }

      case "unlikePost": {
        const { userId, postId } = data;
        if (!userId || !postId) {
          return res.status(400).json({ message: "Missing userId or postId" });
        }
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
        post.likes = Math.max(0, (post.likes || 0) - 1);
        await post.save();
        await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
        return res.json({ message: "Post unliked", post });
      }
      case "searchByName": {
        const { name } = data;
        if (!name || typeof name !== "string") {
          return res.status(400).json({ message: "Missing or invalid name" });
        }
        // Case-insensitive partial match
        const users = await User.find({ name: { $regex: name, $options: "i" } }, { name: 1, _id: 1 });
        // Attach userId for frontend
        const usersWithId = users.map(u => ({ ...u.toObject(), userId: u._id.toString() }));
        return res.json({ users: usersWithId });
      }
      case "getUserName": {
        const { userId } = data;
        if (!userId) {
          return res.status(400).json({ message: "Missing userId" });
        }
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.json({ name: user.name || userId });
      }
      case "getUserFriends": {
        const { userId } = data;
        if (!userId) {
          return res.status(400).json({ message: "Missing userId" });
        }
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const friends = await User.find({ _id: { $in: user.friendsId } }, { name: 1, _id: 1 });
        return res.json({ friends });
      }
      case "unfriend": {
        const { userId, friendId } = data;
        if (!userId || !friendId) {
          return res.status(400).json({ message: "Missing userId or friendId" });
        }
        // Remove from each other's friends lists
        await User.findByIdAndUpdate(userId, { $pull: { friendsId: friendId } });
        await User.findByIdAndUpdate(friendId, { $pull: { friendsId: userId } });
        
        // Get the updated user data to send back
        const updatedUser = await User.findById(friendId);
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        const userObj = updatedUser.toObject();
        userObj.userId = userObj._id.toString();
        delete userObj._id;
        delete userObj.__v;
        
        return res.json({ message: "Friend removed", user: userObj });
      }

      default: {
        return res.status(400).json({ message: "Invalid command" });
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;
