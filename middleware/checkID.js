const validator = require("validator")

const checkID = (req,res,next)=>{
    
    if(req.params.id==undefined || req.params.id==null){
        return res.status(403).json("ID UNDEFINED")
    }

    const userID = req.params.id

    if(!validator.matches(userID,'^[0-9]*$')){
        return res.status(403).json("ID NOT A NUMBER")
    }
    
    next()
}

module.exports = checkID