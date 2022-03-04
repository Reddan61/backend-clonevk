import { Schema, model} from "mongoose"


const userSchema = new Schema({
    firstName: {
        required:true,
        type:String
    },
    surname: {
        required:true,
        type:String
    },
    password:{
        required:false,
        type:String
    },
    email:{
        required:false,
        type:String
    },
    birthday: {
        day: {
            required:true,
            type:String
        },
        month: {
            required:true,
            type:String
        },
        year: {
            required:true,
            type:String
        }
    },
    avatar: {
        default:"",
        type:String
    },
    confirmCode: {
        required:false,
        type:String
    },
    isConfirmed: {
        default:false,
        type:Boolean
    },
    friends: {
        type: [Schema.Types.ObjectId], 
        ref: 'User'
    },
    notifications: {
        type: [
            {
                userId: {
                    type:Schema.Types.ObjectId,
                    ref: 'User'
                },
                isReaded: {
                    type:Boolean,
                    default:false
                },
                type:{
                    type:String,
                    default:"friend"
                }
            }
        ],
        default: []
    }
})

userSchema.index({firstName:'text',surname:'text'})

export default model("User", userSchema)