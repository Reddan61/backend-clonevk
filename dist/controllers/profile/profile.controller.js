"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("../../service/users/users.service"));
const errorhandler_1 = __importDefault(require("../../utils/errorhandler"));
class AuthController {
    static avatar(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.avatarUpload.bind(users_service_1.default));
    }
    static getAvatar(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.getAvatar.bind(users_service_1.default));
    }
    static getProfileInfo(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.getProfileInfo.bind(users_service_1.default));
    }
}
exports.default = AuthController;
