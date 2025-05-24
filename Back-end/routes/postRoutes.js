const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const postSchema = require('../models/postSchema')
const Post = mongoose.model('Post',postSchema)

router.post('/',async(req,res) =>{
    const {command,data} = req.body;
    try{
        switch(command){
            case 'update':{

            }
            case 'delete':{

            }
            case 'get':{

            }
            case 'create':{
                console.log(data.userId)
                var newPost = new Post({text:data.text,userId:data.userId,likes:0,createdAt:Date.now()})
                const doc = await newPost.save()
                var newPostDB = doc.toJSON()
                Object.assign(newPostDB,{id:newPostDB._id.toString()})
                delete newPostDB['_id']
                delete newPostDB['__v']
                return res.json({message:'post created',post:newPostDB})
            }
            default:{
                return res.status(500).json({message: "no command was dound"})
            }
        }
    }catch(error){
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
})

module.exports = router