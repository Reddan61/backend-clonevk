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
    }
})

export default model("User", userSchema)