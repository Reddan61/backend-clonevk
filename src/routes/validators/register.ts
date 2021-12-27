import { body } from "express-validator"

export const preRegister = [
    body("firstName").isLength({min:2}),
    body("surname").isLength({min:2}),
    body("birthday").custom((value) => {
        const day = value.day
        const month = value.month
        const year = value.year

        if(day.length <= 0 || day.length > 2 ) throw new Error("Day length must not be less than 1 or greater than 2")
        if(month.length <= 0 || month.length > 2 ) throw new Error("Month length must not be less than 1 or greater than 2")
        if(year.length <= 0 || year.length > 4 ) throw new Error("Year length must not be less than 1 or greater than 4")
        
        if(Number(day) <= 0 || Number(day) > 31 ) throw new Error("Day is incorrect")
        if(Number(month) <= 0 || Number(month) > 12 ) throw new Error("Month is incorrect")
        if(Number(year) <= Number(new Date().getFullYear()) - 100 || Number(year) > Number(new Date().getFullYear()) ) throw new Error("Year is incorrect")

        return true
    })
]


export const setPassword = [
    body("_id").isMongoId(),
    body("password").isLength({min:2})
]

export default [
    // body("firstName").isLength({min:2}),
    // body("surname").isLength({min:2}),
    // body("email").isEmail(),
    // body("password").isLength({min:2}),
    // body("passwordConfirm").custom((value,{req}) => {
    //     if(value !== req.body.password) {
    //         throw new Error("Password confirmation does not match password")
    //     }
    //     return true
    // }),
    // body("birthday").custom((value) => {
    //     const day = value.day
    //     const month = value.month
    //     const year = value.year

    //     if(day.length <= 0 || day.length > 2 ) throw new Error("Day length must not be less than 1 or greater than 2")
    //     if(month.length <= 0 || month.length > 2 ) throw new Error("Month length must not be less than 1 or greater than 2")
    //     if(year.length <= 0 || year.length > 4 ) throw new Error("Year length must not be less than 1 or greater than 4")
        
    //     if(Number(day) <= 0 || Number(day) > 31 ) throw new Error("Day is incorrect")
    //     if(Number(month) <= 0 || Number(month) > 12 ) throw new Error("Month is incorrect")
    //     if(Number(year) <= Number(new Date().getFullYear()) - 100 || Number(year) > Number(new Date().getFullYear()) ) throw new Error("Year is incorrect")

    //     return true
    // })
]