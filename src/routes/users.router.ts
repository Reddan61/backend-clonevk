import express from "express"
import passport from "passport"
import validate from '@/utils/validate'
import UsersController from "@/controllers/users/users.controller"

const router = express.Router()


router.get('/',validate,UsersController.getUsers)
router.get('/friends',validate,UsersController.getFriends)
router.patch('/friends',passport.authenticate('jwt', { session: false }),validate,UsersController.addToFriend)


export default router