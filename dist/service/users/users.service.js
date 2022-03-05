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
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const user_schema_1 = __importDefault(require("./user.schema"));
const email_1 = require("../../utils/email");
class UsersService {
    static me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                message: "success",
                payload: {
                    _id: req.user
                }
            });
        });
    }
    static preRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = req.body;
            const newUser = {
                firstName: form.firstName,
                surname: form.surname,
                birthday: form.birthday
            };
            const user = yield user_schema_1.default.create(newUser);
            res.status(201).json({
                message: "success",
                payload: {
                    user: {
                        _id: user._id
                    }
                }
            });
        });
    }
    static sendEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const user = yield this.getUserById(body._id);
            if (!user) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователя не существует!"
                    }
                });
                return;
            }
            if (yield this.getUserByEmail(body.email)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь с такой почтой уже существует!"
                    }
                });
                return;
            }
            const generatedCode = String(Math.floor(Math.random() * (10000 - 1000) + 1000));
            yield user.updateOne({
                email: body.email,
                confirmCode: generatedCode
            });
            yield this.sendEmailToUser(body.email, generatedCode);
            res.status(201).json({
                message: "success",
                payload: {}
            });
        });
    }
    static setFirstPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const newPassword = crypto_js_1.default.AES.encrypt(body.password, process.env.SECRET_KEY).toString();
            const user = yield this.getUserById(body._id);
            if (!user || user.password) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователя не существует!"
                    }
                });
                return;
            }
            yield user.updateOne({
                password: newPassword
            });
            res.status(201).json({
                message: "success",
                payload: {
                    user: {
                        _id: user._id
                    }
                }
            });
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ _id: req.user._id }, process.env.SECRET_KEY, {
                expiresIn: "1d"
            });
            res.status(200).json({
                message: "success",
                payload: {
                    token
                }
            });
        });
    }
    static verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const user = yield this.getUserById(body._id);
            if (!user) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователя не существует!"
                    }
                });
                return;
            }
            if (user.confirmCode !== body.code) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Неправильный код!"
                    }
                });
                return;
            }
            yield user.updateOne({
                confirmCode: "",
                isConfirmed: true
            });
            res.status(200).json({
                message: "success"
            });
        });
    }
    static avatarUpload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageBase64 = req.body.image;
            const user = yield user_schema_1.default.findById(req.user._id).exec();
            if (user.avatar.length) {
                yield cloudinary_1.default.api.delete_resources([user.avatar]);
            }
            const public_id = yield images_service_1.default.uploadImage(imageBase64);
            yield user.updateOne({
                avatar: public_id
            });
            res.status(200).json({
                message: "success",
                payload: {
                    public_id
                }
            });
        });
    }
    static getAvatar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userId } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const user = yield user_schema_1.default.findById(userId).exec();
            if (!user) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            res.status(200).json({
                message: "success",
                payload: {
                    public_id: user.avatar
                }
            });
        });
    }
    static getProfileInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userId } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const user = yield user_schema_1.default.findById(userId).exec();
            if (!user) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            res.status(200).json({
                message: "success",
                payload: {
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        surname: user.surname,
                        birthday: user.birthday
                    }
                }
            });
        });
    }
    static getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search = "", pageSize = 10, page = 1 } = req.query;
            const pageSizeNumber = Number(pageSize);
            const optionSearch = {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { surname: { $regex: search, $options: 'i' } }
                ],
                isConfirmed: true
            };
            const totalPosts = yield user_schema_1.default.countDocuments(optionSearch).exec();
            const totalPages = Math.ceil(totalPosts / pageSizeNumber);
            const skip = (Number(page) - 1) * pageSizeNumber < 0 ? totalPages * pageSizeNumber : (Number(page) - 1) * pageSizeNumber;
            const limit = pageSizeNumber;
            const users = yield user_schema_1.default.find(optionSearch).limit(limit).skip(skip).select(["surname", "firstName", "avatar"]).exec();
            res.status(200).json({
                message: "success",
                payload: {
                    users,
                    totalPages,
                    page
                }
            });
        });
    }
    static addToFriendByIds(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            const friend = yield this.getUserById(friendId);
            yield user.updateOne({
                $pull: {
                    friends: friend._id
                }
            });
            yield friend.updateOne({
                $pull: {
                    friends: user._id
                }
            });
            yield user.updateOne({
                $push: {
                    friends: friend._id
                }
            });
            yield friend.updateOne({
                $push: {
                    friends: user._id
                }
            });
        });
    }
    static deleteFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user;
            const body = req.body;
            if (!mongoose_1.default.Types.ObjectId.isValid(body.userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const user = yield user_schema_1.default.findById(userId).exec();
            const friend = yield user_schema_1.default.findById(body.userId).exec();
            if (!friend) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            yield user.updateOne({
                $pull: {
                    friends: friend._id
                }
            });
            yield friend.updateOne({
                $pull: {
                    friends: user._id
                }
            });
            res.status(200).json({
                message: "success",
                payload: {
                    isFriend: false
                }
            });
        });
    }
    static getFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, search = "", pageSize = 10, page = 1 } = req.query;
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const user = yield user_schema_1.default.findById(userId).exec();
            if (!user) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const pageSizeNumber = Number(pageSize);
            const optionSearch = {
                _id: {
                    $in: user.friends
                },
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { surname: { $regex: search, $options: 'i' } }
                ],
                isConfirmed: true
            };
            const totalPosts = yield user_schema_1.default.countDocuments(optionSearch).exec();
            const totalPages = Math.ceil(totalPosts / pageSizeNumber);
            const skip = (Number(page) - 1) * pageSizeNumber < 0 ? totalPages * pageSizeNumber : (Number(page) - 1) * pageSizeNumber;
            const limit = pageSizeNumber;
            const users = yield user_schema_1.default.find(optionSearch).limit(limit).skip(skip).select(["surname", "firstName", "avatar"]).exec();
            res.status(200).json({
                message: "success",
                payload: {
                    users,
                    totalPages,
                    page
                }
            });
        });
    }
    static isFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const IdAuthUser = req.user;
            const { userId } = req.query;
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const friend = yield user_schema_1.default.findById(userId).exec();
            const authUser = yield user_schema_1.default.findById(IdAuthUser).exec();
            if (!friend || !authUser) {
                res.status(400).json({
                    message: "error",
                    payload: {
                        errorMessage: "Пользователь не найден!"
                    }
                });
                return;
            }
            const isFriend = friend.friends.includes(authUser._id) && authUser.friends.includes(friend._id);
            res.status(200).json({
                message: "success",
                payload: {
                    isFriend
                }
            });
        });
    }
    static getFriendsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_schema_1.default.findById(userId).exec();
            const friends = yield user_schema_1.default.find({
                _id: {
                    $in: user.friends
                },
                friends: user._id
            }).distinct("_id").exec();
            return friends;
        });
    }
    static sendEmailToUser(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, email_1.sendEmail)({
                to: email,
                subject: "Подтверждение почты",
                code
            });
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_schema_1.default.findOne({
                email,
                isConfirmed: true
            }).exec();
            return result;
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_schema_1.default.findById(id).exec();
            return result;
        });
    }
}
exports.default = UsersService;
