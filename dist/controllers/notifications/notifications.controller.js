"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = __importDefault(require("../../utils/errorhandler"));
const notifications_service_1 = __importDefault(require("../../service/notifications/notifications.service"));
class NotificationsController {
    static getNotifications(req, res) {
        return (0, errorhandler_1.default)(req, res, notifications_service_1.default.getNotifications.bind(notifications_service_1.default));
    }
    static createFriendInvite(req, res) {
        return (0, errorhandler_1.default)(req, res, notifications_service_1.default.createFriendInvite.bind(notifications_service_1.default));
    }
    static acceptFriendInvite(req, res) {
        return (0, errorhandler_1.default)(req, res, notifications_service_1.default.acceptFriendInvite.bind(notifications_service_1.default));
    }
    static getTotalNotReadNotifications(req, res) {
        return (0, errorhandler_1.default)(req, res, notifications_service_1.default.getTotalNotReadNotifications.bind(notifications_service_1.default));
    }
    static setIsReadNotification(req, res) {
        return (0, errorhandler_1.default)(req, res, notifications_service_1.default.setIsReadNotification.bind(notifications_service_1.default));
    }
}
exports.default = NotificationsController;
