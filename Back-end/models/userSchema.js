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
    profileImage: String,
    //likedPosts:[]
    likedPosts: { type: [String], default: [] },
    commentsId: { type: [String], default: [] },
    friendRequests: { type: [String], default: [] }, // incoming requests
    pendingRequests: { type: [String], default: [] } // outgoing requests
})

module.exports = userSchema