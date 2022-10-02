const express = require("express")
const app = express()
const cors = require("cors")

// DECLARE ROUTES
const userRoute = require("./routes/userRoutes")
const profilRoute = require("./routes/profilRoutes")
const citationRoute = require("./routes/citationsRoutes")
const refreshToken = require("./routes/refreshTokenRoute")

// CORS & JSON
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// DEPLOY ROUTES
app.use('/users',userRoute)
app.use('/profils',profilRoute)
app.use('/citations', citationRoute)
app.use('/refreshToken',refreshToken)


// launch server
app.listen(3000, ()=>console.log("SERVER START"))
