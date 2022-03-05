"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const validate_1 = __importDefault(require("../utils/validate"));
const notifications_controller_1 = __importDefault(require("../controllers/notifications/notifications.controller"));
const router = express_1.default.Router();
router.get('/', passport_1.default.authenticate('jwt', { session: false }), validate_1.default, notifications_controller_1.default.getNotifications);
router.post('/', passport_1.default.authenticate('jwt', { session: false }), validate_1.default, notifications_controller_1.default.createFriendInvite);
router.patch('/', passport_1.default.authenticate('jwt', { session: false }), validate_1.default, notifications_controller_1.default.acceptFriendInvite);
router.patch('/read', passport_1.default.authenticate('jwt', { session: false }), validate_1.default, notifications_controller_1.default.setIsReadNotification);
router.get('/notread', passport_1.default.authenticate('jwt', { session: false }), validate_1.default, notifications_controller_1.default.getTotalNotReadNotifications);
exports.default = router;
