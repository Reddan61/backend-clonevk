import { Request, Response } from 'express'
import errorHandler from "@/utils/errorhandler"
import NotificationsService from '@/service/notifications/notifications.service'

export default class NotificationsController {
    static getNotifications(req:Request,res:Response) {
        return errorHandler(req,res,NotificationsService.getNotifications.bind(NotificationsService))
    }
    static createFriendInvite(req:Request,res:Response) {
        return errorHandler(req,res,NotificationsService.createFriendInvite.bind(NotificationsService))
    }
    static acceptFriendInvite(req:Request,res:Response) {
        return errorHandler(req,res,NotificationsService.acceptFriendInvite.bind(NotificationsService))
    }
    static getTotalNotReadNotifications(req:Request,res:Response) {
        return errorHandler(req,res,NotificationsService.getTotalNotReadNotifications.bind(NotificationsService))
    }
    static setIsReadNotification(req:Request,res:Response) {
        return errorHandler(req,res,NotificationsService.setIsReadNotification.bind(NotificationsService))
    }
}