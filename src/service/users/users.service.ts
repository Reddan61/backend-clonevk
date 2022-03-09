import ImagesService from '@/service/images/images.service';
import { Request, Response } from "express"
import crypto from "crypto-js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import cloudinary from "@/utils/cloudinary"
import UserModel from "./user.schema"
import { sendEmail } from "@/utils/email"

export default class UsersService {
    static async me(req:Request,res:Response) {
        res.status(200).json({
            message:"success",
            payload: {
                _id:req.user
            }
        })
    }
    
    static async preRegister(req:Request,res:Response) {
        const form = req.body

        const newUser = {
            firstName: form.firstName,
            surname:form.surname,
            birthday: form.birthday
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
    
    static async sendEmail(req:Request,res:Response) {
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

        const foundUserByEmail = await this.getUserByEmail(body.email)

        if(foundUserByEmail && foundUserByEmail.isConfirmed && foundUserByEmail.password.length) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь с такой почтой уже существует!"
                }
            })
            return
        }
        
        if(foundUserByEmail) {
            await UserModel.findByIdAndDelete(foundUserByEmail._id)
        }
        
        const generatedCode = String(Math.floor(Math.random() * ( 10000 - 1000) + 1000))
        
        await user.updateOne({
            email:body.email,
            confirmCode:generatedCode
        })

        await this.sendEmailToUser(body.email,generatedCode)

        res.status(201).json({
            message:"success",
            payload: {}
        })
    }

    static async setFirstPassword(req:Request,res:Response) {
        const body = req.body

        const newPassword = crypto.AES.encrypt(body.password, process.env.SECRET_KEY as string).toString()
        
        const user = await this.getUserById(body._id)
        
        if(!user || user.password) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователя не существует!"
                }
            })
            return
        }

        await user.updateOne({
            password:newPassword
        })

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
            _id:string,
            password:string
        }
        
        const token = jwt.sign({_id: (req.user as UserRequest)._id},process.env.SECRET_KEY as string,{ 
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
            confirmCode:"",
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

        const public_id = await ImagesService.uploadImage(imageBase64)
       
        await user.updateOne({
            avatar: public_id
        })

        res.status(200).json({
            message:"success",
            payload: {
                public_id
            }
        })
    }

    static async getAvatar(req:Request,res:Response) {
        const { id:userId } = req.params
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const user = await UserModel.findById(userId).exec()

        if(!user) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        res.status(200).json({
            message:"success",
            payload: {
                public_id: user.avatar
            }
        })
    }

    static async getProfileInfo(req:Request,res:Response) {
        const { id:userId } = req.params

        if(!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const user = await UserModel.findById(userId).exec()

        if(!user) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        res.status(200).json({
            message:"success",
            payload: {
                user: {
                    _id:user._id,
                    firstName: user.firstName,
                    surname: user.surname,
                    birthday:user.birthday
                }
            }
        })
    }
    static async getUsers(req:Request,res:Response) {
        const { search = "",pageSize = 10, page = 1 } = req.query

        const pageSizeNumber = Number(pageSize)
        const optionSearch = {
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { surname: { $regex: search, $options: 'i' } }
            ],
            isConfirmed:true
        }

        const totalPosts = await UserModel.countDocuments(optionSearch).exec()

        const totalPages = Math.ceil(totalPosts/pageSizeNumber)

        const skip = (Number(page) - 1) * pageSizeNumber < 0 ? totalPages * pageSizeNumber : (Number(page) - 1) * pageSizeNumber
            
        const limit = pageSizeNumber

        const users = await UserModel.find(optionSearch).limit(limit).skip(skip).select(["surname","firstName","avatar"]).exec()

        res.status(200).json({
            message:"success",
            payload: {
                users,
                totalPages,
                page
            }
        })
    }
    static async addToFriendByIds(userId:string,friendId:string) {
        const user = await this.getUserById(userId)
        const friend = await this.getUserById(friendId)

        await user.updateOne({
            $pull: {
                friends: friend._id
            }
        })
        await friend.updateOne({
            $pull: {
                friends: user._id
            }
        })

        await user.updateOne({
            $push: {
                friends: friend._id
            }
        })
        await friend.updateOne({
            $push: {
                friends: user._id
            }
        })
    }
    


    static async deleteFriend(req:Request,res:Response) {
        const userId = req.user
        const body = req.body

        if(!mongoose.Types.ObjectId.isValid(body.userId)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const user = await UserModel.findById(userId).exec()
        const friend = await UserModel.findById(body.userId).exec()

        if(!friend) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }
    
        await user.updateOne({
            $pull: {
                friends: friend._id
            }
        })
        await friend.updateOne({
            $pull: {
                friends: user._id
            }
        })
        
        res.status(200).json({
            message:"success",
            payload: {
                isFriend:false
            }
        })
    }

    static async getFriends(req:Request,res:Response) {
        const { userId, search = "",pageSize = 10, page = 1 } = req.query

        if(!mongoose.Types.ObjectId.isValid(userId as any)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const user = await UserModel.findById(userId).exec()

        if(!user) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const pageSizeNumber = Number(pageSize)

        const optionSearch = {
            _id: {
                $in: user.friends
            },
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { surname: { $regex: search, $options: 'i' } }
            ],
            isConfirmed:true
        }

        const totalPosts = await UserModel.countDocuments(optionSearch).exec()

        const totalPages = Math.ceil(totalPosts/pageSizeNumber)

        const skip = (Number(page) - 1) * pageSizeNumber < 0 ? totalPages * pageSizeNumber : (Number(page) - 1) * pageSizeNumber
            
        const limit = pageSizeNumber

        const users = await UserModel.find(optionSearch).limit(limit).skip(skip).select(["surname","firstName","avatar"]).exec()

        res.status(200).json({
            message:"success",
            payload: {
                users,
                totalPages,
                page
            }
        })
    }

    static async isFriend(req:Request,res:Response) {
        const IdAuthUser = req.user
        const { userId } = req.query

        if(!mongoose.Types.ObjectId.isValid(userId as any)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const friend = await UserModel.findById(userId).exec()
        const authUser = await UserModel.findById(IdAuthUser).exec()

        if(!friend || !authUser) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }
        const isFriend =  friend.friends.includes(authUser._id) && authUser.friends.includes(friend._id) 

        res.status(200).json({
            message:"success",
            payload: {
                isFriend
            }
        })
    }

    
    static async getFriendsById(userId:string) {
        const user = await UserModel.findById(userId).exec()
        const friends = await UserModel.find({
            _id: {
                $in:user.friends
            },
            friends:user._id
        }).distinct("_id").exec()
        
        return friends
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
            email,
            isConfirmed:true
        }).exec()

        return result
    }

    static async getUserById(id:string) {
        const result = await UserModel.findById(id).exec()
        
        return result
    }
}