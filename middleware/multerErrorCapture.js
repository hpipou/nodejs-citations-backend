const multer = require('multer')

const errCaptureFromMulter=(err, req, res, next)=>{

    if(err instanceof multer.MulterError)
    {return res.status(403).json("FILE MAX SIZE : 100 Ko")}
    else{
        return res.status(403).json("SUPPORTED FILES : JPG / JPEG / PNG")
    }
}

module.exports=errCaptureFromMulter