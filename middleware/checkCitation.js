const validator = require("validator")

const checkCitation = (req, res, next)=>{

    if(req.body.citation==null || req.body.citation==undefined){
        return res.status(403).json("CITATION UNDEFINDED")
    }

    const citation = req.body.citation

    if(validator.isEmpty(citation)){return res.status(403).json("CITATION UNDEFINDED")}

    if(!validator.isLength(citation,{min:1, max:250})){return res.status(403).json("CITATION MIN:5 MAX:250")}
   
    if(!validator.matches(citation,`^[a-zA-Z0-9 é.",']*$`)){return res.status(403).json("CITATION CHARACTERS & NUMBERS ONLY")}

    next()

}

module.exports = checkCitation