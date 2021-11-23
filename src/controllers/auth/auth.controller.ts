import { Request, Response } from 'express'
import UsersService from '@/service/users/users.service'
import errorHandler from "@/utils/errorhandler"

export default class AuthController {
    static register(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.register.bind(UsersService))
    }
    static login(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.login.bind(UsersService))
    }

    static verify(req:Request,res:Response) {
        return errorHandler(req,res,UsersService.verify.bind(UsersService))
    }

    static test(req:Request,res:Response) {
        console.log(req.user)
    }
}