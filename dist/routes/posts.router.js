"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const posts_controller_1 = __importDefault(require("../controllers/posts/posts.controller"));
const router = express_1.default.Router();
router.post('/create', passport_1.default.authenticate('jwt', { session: false }), posts_controller_1.default.create);
router.get('/friends', passport_1.default.authenticate('jwt', { session: false }), posts_controller_1.default.getFriendsPosts);
router.get('/user', posts_controller_1.default.getUserPosts);
router.get('/like', passport_1.default.authenticate('jwt', { session: false }), posts_controller_1.default.isLiked);
router.patch('/like', passport_1.default.authenticate('jwt', { session: false }), posts_controller_1.default.setLike);
exports.default = router;
