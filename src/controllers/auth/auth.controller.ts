import { Request, Response } from 'express'
import UsersService from '@/service/users/users.service'
import errorHandler from "@/utils/errorhandler"

export default class AuthController {
    static preRegister(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.preRegister.bind(UsersService))
    }
    static firstPassword(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.setFirstPassword.bind(UsersService))
    }
    static login(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.login.bind(UsersService))
    }

    static sendEmail(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.sendEmail.bind(UsersService))
    }

    static verify(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.verify.bind(UsersService))
    }

    static me(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.me.bind(UsersService))
    }
}