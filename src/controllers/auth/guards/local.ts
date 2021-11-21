import { Strategy as LocalStrategy } from "passport-local"
import crypto from "crypto-js"
import UsersService from '@/service/users/users.service'

export default new LocalStrategy({
    usernameField: 'phone'
},async (phone,password,done) => {
    try {
        const user = await UsersService.getUserByPhone(phone)

        if(!user) return done(null,false)

        const passwordFromDB  = crypto.AES.decrypt(user.password, process.env.SECRET_KEY as string).toString(crypto.enc.Utf8)

        if(password !== passwordFromDB) return done(null,false)

        return done(null,user)
    } catch (error) {
        done(error,false)
    }
})