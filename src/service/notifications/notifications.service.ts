import UsersService from '@/service/users/users.service';
import ImagesService from '@/service/images/images.service';
import { Request, Response } from "express"
import crypto from "crypto-js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import cloudinary from "@/utils/cloudinary"
import NotificationModel from "./notification.schema"
import { sendEmail } from "@/utils/email"

export default class NotificationsService {
    static async createFriendInvite(req:Request,res:Response) {
        const userId = req.user
        const body = req.body
  
        if(String(userId) === String(body.userId)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Нельзя добавить себя в друзья!"
                }
            })
            return
        }

        if(!mongoose.Types.ObjectId.isValid(body.userId) || !await UsersService.getUserById(userId as string) || !await UsersService.getUserById(body.userId as string)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }
        
        await NotificationModel.findOneAndDelete({
            author:userId,
            user:body.userId,
            type:"friend"
        })
        
        const payload = {
            author:userId,
            user:body.userId
        }

        const notification = await NotificationModel.create(payload)

        
        res.status(200).json({
            message:"success",
            payload: {
                isSent:true
            }
        })
    }

    static async acceptFriendInvite(req:Request,res:Response) {
        const userId = req.user
        const { notificationId } = req.body

        if(!mongoose.Types.ObjectId.isValid(notificationId)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Уведомление не найдено!"
                }
            })
            return
        }

        if(!await UsersService.getUserById(userId as string)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const notifications = await NotificationModel.find({
            _id:notificationId,
            user:userId
        }).exec()

        if(!notifications.length) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Уведомление не найдено!"
                }
            })
            return
        }


        await UsersService.addToFriendByIds(notifications[0].user,notifications[0].author)

        res.status(200).json({
            message:"success",
            payload: {
                isFriend:true
            }
        })
    }

    static async getNotifications(req:Request,res:Response) {
        const userId = req.user
        const { pageSize = 10, page = 1 } = req.query

        if(!mongoose.Types.ObjectId.isValid(userId as any)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const user = await UsersService.getUserById(userId as string)

        if(!user) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const optionSearch = {
            user:userId
        }

        const pageSizeNumber = Number(pageSize)

        const totalNotifications = await NotificationModel.countDocuments(optionSearch).exec()

        const totalPages = Math.ceil(totalNotifications/pageSizeNumber)

        const skip = (Number(page) - 1) * pageSizeNumber < 0 ? totalPages * pageSizeNumber : (Number(page) - 1) * pageSizeNumber
            
        const limit = pageSizeNumber

        const notifications = await NotificationModel.find(optionSearch).limit(limit).skip(skip).populate({path:"author",select:["firstName","surname","avatar"]}).exec()

        res.status(200).json({
            message:"success",
            payload: {
                notifications,
                totalPages,
                page
            }
        })
    }

    static async getTotalNotReadNotifications(req:Request,res:Response) {
        const userId = req.user

        if(!mongoose.Types.ObjectId.isValid(userId as any)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const user = await UsersService.getUserById(userId as string)


        if(!user) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const notifications = await NotificationModel.find({
            user:user._id,
            isRead:false
        }).exec()

        res.status(200).json({
            message:"success",
            payload: {
                totalNotifications:notifications.length
            }
        })
    }

    static async setIsReadNotification(req:Request,res:Response) {
        const userId = req.user
        const { notificationId } = req.body

        if(!mongoose.Types.ObjectId.isValid(notificationId as any)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Уведомление не найдено!"
                }
            })
            return
        }

        const notification = await NotificationModel.findOneAndUpdate({
            _id:notificationId,
            user:userId
        }, {
            isRead:true
        })

        res.status(200).json({
            message:"success",
            payload: {
                isRead:true
            }
        })
    }
}