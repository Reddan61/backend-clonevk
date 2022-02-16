import { Request, Response} from "express"
import cloudinary from "@/utils/cloudinary"

export default class ImagesService {
    static async getImageUrlByPublicId(req:Request,res:Response,public_id:string) {
        const result = await cloudinary.api.resource(public_id)

        res.status(200).json({
            message:"success",
            payload: {
                image_url: result.url
            }
        })
    }

    static async uploadImage(imageBase64:string) {
        const uploadedResponse = await cloudinary.uploader.upload(imageBase64, {
            folder:"clone-vk"
        })

        return uploadedResponse.public_id
    }
}