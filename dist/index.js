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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const profile_router_1 = __importDefault(require("./routes/profile.router"));
const images_router_1 = __importDefault(require("./routes/images.router"));
const posts_router_1 = __importDefault(require("./routes/posts.router"));
const users_router_1 = __importDefault(require("./routes/users.router"));
const notifications_router_1 = __importDefault(require("./routes/notifications.router"));
const mongo_1 = __importDefault(require("./db/mongo"));
const local_1 = __importDefault(require("./controllers/auth/guards/local"));
const jwt_1 = __importDefault(require("./controllers/auth/guards/jwt"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL
}));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(body_parser_1.default.json({ limit: "50mb" }));
//Strategies
passport_1.default.use("local", local_1.default);
passport_1.default.use("jwt", jwt_1.default);
app.use(passport_1.default.initialize());
//routes
app.use("/auth", auth_router_1.default);
app.use("/profile", profile_router_1.default);
app.use("/images", images_router_1.default);
app.use("/posts", posts_router_1.default);
app.use("/users", users_router_1.default);
app.use("/notifications", notifications_router_1.default);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongo_1.default)();
            server.listen(process.env.PORT || 8888, () => {
                console.log("Server started");
            })
                .on("error", (err) => {
                console.log(err);
            });
        }
        catch (error) {
            startServer();
        }
    });
}
startServer();
