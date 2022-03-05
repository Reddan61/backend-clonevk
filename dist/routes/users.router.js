"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const validate_1 = __importDefault(require("../utils/validate"));
const users_controller_1 = __importDefault(require("../controllers/users/users.controller"));
const router = express_1.default.Router();
router.get('/', validate_1.default, users_controller_1.default.getUsers);
router.get('/friends', validate_1.default, users_controller_1.default.getFriends);
router.delete('/friends', passport_1.default.authenticate('jwt', { session: false }), validate_1.default, users_controller_1.default.deleteFriend);
router.get('/isfriend', passport_1.default.authenticate('jwt', { session: false }), validate_1.default, users_controller_1.default.isFriend);
exports.default = router;
