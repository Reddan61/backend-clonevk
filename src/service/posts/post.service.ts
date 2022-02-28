import ImagesService from '@/service/images/images.service';
import { Request, Response } from "express"
import { Types } from "mongoose";
import UsersService from '../users/users.service';
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
            author:body.userId,
            text:body.text,
            imagesIds: public_ids
        })

        const newPost = await post.populate({path:"author",select:["_id","avatar","firstName","surname"]})

        res.status(200).json({
            message:"success",
            payload: {
                post:newPost
            }
        })
    }

    static async getUserPost(req:Request,res:Response) {
        const { userId, page = 1 } = req.query
  
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

        const totalPosts = await PostModel.countDocuments({author:userId}).exec()

        const totalPages = Math.ceil(totalPosts/pageSize)

        const skip = (Number(page) - 1) * pageSize < 0 ? totalPages * pageSize : (Number(page) - 1) * pageSize
            

        const limit = pageSize

        const posts = await PostModel.find({author:userId}).sort({createdAt: 'desc'}).populate({path:"author",select:["_id","avatar","firstName","surname"]}).limit(limit).skip(skip).exec()
        
        res.status(200).json({
            message:"success",
            payload: {
                pageSize,
                totalPages,
                posts
            }
        })
    }

    static async getFriendsPosts(req:Request,res:Response) {
        const { userId, page = 1, pageSize = 10 } = req.query
        const pageSizeNumber = +pageSize
        if(!userId || !Types.ObjectId.isValid(userId as string)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь не найден!"
                }
            })
            return
        }

        const friendsIds = await UsersService.getFriendsById(userId as string)

        const filterObject = {
            author: {
                $in:friendsIds
            }
        }

        const totalPosts = await PostModel.countDocuments(filterObject).exec()

        const totalPages = Math.ceil(totalPosts/pageSizeNumber)

        const skip = (Number(page) - 1) * pageSizeNumber < 0 ? totalPages * pageSizeNumber : (Number(page) - 1) * pageSizeNumber
            

        const limit = pageSizeNumber

        const posts = await PostModel.find(filterObject).sort({createdAt: 'desc'}).populate({path:"author",select:["_id","avatar","firstName","surname"]}).limit(limit).skip(skip).exec()
        

        res.status(200).json({
            message:"success",
            payload: {
                page,
                totalPages,
                posts
            }
        })
    }

    static async isLiked(req:Request,res:Response) {
        const userId = req.user
        const {
            postId
        } = req.query

        if(!userId || !Types.ObjectId.isValid(userId as string) || !postId || !Types.ObjectId.isValid(postId as string)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пользователь или пост не найден!"
                }
            })
            return
        }

        const post = await PostModel.find({
            _id:postId,
            liked: {
                $in:userId
            }
        }).exec()
        
        res.status(200).json({
            message:"success",
            payload: {
                isLiked:Boolean(post.length)
            }
        })
    }

    static async setLike(req:Request,res:Response) {
        const _id = req.user
        const { postId } = req.body
        
        if(!Types.ObjectId.isValid(postId as string)) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пост не найден!"
                }
            })
            return
        }

        const post = await PostModel.findById(postId).exec()
        
        if(!post) {
            res.status(400).json({
                message:"error",
                payload: {
                    errorMessage:"Пост не найден!"
                }
            })
            return
        }

        const isLiked = await PostModel.find({
            _id:postId,
            liked: {
                $in:[_id]
            }
        })

        let postResult
        
        if(isLiked.length) {
            postResult = await PostModel.findOneAndUpdate({
                _id:postId
            },{
                $inc : {
                    likes:-1
                },
                $pull:{
                    liked:_id
                }
            }, {
                new:true
            })
        } else {
            postResult = await PostModel.findOneAndUpdate({
                _id:postId
            },{
                $inc : {
                    likes:1
                },
                $push:{
                    liked:_id
                }
            }, {
                new:true
            })
        }

        res.status(200).json({
            message:"success",
            payload: {
                isLiked: isLiked.length ? false : true,
                likes:postResult.likes
            }
        })
    }
}