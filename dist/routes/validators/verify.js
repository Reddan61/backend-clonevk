"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.sendEmail = void 0;
const express_validator_1 = require("express-validator");
exports.sendEmail = [
    (0, express_validator_1.body)("_id").isMongoId(),
    (0, express_validator_1.body)("email").isEmail()
];
exports.verify = [
    (0, express_validator_1.body)("_id").isMongoId(),
    (0, express_validator_1.body)("code").isLength({ min: 4, max: 4 })
];
