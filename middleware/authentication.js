const jwt = require("jsonwebtoken")
const validator = require("validator")
require("dotenv").config()

const auth = (req, res, next)=>{

    if(req.headers.authorization==null || req.headers.authorization==undefined){
        return res.status(403).json("TOKEN UNDEFINED")
    }

    const token = req.headers.authorization.split(' ')[1]

    if(validator.isEmpty(token)){
        return res.status(403).json("TOKEN IS EMPTY")
    }

    try{
        if(jwt.verify(token,process.env.SECTOKEN)){
            next()
        }else{
            return res.status(403).json("TOKEN IS INVALID")
        }

    }catch{
        return res.status(403).json("TOKEN IS INVALID")
    }


}

module.exports = auth