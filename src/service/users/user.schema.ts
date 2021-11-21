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
    phone:{
        required:true,
        type:"string"
    }
})

export default model("User", userSchema)