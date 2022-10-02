const multer = require ('multer')
const path= require('path')

const fileStorage= multer.diskStorage({
    destination:(req,file,callback)=>{
        const stockageIMG= 'images'
        callback(null, stockageIMG)
    },
    filename:(req,file,callback)=>{
        const extension= file.mimetype.split('/')[1]
        const fileNameFinale= Date.now() + '_' + Math.round(Math.random() * 1E15) + '.' + extension
        callback(null,fileNameFinale)
    }
})

const upload=multer({storage:fileStorage, 
                     limits:{fileSize:100000},
                     fileFilter:(req,file,callback)=>{
                        if(path.extname(file.originalname)=='.png' || path.extname(file.originalname)=='.jpg' || path.extname(file.originalname)=='.jpeg'){callback(null, true)}
                        else{callback(new Error("FILE NOT SUPPORTED"))}
                     }})

module.exports=upload