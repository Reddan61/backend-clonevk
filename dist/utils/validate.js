"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
function default_1(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length) {
        res.status(400).json({
            message: "error",
            payload: {
                errorMessage: "param: " + errors[0].param + " msg: " + errors[0].msg
            }
        });
        return;
    }
    next();
}
exports.default = default_1;
