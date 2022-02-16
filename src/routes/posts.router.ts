import express from "express"
import passport from "passport"
import PostsController from "@/controllers/posts/posts.controller"

const router = express.Router()

router.post('/create',passport.authenticate('jwt', { session: false }),PostsController.create)


export default router