import express from "express"
import ImagesController from "@/controllers/images/images.controller"

const router = express.Router()

router.get('/',ImagesController.getImages)

export default router