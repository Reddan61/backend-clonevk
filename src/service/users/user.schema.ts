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
        required:true,
        type:"string"
    },
    email:{
        required:true,
        type:"string"
    },
    confirmCode: {
        required:true,
        type:"string"
    },
    isConfirmed: {
        default:false,
        type:"boolean"
    }
})

export default model("User", userSchema)