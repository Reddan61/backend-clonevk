import { Request, Response } from 'express'
import ImagesService from '@/service/images/images.service'
import errorHandler from "@/utils/errorhandler"

export default class ImagesController {
    static getImages(req:Request,res:Response) {
        return errorHandler(req,res,ImagesService.getImageUrlByPublicId.bind(ImagesService,req,res,req.query!.public_id as string))
    }
}