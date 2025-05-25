const express = require('express')
const router = express.Router()
const userSchema = require('../models/userSchema')
const mongoose = require('mongoose')
const User = mongoose.model('User', userSchema)
require('dotenv').config();
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
router.post('/', async (req, res) => {
    const { command, data } = req.body;
    console.log(`command is: ${command} and data is: ${JSON.stringify(data)}`)
    
    try {
        switch (command) {
            case 'update': {
                Object.assign(data, { _id: data.userId })
                delete data['userId']
                const updateUser = await User.findByIdAndUpdate(data._id, data, { new: true })
                Object.assign(updateUser, { userId: updateUser._id.toString() })
                delete updateUser['_id']
                delete updateUser['__v']
                if (!updateUser) {
                    return res.status(404).json({ message: 'user not found' })
                }
                return res.json({ message: 'user updated', user: updateUser })
            }
            
            case 'delete': {
                const deleteUser = await User.findByIdAndDelete(data.userId)
                if (!deleteUser) {
                    return res.status(404).json({ message: 'user not found' })
                }
                return res.json({ message: 'user deleted' })
            }
            
            case 'signin': {
                var newUserDB = await User.findOne({ email: data.email, password: data.password })
                newUserDB = newUserDB.toJSON()
                Object.assign(newUserDB, { userId: newUserDB._id.toString() })
                delete newUserDB['_id']
                delete newUserDB['__v']
                return res.json({ message: `${data.email}`, user: newUserDB })
            }
            
            case 'signup': {
                var newUser = new User({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    friendsId: data.friendsId,
                    gender: data.gender,
                    birthDate: data.birthDate
                })
                const doc = await newUser.save()
                var newUserDB = doc.toJSON()
                Object.assign(newUserDB, { userId: newUserDB._id.toString() })
                delete newUserDB['_id']
                delete newUserDB['__v']
                return res.json({ message: 'user insert', user: newUserDB })
            }
            
            case 'getProfilePicture': {
                const { userId } = data;
                if (!userId) {
                    return res.status(400).json({ message: "Missing userId" });
                }
                
                try {
                    const objectId = mongoose.Types.ObjectId.isValid(userId) 
                        ? new mongoose.Types.ObjectId(userId) 
                        : userId;

                    const user = await User.findById(objectId);
                    if (!user) {
                        return res.status(404).json({ message: "User not found" });
                    }

                    // Get the profile picture from profileImages array
                    let profilePictureUrl = "https://www.gravatar.com/avatar/"; // default
                    
                    if (user.profileImages && user.profileImages.length > 0) {
                        // Get the first (or latest) profile image
                        const profileImageId = user.profileImages[user.profileImages.length - 1];
                        // Construct Cloudinary URL for the profile folder
                       profilePictureUrl = `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/profile/${profileImageId}`;
                    }

                    return res.json({ 
                        message: "Profile picture retrieved", 
                        profilePicture: profilePictureUrl,
                        hasCustomPicture: user.profileImages && user.profileImages.length > 0
                    });
                } catch (error) {
                    console.error("Error in getProfilePicture:", error);
                    return res.status(500).json({ message: "Error retrieving profile picture: " + error.message });
                }
            }
            
            case 'likePost': {
                const { userId, postId } = data;
                console.log(`userId: ${userId}, postId: ${postId}`);
                if (!userId || !postId) {
                    return res.status(400).json({ message: "Missing userId or postId" });
                }

                try {
                    const objectId = mongoose.Types.ObjectId.isValid(userId) 
                        ? new mongoose.Types.ObjectId(userId) 
                        : userId;

                    const user = await User.findById(objectId);
                    if (!user) {
                        return res.status(404).json({ message: "User not found" });
                    }

                    if (!user.likedPosts.includes(postId)) {
                        user.likedPosts.push(postId);
                        await user.save();
                    }

                    const updatedUser = user.toObject();
                    Object.assign(updatedUser, { userId: updatedUser._id.toString() });
                    delete updatedUser._id;
                    delete updatedUser.__v;

                    return res.json({ message: "Post liked", user: updatedUser });
                } catch (error) {
                    console.error("Error in likePost:", error);
                    return res.status(500).json({ message: "Error processing like: " + error.message });
                }
            }
            
            case 'unlikePost': {
                const { userId, postId } = data;
                console.log(`userId: ${userId}, postId: ${postId}`);
                if (!userId || !postId) {
                    return res.status(400).json({ message: "Missing userId or postId" });
                }
                
                try {
                    const objectId = mongoose.Types.ObjectId.isValid(userId)
                        ? new mongoose.Types.ObjectId(userId)
                        : userId;

                    const user = await User.findById(objectId);
                    if (!user) {
                        return res.status(404).json({ message: "User not found" });
                    }

                    const index = user.likedPosts.indexOf(postId);
                    if (index > -1) {
                        user.likedPosts.splice(index, 1);
                        await user.save();
                    }

                    const updatedUser = user.toObject();
                    Object.assign(updatedUser, { userId: updatedUser._id.toString() });
                    delete updatedUser._id;
                    delete updatedUser.__v;

                    return res.json({ message: "Post unliked", user: updatedUser });
                } catch (error) {
                    console.error("Error in unlikePost:", error);
                    return res.status(500).json({ message: "Error processing unlike: " + error.message });
                }
            }
            
            case 'getUserFriends': {
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
            case 'getProfilePicture': {
    const { userId } = data;
    
    if (user.profileImages && user.profileImages.length > 0) {
        const profileImageId = user.profileImages[user.profileImages.length - 1];
        profilePictureUrl = `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/profile/${profileImageId}`;
    }
 
}
            
            default: {
                return res.status(500).json({ message: "no command was found" })
            }
        }
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: error.message })
    }
})

module.exports = router