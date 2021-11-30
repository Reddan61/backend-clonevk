import { Request, Response } from "express"
import crypto from "crypto-js"
import jwt from "jsonwebtoken"
import cloudinary from "@/utils/cloudinary"
import UserModel from "./user.schema"
import { sendEmail } from "@/utils/email"

export default class UsersService {
    static async me(req:Request,res:Response) {
        res.status(200).json({
            message:"success"
        })
    }
    
    static async register(req:Request,res:Response) {
        const form = req.body

        if(await this.getUserByEmail(form.email)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь с такой почтой существует!" 
                }
            })
            return
        }

        const newPassword = crypto.AES.encrypt(form.password, process.env.SECRET_KEY as string).toString()
        const generatedCode = String(Math.floor(Math.random() * ( 10000 - 1000) + 1000))
        
        await this.sendEmailToUser(form.email,generatedCode)

        const newUser = {
            firstName: form.firstName,
            surname:form.surname,
            password:newPassword,
            email:form.email,
            birthday: form.birthday,
            confirmCode:generatedCode
        }

        const user = await UserModel.create(newUser)

        res.status(201).json({
            message:"success",
            payload: {
                user: {
                    _id:user._id
                }
            }
        })
    }

    static async login(req:Request,res:Response) {
        interface UserRequest {
            email:string,
            password:string
        }

        const user = await this.getUserByEmail((req.user as UserRequest).email )

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

    static async verify(req:Request,res:Response) {
        const body = req.body

        const user = await this.getUserById(body._id)

        if(!user) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователя не существует!"
                }
            })
            return
        }

        if(user.confirmCode !== body.code) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Неправильный код!"
                }
            })
            return
        }

        await user.updateOne({
            isConfirmed:true
        })

        res.status(200).json({
            message:"success"
        })
    }

    static async avatarUpload(req:Request,res:Response) {
        const imageBase64 = req.body.image 
        const user = await UserModel.findById((req.user as { _id:any})._id).exec()
        if(user.avatar.length) {
            await cloudinary.api.delete_resources([user.avatar])
        }

        const uploadedResponse = await cloudinary.uploader.upload(imageBase64, {
            folder:"clone-vk"
        })
       
        await user.updateOne({
            avatar: uploadedResponse.public_id
        })

        res.status(200).json({
            message:"success",
            payload: {
                image_url: uploadedResponse.public_id
            }
        })
    }

    static async sendEmailToUser(email:string,code:string) {
       return sendEmail({
            to:email,
            subject:"Подтверждение почты",
            code
        })
    }

    static async getUserByEmail(email:string) {
        const result = await UserModel.findOne({
            email
        }).exec()

        return result
    }

    static async getUserById(id:string) {
        const result = await UserModel.findById(id).exec()
        
        return result
    }
}