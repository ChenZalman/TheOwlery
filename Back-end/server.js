const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();

const port = process.env.PORT
const url = process.env.MONGODB_URL
//Those lines are for starting the server
const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.connect(url)

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    userId:String
})

const User = mongoose.model('User',userSchema)

app.post('/api/users',async(req,res) =>{
    const {command,data} = req.body;
    try{
        switch(command){
            case 'insert':
                const newUser = new User({name:data.name,email:data.email,password:data.password,userId:data.userId})
                await newUser.save()
                return res.json({message:'user insert',user:newUser})
            case 'select':
                const users = await User.find()
                //console.log(users)
                return res.json({message: 'users fetched',users:users})
            case 'update':
                const updateUser = await User.updateOne({userId:data.userId},{email:data.email,name:data.name,password:data.password
                },{new:true})
                if(!updateUser){
                    return res.status(404).json({message:'user not found'})
                }
                return res.json({message:'user updated',user:updateUser})
            case 'delete':
                const deleteUser = await User.deleteOne({userId:data.userId})
                if(!deleteUser){
                    return res.status(404).json({message:'user not found'})
                }
                return res.json({message:'user deleted'})
        }
    }catch(error){
        console.error(error.message)
    }
})

app.get('/',async(req,res) => {res.status(200).json({message:"Welcome!"})})


app.listen(port, () =>{
    console.log('server is listening on port ' + port + ' for the end point /api/users')
})