import express from "express"
import passport from "passport"
import ProfileController from "@/controllers/profile/profile.controller"

const router = express.Router()

router.patch('/avatar',passport.authenticate('jwt', { session: false }),ProfileController.avatar)
router.get('/avatar/:id',ProfileController.getAvatar)

export default router