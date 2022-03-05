"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const images_service_1 = __importDefault(require("../../service/images/images.service"));
const errorhandler_1 = __importDefault(require("../../utils/errorhandler"));
class ImagesController {
    static getImages(req, res) {
        return (0, errorhandler_1.default)(req, res, images_service_1.default.getImageUrlByPublicId.bind(images_service_1.default, req, res, req.query.public_id));
    }
}
exports.default = ImagesController;
