import express from "express"
import passport from "passport"
import { preRegister, setPassword }from "./validators/register"
import loginValidator from "./validators/login"
import { sendEmail, verify} from "./validators/verify"
import validate from '@/utils/validate'
import AuthController from "@/controllers/auth/auth.controller"

const router = express.Router()


router.patch('/setpassword',setPassword,validate,AuthController.firstPassword)
router.post('/preRegister',preRegister,validate,AuthController.preRegister)
router.patch('/send', sendEmail, validate, AuthController.sendEmail)
router.patch('/verify', verify, validate, AuthController.verify)
router.post('/login',loginValidator,validate,passport.authenticate('local', { session: false }),AuthController.login)
router.post('/me',passport.authenticate('jwt', { session: false }),AuthController.me)

export default router