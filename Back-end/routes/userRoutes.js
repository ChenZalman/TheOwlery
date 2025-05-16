const express = require('express')
const router = express.Router()
const userSchema = require('../models/userSchema')
const mongoose = require('mongoose')
const User = mongoose.model('User',userSchema)

router.post('/',async(req,res) =>{
    const {command,data} = req.body;
    try{
        switch(command){
            // case 'insert':{
            //     const newUser = new User({name:data.name,email:data.email,password:data.password,userId:data.userId})
            //     await newUser.save()
            //     return res.json({message:'user insert',user:newUser})
            // }
            // case 'select':{
            //     const users = await User.find()
            //     //console.log(users)
            //     return res.json({message: 'users fetched',users:users})
            // }
            case 'update':{
                Object.assign(data,{_id:data.userId})
                delete data['userId']
                // console.log(data.postsId)
                const updateUser = await User.findByIdAndUpdate(data._id,data,{new:true})
                Object.assign(updateUser,{userId:updateUser._id.toString()})
                delete updateUser['_id']
                delete updateUser['__v']
                if(!updateUser){
                    return res.status(404).json({message:'user not found'})
                }
                return res.json({message:'user updated',user:updateUser})
            }
            case 'delete':{
                const deleteUser = await User.findByIdAndDelete(data.userId)
                if(!deleteUser){
                    return res.status(404).json({message:'user not found'})
                }
                return res.json({message:'user deleted'})
            }
            case 'signin':{
                var newUserDB = await User.findOne({email:data.email,password:data.password})
                newUserDB = newUserDB.toJSON()
                Object.assign(newUserDB,{userId:newUserDB._id.toString()})
                delete newUserDB['_id']
                delete newUserDB['__v']
                return res.json({message: `${data.email}`,user:newUserDB})
            }
            case 'signup':{
                var newUser = new User({name:data.name,email:data.email,password:data.password,friendsId:data.friendsId,gender:data.gender,birthDate:data.birthDate})
                const doc = await newUser.save()
                var newUserDB = doc.toJSON()
                Object.assign(newUserDB,{userId:newUserDB._id.toString()})
                delete newUserDB['_id']
                delete newUserDB['__v']
                return res.json({message:'user insert',user:newUserDB})
            }
            default:{
                return res.status(500).json({message: "no command was dound"})
            }
        }
    }catch(error){
        console.error(error.message)
        return res.status(500).json({message: error.message})
    }
})

module.exports = router