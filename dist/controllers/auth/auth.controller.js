"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("../../service/users/users.service"));
const errorhandler_1 = __importDefault(require("../../utils/errorhandler"));
class AuthController {
    static preRegister(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.preRegister.bind(users_service_1.default));
    }
    static firstPassword(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.setFirstPassword.bind(users_service_1.default));
    }
    static login(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.login.bind(users_service_1.default));
    }
    static sendEmail(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.sendEmail.bind(users_service_1.default));
    }
    static verify(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.verify.bind(users_service_1.default));
    }
    static me(req, res) {
        return (0, errorhandler_1.default)(req, res, users_service_1.default.me.bind(users_service_1.default));
    }
}
exports.default = AuthController;
