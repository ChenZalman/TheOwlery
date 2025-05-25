const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const userRouter = require('./routes/userRoutes')
const postRouter = require('./routes/postRoutes')
const groupRouter = require('./routes/groupRoutes')
const userSchema = require('./models/userSchema')

require('dotenv').config();

const port = process.env.PORT
const url = process.env.MONGODB_URL
//Those lines are for starting the server
const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.connect(url)

const User = mongoose.model('User',userSchema)

app.use('/api/users',userRouter)
app.use('/api/posts',postRouter)
app.use('/api/groups',groupRouter)

app.get('/',async(req,res) => {res.status(200).json({message:"Welcome!"})})


app.listen(port, () =>{
    console.log('server is listening on port ' + port + ' for the end point /api/users')
})