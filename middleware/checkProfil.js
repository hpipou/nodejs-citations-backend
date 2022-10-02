const validator = require("validator")

const checkProfil = (req,res,next)=>{

    if(req.body.fname==null || req.body.fname==undefined){
        return res.status(403).json("FIRST NAME UNDEFINDED")
    }else if(req.body.lname==null || req.body.lname==undefined){
        return res.status(403).json("LAST NAME UNDEFINDED")
    }else if(req.body.sexe==null || req.body.sexe==undefined){
        return res.status(403).json("SEXE UNDEFINDED")
    }else if(req.body.workplace==null || req.body.workplace==undefined){
        return res.status(403).json("WORKPLACE UNDEFINDED")
    }else if(req.body.country==null || req.body.country==undefined){
        return res.status(403).json("COUNTRY UNDEFINDED")
    }

    const fname = req.body.fname
    const lname = req.body.lname
    const sexe = req.body.sexe
    const workplace = req.body.workplace
    const country = req.body.country

    if(validator.isEmpty(fname)){return res.status(403).json("FIRST NAME IS EMPTY")}
    if(validator.isEmpty(lname)){return res.status(403).json("LAST NAME IS EMPTY")}
    if(validator.isEmpty(sexe)){return res.status(403).json("SEXE IS EMPTY")}
    if(validator.isEmpty(workplace)){return res.status(403).json("WORKPLACE IS EMPTY")}
    if(validator.isEmpty(country)){return res.status(403).json("COUNTRY IS EMPTY")}

    if(!validator.isLength(fname,{min:3, max:30})){return res.status(403).json("FIRST NAME MIN:3 MAX:30")}
    if(!validator.isLength(lname,{min:3, max:30})){return res.status(403).json("LAST NAME MIN:3 MAX:30")}
    if(!validator.isLength(sexe,{min:3, max:30})){return res.status(403).json("SEXE MIN:3 MAX:30")}
    if(!validator.isLength(workplace,{min:3, max:30})){return res.status(403).json("WORKPLACE MIN:3 MAX:30")}
    if(!validator.isLength(country,{min:3, max:30})){return res.status(403).json("COUNTRY MIN:3 MAX:30")}

    if(!validator.matches(fname,'^[a-zA-Zé]*$')){return res.status(403).json("FIRST NAME CHARACTER ONLY")}
    if(!validator.matches(lname,'^[a-zA-Zé]*$')){return res.status(403).json("LAST NAME CHARACTER ONLY")}
    if(!validator.matches(sexe,'^[a-zA-Z]*$')){return res.status(403).json("SEXE CHARACTER ONLY")}
    if(!validator.matches(workplace,'^[a-zA-Zé]*$')){return res.status(403).json("WORKPLACE CHARACTER ONLY")}
    if(!validator.matches(country,'^[a-zA-Zé]*$')){return res.status(403).json("COUNTRY CHARACTER ONLY")}
    
    next()

}

module.exports = checkProfil