//importing all required external
const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const User=require('./models/User')
const bcrypt=require('bcryptjs')
//middlewere
const PORT=3000
const app=express()
app.use(express.json())

//connecting mongodb
mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log('Db  connected')
).catch(
    (err)=>console.log(err)
)
//landing page http://localhost:3000/
app.get('/',(req,res)=>{
    try{
        res.send("<h1 align=center>welcome to the backend and week2</h1>")
    }
    catch(err){
        console.log(err)
    }
})
//Api registration http://localhost:3000/register
app.post('/register',async(req,res)=>{
    const {user,email,password}=req.body
    try{
        const hashPassword=await bcrypt.hash(password,10)
        const newUser=new User({user,email,password:hashPassword})
        await newUser.save()
        console.log("New user is registered sucessfully....")
        res.json({message:'user created.....'})
    }
    catch(err){
        console.log(err)
    }
})
app.post('/login',async(req,res)=>{
    const {user,email,password}=req.body
    try{
        const user = await User.findOne({email});
        if (!User || !(await bcrypt.compare(password,user.password)))
        {
            return res.status(400).json({message:"invalid credentials"})
        }
        res.json({message:"login successful",username:user.username});
    }
    catch(err){
        console.log(err)
    }
})



//server is running and testing

app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }
    console.log('server is running on port! :' +PORT)
})