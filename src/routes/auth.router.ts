import express from "express"
import passport from "passport"
import registerValidator from "./validators/register"
import loginValidator from "./validators/login"
import verifyValidator from "./validators/verify"
import validate from '@/utils/validate'
import AuthController from "@/controllers/auth/auth.controller"

const router = express.Router()


router.post('/register',registerValidator,validate,AuthController.register)
router.post('/login',loginValidator,validate,passport.authenticate('local', { session: false }),AuthController.login)
router.patch('/verify', verifyValidator, validate, AuthController.verify)
router.post('/me',passport.authenticate('jwt', { session: false }),AuthController.me)

export default router