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
            case 'get':{
                ////add fetch posts tht user x can see

            }
         case 'create': {
    console.log(data.userId)
    var newPost = new Post({text:data.text,userId:data.userId,likes:0,createdAt:Date.now()})
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