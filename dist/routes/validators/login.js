"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").isLength({ min: 2 })
];
