import { Request, Response } from 'express'
import errorHandler from "@/utils/errorhandler"
import PostsService from '@/service/posts/post.service'

export default class PostsController {
    static create(req:Request,res:Response) {
        return errorHandler(req,res,PostsService.create.bind(PostsService))
    }
}