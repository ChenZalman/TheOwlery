const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    userId:String,
    gender:String,
    birthDate:String,
    friendsId:[],
    postsId:[],
    //likedPosts:[]
      likedPosts: { type: [String], default: [] }
})

module.exports = userSchema