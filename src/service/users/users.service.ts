import { Request, Response } from "express"
import crypto from "crypto-js"
import jwt from "jsonwebtoken"
import UserModel from "./user.schema"

export default class UsersService {
    static async register(req:Request,res:Response) {
        const form = req.body
        
        const newPassword = crypto.AES.encrypt(form.password, process.env.SECRET_KEY as string).toString()
        
        const newUser = {
            firstName: form.firstName,
            surname:form.surname,
            password:newPassword,
            phone:form.phone
        }

        await UserModel.create(newUser)

        res.status(201).json({
            message:"success"
        })
    }

    static async login(req:Request,res:Response) {
        interface UserRequest {
            phone:string,
            password:string
        }

        const user = await this.getUserByPhone((req.user as UserRequest).phone )

        const token = jwt.sign({_id: user._id},process.env.SECRET_KEY as string,{ 
            expiresIn: "1d" 
        })

        res.status(200).json({
            message:"success",
            payload: {
                token
            }
        })
    }

    static async getUserByPhone(phone:string) {
        const result = await UserModel.findOne({
            phone
        }).exec()

        return result
    }

    static async getUserById(id:string) {
        const result = await UserModel.findById(id).exec()
        
        return result
    }
}