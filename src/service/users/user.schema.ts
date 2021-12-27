import { Schema, model} from "mongoose"


const userSchema = new Schema({
    firstName: {
        required:true,
        type:"string"
    },
    surname: {
        required:true,
        type:"string"
    },
    password:{
        required:false,
        type:"string"
    },
    email:{
        required:false,
        type:"string"
    },
    birthday: {
        day: {
            required:true,
            type:"string"
        },
        month: {
            required:true,
            type:"string"
        },
        year: {
            required:true,
            type:"string"
        }
    },
    avatar: {
        default:"",
        type:"string"
    },
    confirmCode: {
        required:false,
        type:"string"
    },
    isConfirmed: {
        default:false,
        type:"boolean"
    }
})

export default model("User", userSchema)