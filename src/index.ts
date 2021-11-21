import dotenv from "dotenv"
dotenv.config();
import express from "express"
import bodyParser from "body-parser"
import http from "http"
import passport from "passport"
import authRouter from "./routes/auth.router"
import connectToDataBase from "./db/mongo"
import LocalStrategy from "@/controllers/auth/guards/local"
import JwtStrategy from "@/controllers/auth/guards/jwt"

const app = express()
const server = http.createServer(app)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Strategies
passport.use("local",LocalStrategy)
passport.use("jwt",JwtStrategy)
app.use(passport.initialize());

//routes
app.use("/auth",authRouter)



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
