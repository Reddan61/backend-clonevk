import express from "express"
import passport from "passport"
import validate from '@/utils/validate'
import NotificationsController from "@/controllers/notifications/notifications.controller"

const router = express.Router()


router.get('/',passport.authenticate('jwt', { session: false }),validate,NotificationsController.getNotifications)
router.post('/',passport.authenticate('jwt', { session: false }),validate,NotificationsController.createFriendInvite)
router.patch('/',passport.authenticate('jwt', { session: false }),validate,NotificationsController.acceptFriendInvite)
router.patch('/read',passport.authenticate('jwt', { session: false }),validate,NotificationsController.setIsReadNotification)
router.get('/notread',passport.authenticate('jwt', { session: false }),validate,NotificationsController.getTotalNotReadNotifications)


export default router