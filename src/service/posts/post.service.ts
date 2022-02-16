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
}