const express = require('express')
const router = express.Router()
const userSchema = require('../models/userSchema')
const mongoose = require('mongoose')
const User = mongoose.model('User',userSchema)

router.post('/',async(req,res) =>{
    const {command,data} = req.body;
    try{
        switch(command){
            case 'insert':{
                const newUser = new User({name:data.name,email:data.email,password:data.password,userId:data.userId})
                await newUser.save()
                return res.json({message:'user insert',user:newUser})
            }
            case 'select':{
                const users = await User.find()
                //console.log(users)
                return res.json({message: 'users fetched',users:users})
            }
            case 'update':{
                const updateUser = await User.updateOne({userId:data.userId},{email:data.email,name:data.name,password:data.password
                },{new:true})
                if(!updateUser){
                    return res.status(404).json({message:'user not found'})
                }
                return res.json({message:'user updated',user:updateUser})
            }
            case 'delete':{
                const deleteUser = await User.deleteOne({userId:data.userId})
                if(!deleteUser){
                    return res.status(404).json({message:'user not found'})
                }
                return res.json({message:'user deleted'})
            }
            case 'signin':{
                return res.json({message: `${data.email}`,user:data})
            }
            case 'signup':{
                var newUser = new User({name:data.name,email:data.email,password:data.password,friendsId:data.friendsId,gender:data.gender,birthDate:data.birthDate})
                await newUser.save().then(doc =>{
                    var newUserDB = doc.toJSON()
                    Object.assign(newUserDB,{userId:newUserDB._id.toString()})
                    delete newUserDB['_id','__v']
                    console.log(newUserDB) 
                })
                return res.json({message:'user insert',user:newUser})
            }
            default:{
                return res.status(500).json({message: "no command was dound"})
            }
        }
    }catch(error){
        console.error(error.message)
    }
})

module.exports = router