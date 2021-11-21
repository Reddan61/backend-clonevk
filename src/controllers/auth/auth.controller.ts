import { Request, Response } from 'express'
import UsersService from '@/service/users/users.service'

export default class AuthController {
    static register(req:Request,res:Response) {
        return UsersService.register(req,res)
    }
    static login(req:Request,res:Response) {
        return UsersService.login(req,res)
    }

    static test(req:Request,res:Response) {
        console.log(req.user)
    }
}