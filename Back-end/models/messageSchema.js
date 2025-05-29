const mongoose = require('mongoose')


const messageSchema = mongoose.Schema({
    userid: { type: String, required: true },
    friendid: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
})

module.exports = messageSchema