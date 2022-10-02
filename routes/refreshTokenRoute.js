const express= require("express")
const refreshRoutes = express.Router()
const validator=require("validator")
const jwt = require("jsonwebtoken")
const models = require("../models")
require("dotenv").config()

refreshRoutes.get('/',(req,res)=>{

    if(req.headers.authorization==null || req.headers.authorization==undefined){
        return res.status(403).json("TOKEN UNDEFINED")
    }

    const token = req.headers.authorization.split(' ')[1]

    if(validator.isEmpty(token)){
        return res.status(403).json("TOKEN IS EMPTY")
    }

    try{

        const tokenDecoded = jwt.decode(token)
        const userID = tokenDecoded.id 

        if(jwt.verify(token,process.env.SECTOKEN)){
            
            // check if USER stil exist
            models.User.findOne({
                attributes:['id','email','username','isProfil','roleName'], 
                where:{id:userID}})
            .then((data)=>{
                if(data==null){
                    return res.status(403).json("USER NOT FOUND")
                }else{
                    const AccessToken = jwt.sign({
                        id:data.id,
                        username:data.username,
                        isprofil:data.isProfil,
                        roleName:data.roleName
                    },process.env.SECTOKEN,
                    {expiresIn:process.env.ACCESSTIME})

                    const RefreshToken = jwt.sign(
                        {id:data.id},
                        process.env.SECTOKEN,
                        {expiresIn:process.env.REFRESHTIME})

                    return res.status(200).json({'AccessToken':AccessToken,'RefreshToken':RefreshToken})

                }
            })
            .catch((error)=>{return res.status(500).json(error)})

        }else{
            return res.status(403).json("TOKEN IS INVALID")
        }

    }catch{
        return res.status(403).json("TOKEN IS INVALID")
    }


    

    

})

module.exports = refreshRoutes