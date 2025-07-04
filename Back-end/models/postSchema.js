const mongoose = require('mongoose')


const postSchema = mongoose.Schema({
    id:String,
    text:String,
    userId:String,
    likes: mongoose.Schema.Types.Int32,
    images:[],
    videos:[],
    comments:[],
    createdAt: Date,
    commentsId: [String],  
    createdAt: { type: Date, default: Date.now }
})

module.exports = postSchema