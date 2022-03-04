import { Request, Response } from 'express'
import errorHandler from "@/utils/errorhandler"
import UsersService from '@/service/users/users.service'

export default class UsersController {
    static getUsers(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.getUsers.bind(UsersService))
    }
    static getFriends(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.getFriends.bind(UsersService))
    }
    static getNotifications(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.getNotifications.bind(UsersService))
    }
    static sendFriendInvite(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.sendFriendInvite.bind(UsersService))
    }
    static acceptFriendInvite(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.acceptFriendInvite.bind(UsersService))
    }
    static isFriend(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.isFriend.bind(UsersService))
    }
    static deleteFriend(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.deleteFriend.bind(UsersService))
    }
}