import express from "express"
import passport from "passport"
import AuthController from "../controllers/auth/auth.controller"

const router = express.Router()


router.post('/register',AuthController.register)
router.post('/login',passport.authenticate('local', { session: false }),AuthController.login)
router.post('/test',passport.authenticate('jwt', { session: false }),AuthController.test)

export default router