"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const profile_controller_1 = __importDefault(require("../controllers/profile/profile.controller"));
const router = express_1.default.Router();
router.patch('/avatar', passport_1.default.authenticate('jwt', { session: false }), profile_controller_1.default.avatar);
router.get('/avatar/:id', profile_controller_1.default.getAvatar);
router.get('/info/:id', profile_controller_1.default.getProfileInfo);
exports.default = router;
