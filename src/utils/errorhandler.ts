import { Response, Request } from "express"

export default function errorHandler(
        req:Request, 
        res:Response, 
        Controller: (req:Request,res:Response) => any
    ) {
    try {
        Controller(req,res)
    } catch(error) {
        console.log(error)
        res.status(500).json({
            message:"error",
            payload: {
                errorMessage: "Что-то пошло не так!"
            }
        })
    }
}