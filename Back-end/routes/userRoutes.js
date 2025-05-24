const express = require('express')
const router = express.Router()
const userSchema = require('../models/userSchema')
const mongoose = require('mongoose')
const User = mongoose.model('User',userSchema)

router.post('/',async(req,res) =>{
    const {command,data} = req.body;
    console.log(`command is: ${command} and data is: ${JSON.stringify(data)}`)
    try{
        switch(command){
            case 'update':{
                Object.assign(data,{_id:data.userId})
                delete data['userId']
                // console.log(data.postsId)
                const updateUser = await User.findByIdAndUpdate(data._id,data,{new:true})
                Object.assign(updateUser,{userId:updateUser._id.toString()})
                delete updateUser['_id']
                delete updateUser['__v']
                if(!updateUser){
                    return res.status(404).json({message:'user not found'})
                }
                return res.json({message:'user updated',user:updateUser})
            }
            case 'delete':{
                const deleteUser = await User.findByIdAndDelete(data.userId)
                if(!deleteUser){
                    return res.status(404).json({message:'user not found'})
                }
                return res.json({message:'user deleted'})
            }
            case 'signin':{
                var newUserDB = await User.findOne({email:data.email,password:data.password})
                newUserDB = newUserDB.toJSON()
                Object.assign(newUserDB,{userId:newUserDB._id.toString()})
                delete newUserDB['_id']
                delete newUserDB['__v']
                return res.json({message: `${data.email}`,user:newUserDB})
            }
            case 'signup':{
                var newUser = new User({name:data.name,email:data.email,password:data.password,friendsId:data.friendsId,gender:data.gender,birthDate:data.birthDate})
                const doc = await newUser.save()
                var newUserDB = doc.toJSON()
                Object.assign(newUserDB,{userId:newUserDB._id.toString()})
                delete newUserDB['_id']
                delete newUserDB['__v']
                return res.json({message:'user insert',user:newUserDB})
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
        return res.status(500).json({ message: "Error processing likeeeeeeeeeee: " + error.message });
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

        // Remove postId if it exists in likedPosts
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
    // Fetch all friends by their IDs
    const friends = await User.find({ _id: { $in: user.friendsId } }, { name: 1, _id: 1 });
    return res.json({ friends });
}

            default:{
                return res.status(500).json({message: "no command was found"})
            }
        }
    }catch(error){
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
})

module.exports = router