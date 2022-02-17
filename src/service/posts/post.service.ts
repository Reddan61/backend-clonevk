import ImagesService from '@/service/images/images.service';
import { Request, Response } from "express"
import { Types } from "mongoose";
import PostModel from "./post.schema";

export default class PostsService {
    static async create(req:Request,res:Response) {
        const body = req.body

        if(!Types.ObjectId.isValid(body.userId)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const public_ids = []

        if(body.images && body.images.length) {
            for(let i = 0; i < body.images.length; i++) {
                public_ids.push(await ImagesService.uploadImage(body.images[i]))
            }
        
        }
        const post = await PostModel.create({
            userId:body.userId,
            text:body.text,
            imagesIds: public_ids
        })

        res.status(200).json({
            message:"success",
            payload: {
                post
            }
        })
    }

    static async getUserPost(req:Request,res:Response) {
        const { id:userId, page = 1 } = req.query

        if(!userId || !Types.ObjectId.isValid(userId as string)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const pageSize = 10

        const totalPosts = await PostModel.countDocuments({userId}).exec()

        const totalPages = Math.ceil(totalPosts/pageSize)

        const skip = (Number(page) - 1) * pageSize < 0 ? totalPages * pageSize : (Number(page) - 1) * pageSize
            

        const limit = pageSize

        const posts = await PostModel.find({userId}).limit(limit).skip(skip).exec()

        res.status(200).json({
            message:"success",
            payload: {
                posts
            }
        })
    }
}