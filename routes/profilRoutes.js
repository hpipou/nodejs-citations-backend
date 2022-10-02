const express = require("express")
const PROFILROUTES = express.Router()
const jwt = require("jsonwebtoken")
const models = require("../models")

// declare middleware
const checkProfilInfo = require("../middleware/checkProfil")
const chekID = require("../middleware/checkID")
const multer = require("../middleware/multer")
const multerErrorHandler = require("../middleware/multerErrorCapture")
const auth = require("../middleware/authentication")

//////////////////////////////////
// add new profil
//////////////////////////////////
PROFILROUTES.post('/', auth , checkProfilInfo , (req,res)=>{

    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const userID = tokenDecoded.id
 
    const fname = req.body.fname
    const lname = req.body.lname
    const sexe = req.body.sexe
    const workplace = req.body.workplace
    const country = req.body.country

    // check if profil exist
    models.Profil.findOne({attributes:['id'], where:{idUser:userID}})
    .then((data)=>{
        if(data!=null){
            return res.status(403).json("PROFIL ALREADY EXIST")
        }else{
            addNewProfil()
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // create new profil
    function addNewProfil(){
        models.Profil.create({
            fname:fname,
            lname:lname,
            sexe:sexe,
            workplace:workplace,
            idUser:userID,
            imgURL:'standard.png',
            country:country
        })
        .then(()=>{updateUser()})
        .catch((error)=>{return res.status(500).json(error)})
    }

    // update user at ISPROFIL
    function updateUser(){
        models.User.update({isProfil:true},{where:{id:userID}})
        .then(()=>{return res.status(201).json("PROFIL SUCCESSFULY CREATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
    
})


//////////////////////////////////
// edit profil
//////////////////////////////////
PROFILROUTES.put('/', auth , checkProfilInfo , (req,res)=>{

    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const userID = tokenDecoded.id
 
    const fname = req.body.fname
    const lname = req.body.lname
    const sexe = req.body.sexe
    const workplace = req.body.workplace
    const country = req.body.country

    // check if profil exist
    models.Profil.findOne({attributes:['id'], where:{idUser:userID}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PROFIL NOT FOUND")
        }else{
            editProfil()
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // create new profil
    function editProfil(){
        models.Profil.update({
            fname:fname,
            lname:lname,
            sexe:sexe,
            workplace:workplace,
            country:country
        },{where:{idUser:userID}})
        .then(()=>{return res.status(200).json("PROFIL UPDATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
    
})


//////////////////////////////////
// show all profils
//////////////////////////////////
PROFILROUTES.get('/',(req,res)=>{
    models.Profil.findAll({
        attributes:['id','fname','lname','sexe','workplace','country','imgURL','idUser'],  
        include:{ 
            model:models.User, 
            attributes:['email','username']
        }})
    .then((data)=>{return res.status(200).json(data)})
    .catch((error)=>{return res.status(500).json(error)})
})

//////////////////////////////////
// show one profil
//////////////////////////////////
PROFILROUTES.get('/:id', chekID , (req,res)=>{

    const idUser = req.params.id

    models.Profil.findOne({
        attributes:['id','fname','lname','sexe','workplace','country','imgURL','idUser'],
        where:{idUser:idUser},  
        include:{ 
            model:models.User, 
            attributes:['email','username']
        }})
    .then((data)=>{
        if(data!=null){
            return res.status(200).json(data)
        }else{
            return res.status(403).json("PROFIL NOT FOUND")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})
})


//////////////////////////////////
// upload image profil
//////////////////////////////////
PROFILROUTES.post('/picture', auth, multer.single('file') , multerErrorHandler, (req,res)=>{

    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const userID = tokenDecoded.id

    const imgURL = req.file.filename

    // check if profil still exist
    models.Profil.findOne({attributes:['id'],where:{idUser:userID}})
    .then((data)=>{
        if(data!=null){
            imgUpdate()
        }else{
            return res.status(403).json("PROFIL NOT FOUND")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // edit image profil link
    function imgUpdate(){
        models.Profil.update({imgURL:imgURL},{where:{idUser:userID}})
        .then(()=>{return res.status(200).json("IMAGE UPDATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

module.exports=PROFILROUTES