"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        default: ""
    },
    imagesIds: {
        type: [String],
        default: ""
    },
    date: {
        type: Date,
        default: new Date()
    },
    likes: {
        type: Number,
        default: 0
    },
    liked: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User'
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Post", postSchema);
