import dotenv from "dotenv"
dotenv.config();
import express from "express"
import bodyParser from "body-parser"
import http from "http"
import passport from "passport"
import cors from "cors"
import authRouter from "@/routes/auth.router"
import profileRouter from "@/routes/profile.router"
import imagesRouter from "@/routes/images.router"
import connectToDataBase from "./db/mongo"
import LocalStrategy from "@/controllers/auth/guards/local"
import JwtStrategy from "@/controllers/auth/guards/jwt"

const app = express()
const server = http.createServer(app)

app.use(cors({
    origin: process.env.CLIENT_URL
}))
app.use(bodyParser.urlencoded({extended: true,limit:"50mb"}))
app.use(bodyParser.json({limit:"50mb"}))

//Strategies
passport.use("local",LocalStrategy)
passport.use("jwt",JwtStrategy)
app.use(passport.initialize());

//routes
app.use("/auth",authRouter)
app.use("/profile",profileRouter)
app.use("/images",imagesRouter)



async function startServer() {
    try {
        await connectToDataBase()
        server.listen(process.env.PORT || 8888,() => {
            console.log("Server started")
        })
        .on("error", (err) => {
            console.log(err)
        })
    } catch (error) {
        startServer()
    }
}

startServer()
