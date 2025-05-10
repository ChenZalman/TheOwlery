const mongoose = require('mongoose')


const postSchema = mongoose.Schema({
    Id:String,
    text:String,
    userID:String,
    likes: mongoose.Schema.Types.Int32,
    images:[],
    videos:[],
    comments:[],
    createdAt: Date,
})

module.exports = postSchema