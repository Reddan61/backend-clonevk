"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = __importDefault(require("../../utils/errorhandler"));
const users_service_1 = __importDefault(require("../../service/users/users.service"));
class UsersController {
    static getUsers(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.getUsers.bind(users_service_1.default));
    }
    static getFriends(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.getFriends.bind(users_service_1.default));
    }
    static isFriend(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.isFriend.bind(users_service_1.default));
    }
    static deleteFriend(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.deleteFriend.bind(users_service_1.default));
    }
}
exports.default = UsersController;
