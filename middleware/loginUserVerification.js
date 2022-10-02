const validator = require("validator")

const loginVerif = (req,res,next)=>{
    
    if(req.body.email==null || req.body.email==undefined){
        return res.status(403).json("EMAIL UNDEFINDED")
    }else if(req.body.password==null || req.body.password==undefined){
        return res.status(403).json("PASSWORD UNDEFINDED")
    }

    const email = req.body.email
    const password = req.body.password

    if(!validator.isEmail(email)){return res.status(403).json("EMAIL INCORRECT")}

    if(validator.isEmpty(email)){return res.status(403).json("EMAIL UNDEFINDED")}
    if(validator.isEmpty(password)){return res.status(403).json("PASSWORD UNDEFINDED")}

    if(!validator.isLength(email,{min:5, max:30})){return res.status(403).json("EMAIL MIN:5 MAX:30")}
    if(!validator.isLength(password,{min:5, max:30})){return res.status(403).json("PASSWORD MIN:5 MAX:30")}

    next()
}

module.exports = loginVerif