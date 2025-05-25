const mongoose = require('mongoose')


const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    membersIds: [String],  
    postsId: [String],    
    adminIds: [String], 
    blockedIds: [String],
    createdAt: Date,
})

module.exports = postSchema