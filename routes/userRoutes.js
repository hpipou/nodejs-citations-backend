const express = require("express")
const USERROUTES = express.Router()

const models = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Declare MIDDLEWARE
const registerVerification = require("../middleware/registerUserVerification")
const loginVerification = require("../middleware/loginUserVerification")
const checkID = require("../middleware/checkID")
const checkPASS = require("../middleware/checkNewPassword")

//////////////////////////////////////////////////
// register
//////////////////////////////////////////////////
USERROUTES.post('/register', registerVerification, (req,res)=>{

    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    // check if email used
    models.User.findOne({attributes:['id'], where:{email:email}})
    .then((dataByEmail)=>{
        if(dataByEmail==null){
            checkUsername()
        }else{
            return res.status(403).json("EMAIL ALREADY USED")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // check if username used
    function checkUsername(){
        models.User.findOne({attributes:['id'], where:{username:username}})
        .then((dataByUsername)=>{
            if(dataByUsername==null){
                addNewUser()
            }else{
                return res.status(403).json("USERNAME ALREADY USED")
            }
        })
        .catch((error)=>{return res.status(500).json(error)})
    }

    // create new user
    function addNewUser(){
        models.User.create({
            email:email,
            username:username,
            password:bcrypt.hashSync(password,10),
            isProfil:false,
            roleName:'USER'
        })
        .then(()=>{return res.status(201).json("USER CREATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

//////////////////////////////////////////////////
// login
//////////////////////////////////////////////////
USERROUTES.post('/login', loginVerification, (req,res)=>{

    const email = req.body.email
    const password = req.body.password

    // check if user exist
    models.User.findOne({attributes:['id','email','username','password','isProfil','roleName'], where:{email:email}})
    .then((dataByEmail)=>{
        if(dataByEmail==null){
            return res.status(403).json("USER NOT FOUND")
        }else{
            if(bcrypt.compareSync(password,dataByEmail.password)){
                
                const AccessToken = jwt.sign({
                    id:dataByEmail.id,
                    username:dataByEmail.username,
                    isprofil:dataByEmail.isProfil,
                    roleName:dataByEmail.roleName
                },process.env.SECTOKEN,
                {expiresIn:process.env.ACCESSTIME})

                const RefreshToken = jwt.sign({
                    id:dataByEmail.id,
                    username:dataByEmail.username,
                    isprofil:dataByEmail.isProfil,
                    roleName:dataByEmail.roleName},
                    process.env.SECTOKEN,
                    {expiresIn:process.env.REFRESHTIME})

                return res.status(200).json({'AccessToken':AccessToken,'RefreshToken':RefreshToken})

            }else{
                return res.status(200).json("WRONG PASSWORD")
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})
})

//////////////////////////////////////////////////
// change password
//////////////////////////////////////////////////
USERROUTES.put('/', checkPASS, (req,res)=>{

    const email = req.body.email
    const password = req.body.password
    const newpassword = req.body.newpassword

    // check if user exist
    models.User.findOne({attributes:['id','email','username','password','isProfil','roleName'], where:{email:email}})
    .then((dataByEmail)=>{
        if(dataByEmail==null){
            return res.status(403).json("USER NOT FOUND")
        }else{
            if(bcrypt.compareSync(password,dataByEmail.password)){
                updatePassword()
            }else{
                return res.status(200).json("WRONG PASSWORD")
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // function update password
    function updatePassword(){
        models.User.update({password:bcrypt.hashSync(newpassword,10)},{where:{email:email}})
        .then(()=>{return res.status(200).json("PASSWORD SUCCESSFULLY CHANGED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

//////////////////////////////////////////////////
// show all users
//////////////////////////////////////////////////
USERROUTES.get('/',(req,res)=>{
    models.User.findAll({attributes:['id','email','username','password','isProfil','roleName']})
    .then((data)=>{return res.status(200).json(data)})
    .catch((error)=>{return res.status(500).json(error)})
})


//////////////////////////////////////////////////
// show one user
//////////////////////////////////////////////////

USERROUTES.get('/:id', checkID, (req,res)=>{

    const userID = req.params.id

    models.User.findOne({attributes:['id','email','username','password','isProfil','roleName'], where:{id:userID}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("USER NOT FOUND")
        }else{
            return res.status(200).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})
})

//////////////////////////////////////////////////
// delete user
//////////////////////////////////////////////////
USERROUTES.delete('/:id', checkID , (req,res)=>{

    const userID = req.params.id

    // check if USER exist
    models.User.findOne({attributes:['id'],where:{id:userID}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("USER NOT FOUND")
        }else{
            deleteUser()
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // delete USER function
    function deleteUser(){
        models.User.destroy({where:{id:userID}})
        .then(()=>{return res.status(200).json("USER DELETED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

module.exports=USERROUTES