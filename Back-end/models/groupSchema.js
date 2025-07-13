const mongoose = require('mongoose')


const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    membersIds: [String],  
    postsId: [String],    
    adminIds: [String], 
    blockedIds: [String],
    pendingInvites: [String], 
    pendingRequests: [String],  
    coverImage: String,
    createdAt: Date,
    privacy: { type: String, enum: ["public", "private"], default: "public" },
})

module.exports = postSchema