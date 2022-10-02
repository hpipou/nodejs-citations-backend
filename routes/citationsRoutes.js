const express = require("express")
const CITATIONROUTES = express.Router()
const models = require("../models")
const jwt = require("jsonwebtoken")

// deploy middleware
const checkCitation = require("../middleware/checkCitation")
const checkID = require("../middleware/checkID")

///////////////////////////////////////////////
// add new citation
///////////////////////////////////////////////
CITATIONROUTES.post('/', checkCitation , (req, res)=>{

    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const userID = tokenDecoded.id 
    const citation = req.body.citation

    // found id profil
    models.Profil.findOne({attributes : ['id'], where:{idUser:userID}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PROFIL NOT FOUND")
        }else{
            addCitation(data.id)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // add citation function
    function addCitation(myProfil){
        models.Citation.create({
            post:citation,
            idUser : userID,
            idProfil:myProfil
        })
        .then(()=>{return res.status(201).json("Citation added")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

///////////////////////////////////////////////
// edit citations
///////////////////////////////////////////////
CITATIONROUTES.put('/:id', checkID , checkCitation , (req, res)=>{

    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const userID = tokenDecoded.id 
    const citation = req.body.citation
    const idCitation = req.params.id

    // found id USER
    models.Citation.findOne({attributes : ['id','idUser','idProfil'], where:{id:idCitation}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("CITATION NOT FOUND")
        }else{
            if(userID==data.idUser){
                editCitation()
            }else{
                return res.status(403).json("YOU ARE NOT THE PUBLISHER")
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // add citation function
    function editCitation(){
        models.Citation.update({post:citation},{where:{id:idCitation}})
        .then(()=>{return res.status(201).json("Citation updated")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

///////////////////////////////////////////////
// show all citations
///////////////////////////////////////////////
CITATIONROUTES.get('/',(req,res)=>{

    models.Citation.findAll({
        attributes : ['id','post'], 
        include:[
            {model:models.User,attributes:['id','email','username']},
            {model:models.Profil,attributes:['id','fname','lname','sexe','workplace','country','imgURL']}
        ]
    })
    .then((data)=>{
        if(data==null){
            return res.status(403).json("CITATIONS NOT FOUND")
        }else{
            return res.status(200).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})
})

///////////////////////////////////////////////
// show one citation
///////////////////////////////////////////////
CITATIONROUTES.get('/:id', checkID , (req, res)=>{

    const idCitation = req.params.id

    models.Citation.findOne({
        attributes : ['id','post'], 
        where:{id:idCitation}, 
        include:[
            {model:models.User,attributes:['id','email','username']},
            {model:models.Profil,attributes:['id','fname','lname','sexe','workplace','country','imgURL']}
        ]
    })
    .then((data)=>{
        if(data==null){
            return res.status(403).json("CITATION NOT FOUND")
        }else{
            return res.status(200).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

})

///////////////////////////////////////////////
// delete citation
///////////////////////////////////////////////
CITATIONROUTES.delete('/:id', checkID , (req, res)=>{

    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)
    const userID = tokenDecoded.id 
    const idCitation = req.params.id

    // Check if citation exist
    models.Citation.findOne({attributes : ['id','idUser'], where:{id:idCitation}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("CITATION NOT FOUND")
        }else{
            if(userID==data.idUser){
                deleteCitation()
            }else{
                return res.status(403).json("YOU ARE NOT THE PUBLISHER")
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // delete citation function
    function deleteCitation(){
        models.Citation.destroy({where:{id:idCitation}})
        .then(()=>{return res.status(201).json("CITATION DELETED WITH SUCCESS")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})

module.exports=CITATIONROUTES