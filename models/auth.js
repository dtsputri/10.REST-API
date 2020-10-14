import express from 'express'
import User from './user.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const Auth = express.Router();

Auth.post('/login', async (req, res,next) => {

        const{
            username,
            password
        } = req.body
        
        const currentUser = await User.find({"username": username})
        
        //cek user available 
       if(currentUser[0]){
            //check password
            bcrypt.compare(password, currentUser[0].password).then(function(result) {
                if(result){
                    //urus token disini
                    let token =jwt.sign({name: username}, 'verysecretValue', {expiresIn: '1h'})
                    res.json({message :'login succesful!',token:token})
                    res.status(201).json({"status":"logged in!"})
                }
                else
                    res.status(201).json({"status":"wrong password."})
            })
        }
        else{
            res.status(201).json({message:"username not found"})
        }
        next(res.status(500).json({ error: err}))
})


export default Auth
