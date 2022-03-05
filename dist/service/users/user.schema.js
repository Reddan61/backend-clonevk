"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        required: true,
        type: String
    },
    surname: {
        required: true,
        type: String
    },
    password: {
        required: false,
        type: String
    },
    email: {
        required: false,
        type: String
    },
    birthday: {
        day: {
            required: true,
            type: String
        },
        month: {
            required: true,
            type: String
        },
        year: {
            required: true,
            type: String
        }
    },
    avatar: {
        default: "",
        type: String
    },
    confirmCode: {
        required: false,
        type: String
    },
    isConfirmed: {
        default: false,
        type: Boolean
    },
    friends: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User'
    }
});
userSchema.index({ firstName: 'text', surname: 'text' });
exports.default = (0, mongoose_1.model)("User", userSchema);
