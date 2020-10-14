import User from './../models/user.js'
import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'

//const authRoute = require('./model')

const userRouter = express.Router()

userRouter.post('/add', async(req,res)=>
{
        try{
            const{
                username,
                password
            }=req.body

            var saltRounds = 10;
            const hashedPw = await bcrypt.hash(password, saltRounds)
            const user = await User.findOne({username})
            
            if(user){
                res.status(201).json({message : "Username sudah di gunakan"})
            }
            else{
            const newUser = new User ({
                "username":username,
                "password":hashedPw
            })
            const createdUser = await newUser.save()
            res.status(201).json(createdUser)}
        }
        catch(err){
            res.status(500).json({error:err})
        }
    
})

userRouter.get('/alluser', async (req, res) => {
    const user = await User.find({})
  
    if(user && user.length !==0) {
      res.json(user)
    } else {
      res.status(404).json({
        message: 'user not found'
      })
    }
  })

  userRouter.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if(user) {
      res.json(user)
    } else {
      res.status(404).json({
        message: 'user not found'
      })
    }
  })


userRouter.post('/login', async (req, res) => {
    try{

        const{
            username,
            password
        } = req.body;
        
        const currentUser = await new Promise((resolve, reject) =>{
            User.find({"username": username}, function(err, user){
                if(err)
                    reject(err)
                resolve(user)
            })
        })
        //cek user available 
       if(currentUser[0]){
            //check password
            bcrypt.compare(password, currentUser[0].password).then(function(result) {
                if(result){
                    //urus token disini
                    let token =jwt.sign({name: username}, 'verysecretValue', {expiresIn: '20m'})
                    res.json({message :'login succesful!',token:token})
                    res.status(201).json({"status":"logged in!"})
                }
                else
                    res.status(201).json({"status":"wrong password."})
            })
        }
        else{
            res.status(201).json({"status":"username not found"})
        }

    }
    catch(err){
        res.status(500).json({ error: err}) 
    }
})

userRouter.put('/edit/:id',async (req,res)=>{
    console.log(req.params.id)
    const {
        username,
        password
    } = req.body
     var saltRounds = 10;

     const user = await User.findById(req.params.id);
     const hashedPw = await bcrypt.hash(password, saltRounds)
  
    if (user) {
        user.username = username
        user.password = hashedPw

      const updateUser = await user.save()
      res.json(updateUser)
    } else {
      res.status(404).json({
        message: 'user not found'
      })
    }
})

userRouter.delete('/delete/:id',async(req,res)=>{
    const user = await User.findById(req.params.id)
    if(user){
        await user.remove()
        res.json({
            message :'Data removes'
        })
    }
    else{
        res.status(404).json({
            message: "user not found"
        })
    }
})

userRouter.delete('/deleteall',async(req,res)=>{
    if(user){
        await User.remove()
        res.json({
            message :'ALL Data removes'
        })
    }
    else{
        res.status(404).json({
            message: "user not found"
        })
    }
    }
)


export default userRouter