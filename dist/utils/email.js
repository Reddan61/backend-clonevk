"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const options = {
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT),
    secure: true,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
};
const html = (code) => {
    return `Код подтверждения ${code}`;
};
const mailer = nodemailer_1.default.createTransport(options);
const sendEmail = ({ to, subject, code }) => (mailer.sendMail({
    from: process.env.NODEMAILER_USER,
    to,
    subject,
    html: html(code)
}));
exports.sendEmail = sendEmail;
