const mongoose = require('mongoose')


const commentSchema = mongoose.Schema({
    Id:String,
    text:String,
    userId:String, 
    likes: mongoose.Schema.Types.Int32,
})

module.exports = commentSchema