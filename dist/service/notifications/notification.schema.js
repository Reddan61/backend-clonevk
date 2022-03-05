"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    //from
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    //to
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: "friend"
    }
});
exports.default = (0, mongoose_1.model)("Notification", notificationSchema);
