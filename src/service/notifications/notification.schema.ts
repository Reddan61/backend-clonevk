import { Schema, model} from "mongoose"


const notificationSchema = new Schema({
    //from
    author: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    //to
    user: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    isRead: {
        type:Boolean,
        default:false
    },
    type:{
        type:String,
        default:"friend"
    }
})

export default model("Notification", notificationSchema)