import express from "express"
import passport from "passport"
import validate from '@/utils/validate'
import UsersController from "@/controllers/users/users.controller"

const router = express.Router()


router.get('/',validate,UsersController.getUsers)
router.get('/friends',validate,UsersController.getFriends)
router.delete('/friends',passport.authenticate('jwt', { session: false }),validate,UsersController.deleteFriend)
router.get('/isfriend',passport.authenticate('jwt', { session: false }),validate,UsersController.isFriend)


export default router