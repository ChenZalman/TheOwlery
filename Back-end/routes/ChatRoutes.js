
const express = require('express');
const messageSchema = require('../models/messageSchema')
const mongoose = require('mongoose')
const Message = mongoose.model('Message', messageSchema);
const router = express.Router();

router.get('/', async (req,res) => {
    console.log("The body of the request is: ",req.query.userid)
    Message.find({$or:[{userid:req.query.userid,friendid:req.query.friendid},{userid:req.query.friendid,friendid:req.query.userid}]}).sort({ timestamp: 1 }).lean()
            .then(messages => res.json(messages))
            .catch(err => res.status(500).json({ error: err }));
});

const saveMessage = (io,socket) => {
    console.log('User connected:', socket.id);

    socket.on('chat message', async msg => {
        try {
            //console.log(msg)
            const message = new Message({userid: msg.userid, friendid: msg.friendid, content: msg.content});
            await message.save();
            //io.emit('chat message', message);
        } catch (err) {
            console.error(err);
        }
    });

    Message.watch().
        on('change', data => {console.log(data.fullDocument)
                              console.log(socket.id)
                              io.emit('chat message', data.fullDocument)});

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
}

module.exports = {
    saveMessage,
    messageRouter: router
};