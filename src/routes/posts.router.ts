import express from "express"
import passport from "passport"
import PostsController from "@/controllers/posts/posts.controller"

const router = express.Router()

router.post('/create',passport.authenticate('jwt', { session: false }),PostsController.create)
router.get('/user',PostsController.getUserPosts)
router.get('/like',passport.authenticate('jwt', { session: false }),PostsController.isLiked)
router.patch('/like',passport.authenticate('jwt', { session: false }),PostsController.setLike)


export default router