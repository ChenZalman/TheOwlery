const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const postSchema = require('../models/postSchema')
const Post = mongoose.model('Post',postSchema)
const userSchema = require('../models/userSchema');
const User = mongoose.model('User', userSchema);
const commentSchema = require('../models/commentSchema');
const Comment = mongoose.model('Comment', commentSchema);
router.post('/',async(req,res) =>{
router.post('/filter', async (req, res) => {
    try {
        const { userId, month, userName, hasImage } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }
        const User = mongoose.model('User');
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Build array of user IDs: self + friends
        const allowedUserIds = [user._id.toString(), ...(user.friendsId || [])];
        let query = { userId: { $in: allowedUserIds } };
        if (userName && userName.trim() !== "") {
            // Find users whose name matches (case-insensitive)
            const users = await User.find({ name: { $regex: userName, $options: 'i' } });
            const userIds = users.map(u => u._id.toString());
            query.userId = { $in: allowedUserIds.filter(id => userIds.includes(id)) };
        }
        if (month && !isNaN(Number(month))) {
            // Filter by month (createdAt STRING )
            const m = Number(month) - 1;
            const year = new Date().getFullYear();
            const start = new Date(year, m, 1);
            const end = new Date(year, m + 1, 1);
            query.createdAt = { $gte: start, $lt: end };
        }
        if (hasImage === "true") {
            query.images = { $exists: true, $not: { $size: 0 } };
        } else if (hasImage === "false") {
            query.images = { $in: [[], null] };
        }
        const posts = await Post.find(query).sort({ createdAt: -1 });
        return res.json({ posts });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
});
    // console.log('post route')
    const {command,data} = req.body;
    try{
        switch(command){
            case 'update':{
                // Update post text if user is the owner
                const { postId, text } = data;
                if (!postId || !text) {
                    return res.status(400).json({ message: "Missing postId or text" });
                }
               
                const post = await Post.findById(postId);
                if (!post) {
                    return res.status(404).json({ message: "Post not found" });
                }
              
                if (data.userId && post.userId.toString() !== data.userId) {
                    return res.status(403).json({ message: "Not authorized to edit this post" });
                }
                post.text = text;
                await post.save();
                return res.json({ message: "Post updated", post });
            }
            case 'delete':{
                const post=await Post.findByIdAndDelete(data.postId);
                if(post)
                return res.json({message:'post deleted'})
                else
                return res.json({message:'post not found'})
            }
            case 'getFiltered': {
                const { userId, month, userName, hasImage } = data;
                if (!userId) {
                    return res.status(400).json({ message: "Missing userId" });
                }
                const User = mongoose.model('User');
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Build array of user IDs: self + friends
                const allowedUserIds = [user._id.toString(), ...(user.friendsId || [])];
                let query = { userId: { $in: allowedUserIds } };
                if (userName && userName.trim() !== "") {
                    // Find users whose name matches (case-insensitive)
                    const users = await User.find({ name: { $regex: userName, $options: 'i' } });
                    const userIds = users.map(u => u._id.toString());
                    query.userId = { $in: allowedUserIds.filter(id => userIds.includes(id)) };
                }
                if (month && !isNaN(Number(month))) {
                    // Filter by month (IN createdAt STRING)
                    const m = Number(month) - 1;
                    const year = new Date().getFullYear();
                    const start = new Date(year, m, 1);
                    const end = new Date(year, m + 1, 1);
                    query.createdAt = { $gte: start, $lt: end };
                }
                if (hasImage === "true") {
                    query.images = { $exists: true, $not: { $size: 0 } };
                } else if (hasImage === "false") {
                    query.images = { $in: [[], null] };
                }
                const posts = await Post.find(query).sort({ createdAt: -1 });
                return res.json({ posts });
            }
            case 'get': {
    if (!data.userId) {
        return res.status(400).json({ message: "Missing userId" });
    }
    
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
case "addComment": {
    const { postId, userId, text } = req.body.data;
    if (!postId || !userId || !text) {
        return res.status(400).json({ message: "Missing data" });
    }

   
    const comment = await Comment.create({
        postId,
        userId,
        text,
        createdAt: new Date(),
    });

     
    await Post.findByIdAndUpdate(
        postId,
        { $push: { commentsId: comment._id } }
    );

    
    await User.findByIdAndUpdate(
        userId,
        { $push: { commentsId: comment._id } }
    );

    return res.status(201).json({ comment });
}
case 'getCommentsByPostId': {
    if (!data.postId) {
        return res.status(400).json({ message: "Missing postId" });
    }
    const post = await Post.findById(data.postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    // Populate comments by their IDs
    const comments = await Comment.find({ _id: { $in: post.commentsId } }).sort({ createdAt: -1 });
    return res.status(200).json({ comments });
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