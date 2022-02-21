import { Schema, model} from "mongoose"


const postSchema = new Schema({
    author: {
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
    date: {
        type:Date,
        default: new Date()
    },
    likes: {
        type:Number,
        default: 0
    },
    liked: {
        type: [Schema.Types.ObjectId], 
        ref: 'User'
    }
},{timestamps:true})

export default model("Post", postSchema)