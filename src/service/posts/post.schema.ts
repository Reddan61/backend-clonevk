import { Schema, model} from "mongoose"


const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    text: {
        type: String,
        default:""
    },
    imagesIds: {
        type: [String],
        default: ""
    },
    likes: {
        type:Number,
        default: 0
    }
})

export default model("Post", postSchema)