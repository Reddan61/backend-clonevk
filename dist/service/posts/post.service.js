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
const images_service_1 = __importDefault(require("../../service/images/images.service"));
const mongoose_1 = require("mongoose");
const users_service_1 = __importDefault(require("../users/users.service"));
const post_schema_1 = __importDefault(require("./post.schema"));
class PostsService {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            if (!mongoose_1.Types.ObjectId.isValid(body.userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const public_ids = [];
            if (body.images && body.images.length) {
                for (let i = 0; i < body.images.length; i++) {
                    public_ids.push(yield images_service_1.default.uploadImage(body.images[i]));
                }
            }
            const post = yield post_schema_1.default.create({
                author: body.userId,
                text: body.text,
                imagesIds: public_ids
            });
            const newPost = yield post.populate({ path: "author", select: ["_id", "avatar", "firstName", "surname"] });
            res.status(200).json({
                message: "success",
                payload: {
                    post: newPost
                }
            });
        });
    }
    static getUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, page = 1 } = req.query;
            if (!userId || !mongoose_1.Types.ObjectId.isValid(userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const pageSize = 10;
            const totalPosts = yield post_schema_1.default.countDocuments({ author: userId }).exec();
            const totalPages = Math.ceil(totalPosts / pageSize);
            const skip = (Number(page) - 1) * pageSize < 0 ? totalPages * pageSize : (Number(page) - 1) * pageSize;
            const limit = pageSize;
            const posts = yield post_schema_1.default.find({ author: userId }).sort({ createdAt: 'desc' }).populate({ path: "author", select: ["_id", "avatar", "firstName", "surname"] }).limit(limit).skip(skip).exec();
            res.status(200).json({
                message: "success",
                payload: {
                    pageSize,
                    totalPages,
                    posts
                }
            });
        });
    }
    static getFriendsPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, page = 1, pageSize = 10 } = req.query;
            const pageSizeNumber = +pageSize;
            if (!userId || !mongoose_1.Types.ObjectId.isValid(userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const friendsIds = yield users_service_1.default.getFriendsById(userId);
            const filterObject = {
                author: {
                    $in: friendsIds
                }
            };
            const totalPosts = yield post_schema_1.default.countDocuments(filterObject).exec();
            const totalPages = Math.ceil(totalPosts / pageSizeNumber);
            const skip = (Number(page) - 1) * pageSizeNumber < 0 ? totalPages * pageSizeNumber : (Number(page) - 1) * pageSizeNumber;
            const limit = pageSizeNumber;
            const posts = yield post_schema_1.default.find(filterObject).sort({ createdAt: 'desc' }).populate({ path: "author", select: ["_id", "avatar", "firstName", "surname"] }).limit(limit).skip(skip).exec();
            res.status(200).json({
                message: "success",
                payload: {
                    page,
                    totalPages,
                    posts
                }
            });
        });
    }
    static isLiked(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user;
            const { postId } = req.query;
            if (!userId || !mongoose_1.Types.ObjectId.isValid(userId) || !postId || !mongoose_1.Types.ObjectId.isValid(postId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь или пост не найден!"
                    }
                });
                return;
            }
            const post = yield post_schema_1.default.find({
                _id: postId,
                liked: {
                    $in: userId
                }
            }).exec();
            res.status(200).json({
                message: "success",
                payload: {
                    isLiked: Boolean(post.length)
                }
            });
        });
    }
    static setLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = req.user;
            const { postId } = req.body;
            if (!mongoose_1.Types.ObjectId.isValid(postId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пост не найден!"
                    }
                });
                return;
            }
            const post = yield post_schema_1.default.findById(postId).exec();
            if (!post) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пост не найден!"
                    }
                });
                return;
            }
            const isLiked = yield post_schema_1.default.find({
                _id: postId,
                liked: {
                    $in: [_id]
                }
            });
            let postResult;
            if (isLiked.length) {
                postResult = yield post_schema_1.default.findOneAndUpdate({
                    _id: postId
                }, {
                    $inc: {
                        likes: -1
                    },
                    $pull: {
                        liked: _id
                    }
                }, {
                    new: true
                });
            }
            else {
                postResult = yield post_schema_1.default.findOneAndUpdate({
                    _id: postId
                }, {
                    $inc: {
                        likes: 1
                    },
                    $push: {
                        liked: _id
                    }
                }, {
                    new: true
                });
            }
            res.status(200).json({
                message: "success",
                payload: {
                    isLiked: isLiked.length ? false : true,
                    likes: postResult.likes
                }
            });
        });
    }
}
exports.default = PostsService;
