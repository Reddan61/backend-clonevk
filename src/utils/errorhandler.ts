import { Response, Request } from "express"

export default async function errorHandler(
        req:Request, 
        res:Response, 
        Controller: (req:Request,res:Response) => any
    ) {
    try {
        await Controller(req,res)
    } catch(error) {
        console.error(error)
        return res.status(500).json({
            message:"error",
            payload: {
                errorMessage: "Something went wrong"
            }
        })
    }
}