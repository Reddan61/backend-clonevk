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
const users_service_1 = __importDefault(require("../../service/users/users.service"));
const mongoose_1 = __importDefault(require("mongoose"));
const notification_schema_1 = __importDefault(require("./notification.schema"));
class NotificationsService {
    static createFriendInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user;
            const body = req.body;
            if (String(userId) === String(body.userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Нельзя добавить себя в друзья!"
                    }
                });
                return;
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(body.userId) || !(yield users_service_1.default.getUserById(userId)) || !(yield users_service_1.default.getUserById(body.userId))) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            yield notification_schema_1.default.findOneAndDelete({
                author: userId,
                user: body.userId,
                type: "friend"
            });
            const payload = {
                author: userId,
                user: body.userId
            };
            const notification = yield notification_schema_1.default.create(payload);
            res.status(200).json({
                message: "success",
                payload: {
                    isSent: true
                }
            });
        });
    }
    static acceptFriendInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user;
            const { notificationId } = req.body;
            if (!mongoose_1.default.Types.ObjectId.isValid(notificationId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Уведомление не найдено!"
                    }
                });
                return;
            }
            if (!(yield users_service_1.default.getUserById(userId))) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const notifications = yield notification_schema_1.default.find({
                _id: notificationId,
                user: userId
            }).exec();
            if (!notifications.length) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Уведомление не найдено!"
                    }
                });
                return;
            }
            yield users_service_1.default.addToFriendByIds(notifications[0].user, notifications[0].author);
            res.status(200).json({
                message: "success",
                payload: {
                    isFriend: true
                }
            });
        });
    }
    static getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user;
            const { pageSize = 10, page = 1 } = req.query;
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const user = yield users_service_1.default.getUserById(userId);
            if (!user) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const optionSearch = {
                user: userId
            };
            const pageSizeNumber = Number(pageSize);
            const totalNotifications = yield notification_schema_1.default.countDocuments(optionSearch).exec();
            const totalPages = Math.ceil(totalNotifications / pageSizeNumber);
            const skip = (Number(page) - 1) * pageSizeNumber < 0 ? totalPages * pageSizeNumber : (Number(page) - 1) * pageSizeNumber;
            const limit = pageSizeNumber;
            const notifications = yield notification_schema_1.default.find(optionSearch).limit(limit).skip(skip).populate({ path: "author", select: ["firstName", "surname", "avatar"] }).exec();
            res.status(200).json({
                message: "success",
                payload: {
                    notifications,
                    totalPages,
                    page
                }
            });
        });
    }
    static getTotalNotReadNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user;
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const user = yield users_service_1.default.getUserById(userId);
            if (!user) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const notifications = yield notification_schema_1.default.find({
                user: user._id,
                isRead: false
            }).exec();
            res.status(200).json({
                message: "success",
                payload: {
                    totalNotifications: notifications.length
                }
            });
        });
    }
    static setIsReadNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user;
            const { notificationId } = req.body;
            if (!mongoose_1.default.Types.ObjectId.isValid(notificationId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Уведомление не найдено!"
                    }
                });
                return;
            }
            const notification = yield notification_schema_1.default.findOneAndUpdate({
                _id: notificationId,
                user: userId
            }, {
                isRead: true
            });
            res.status(200).json({
                message: "success",
                payload: {
                    isRead: true
                }
            });
        });
    }
}
exports.default = NotificationsService;
