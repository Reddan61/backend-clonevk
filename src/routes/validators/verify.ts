import { body } from "express-validator"

export default [
    body("_id").isMongoId(),
    body("code").isLength({min:4,max:4})
]