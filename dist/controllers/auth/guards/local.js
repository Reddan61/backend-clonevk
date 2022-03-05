"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const crypto_js_1 = __importDefault(require("crypto-js"));
const users_service_1 = __importDefault(require("../../../service/users/users.service"));
exports.default = new passport_local_1.Strategy({
    usernameField: 'email'
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_service_1.default.getUserByEmail(email);
        if (!user)
            return done(null, false);
        const passwordFromDB = crypto_js_1.default.AES.decrypt(user.password, process.env.SECRET_KEY).toString(crypto_js_1.default.enc.Utf8);
        if (password !== passwordFromDB || !user.isConfirmed)
            return done(null, false);
        return done(null, user);
    }
    catch (error) {
        done(error, false);
    }
}));
