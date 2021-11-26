import { Request, Response, NextFunction } from 'express';
import { validationResult } from "express-validator"


export default function(req:Request,res:Response,next:NextFunction) {
    const errors = validationResult(req).array({onlyFirstError:true})
    if(errors.length) {
        res.status(400).json({
            message:"error",
            payload: {
                errorMessage: "param: " + errors[0].param + " msg: " + errors[0].msg
            }
        })
        return
    }
    next()
}