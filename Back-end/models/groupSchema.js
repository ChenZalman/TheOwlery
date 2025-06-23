const mongoose = require('mongoose')


const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    membersIds: [String],  
    postsId: [String],    
    adminIds: [String], 
    blockedIds: [String],
    pendingInvites: [String], // Add this line for pending invites
    coverImage: String,
    createdAt: Date,
})

module.exports = postSchema