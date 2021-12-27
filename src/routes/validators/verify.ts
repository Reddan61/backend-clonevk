import { body } from "express-validator"

export const sendEmail = [
    body("_id").isMongoId(),
    body("email").isEmail()
]

export const verify = [
    body("_id").isMongoId(),
    body("code").isLength({min:4,max:4})
]