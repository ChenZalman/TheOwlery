const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const postSchema = require('../models/postSchema')
const Post = mongoose.model('Post',postSchema)

router.post('/',async(req,res) =>{
    console.log('post route')
    const {command,data} = req.body;
    try{
        switch(command){
            case 'update':{

            }
            case 'delete':{

            }
         case 'get': {
    if (!data.userId) {
        return res.status(400).json({ message: "Missing userId" });
    }
    // Get the user and their friends
    const User = mongoose.model('User');
    const user = await User.findById(data.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Build array of user IDs: self + friends
    const allowedUserIds = [user._id.toString(), ...(user.friendsId || [])];
    
    const posts = await Post.find({ userId: { $in: allowedUserIds } }).sort({ createdAt: -1 });
    return res.json({ posts });
}
         case 'create': {
    console.log(data.userId)
    const newPost = new Post({
        text: data.text,
        userId: data.userId,
        likes: 0,
        images: data.images || [],
        videos: data.videos || [],
        comments: [],
        createdAt: Date.now()
    });
    const doc = await newPost.save()
    var newPostDB = doc.toJSON()
    Object.assign(newPostDB, { id: newPostDB._id.toString() })
    delete newPostDB['_id']
    delete newPostDB['__v']

    // Update the user's postsId array  after creating the post
    await mongoose.model('User').findByIdAndUpdate(
      data.userId,
      { $push: { postsId: newPostDB.id } }
    );

    return res.json({message:'post created', post: newPostDB})
}
case 'getPostById':{
    if(!data.postId){
        return res.status(400).json({message: "Missing postId"})
    }
    const post=await Post.findById(data.postId);
     if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
       const postObj = post.toObject();
    postObj.id = postObj._id.toString();
    delete postObj._id;
    delete postObj.__v;
    return res.status(200).json({ post: postObj });

}
case 'getGroupPosts': {
  if (!data.groupId) {
    return res.status(400).json({ message: "Missing groupId" });
  }
  const group = await mongoose.model('Group').findById(data.groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }
  const posts = await Post.find({ _id: { $in: group.postsId } }).sort({ createdAt: -1 });
  return res.json({ posts });
}
            default:{
                return res.status(500).json({message: "no command was founaaaad"})
            }
        }
    }catch(error){
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
})

module.exports = router