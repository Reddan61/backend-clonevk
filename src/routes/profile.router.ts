import express from "express"
import passport from "passport"
import ProfileController from "@/controllers/profile/profile.controller"

const router = express.Router()

router.post('/avatar',passport.authenticate('jwt', { session: false }),ProfileController.avatar)

export default router