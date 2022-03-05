"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = __importDefault(require("../../utils/errorhandler"));
const post_service_1 = __importDefault(require("../../service/posts/post.service"));
class PostsController {
    static create(req, res) {
        return (0, errorhandler_1.default)(req, res, post_service_1.default.create.bind(post_service_1.default));
    }
    static getUserPosts(req, res) {
        return (0, errorhandler_1.default)(req, res, post_service_1.default.getUserPost.bind(post_service_1.default));
    }
    static getFriendsPosts(req, res) {
        return (0, errorhandler_1.default)(req, res, post_service_1.default.getFriendsPosts.bind(post_service_1.default));
    }
    static isLiked(req, res) {
        return (0, errorhandler_1.default)(req, res, post_service_1.default.isLiked.bind(post_service_1.default));
    }
    static setLike(req, res) {
        return (0, errorhandler_1.default)(req, res, post_service_1.default.setLike.bind(post_service_1.default));
    }
}
exports.default = PostsController;
