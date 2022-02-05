import { Request, Response } from 'express'
import UsersService from '@/service/users/users.service'
import errorHandler from "@/utils/errorhandler"

export default class AuthController {
    static avatar(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.avatarUpload.bind(UsersService))
    }

    static getAvatar(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.getAvatar.bind(UsersService))
    }

    static getProfileInfo(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.getProfileInfo.bind(UsersService))
    }
}