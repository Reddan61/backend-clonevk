import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import UsersService from "@/service/users/users.service"

export default new JwtStrategy({
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (payload,done) => {
    try {
        const user = await UsersService.getUserById(payload._id)
    
        if(!user) return done(null, false)
    
        return done(null,user._id)
    } catch(error) {
        done(error,false)
    }
})