"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const next_1 = __importDefault(require("next"));
const socket_io_1 = require("socket.io");
const db_1 = require("./src/lib/db");
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = (0, next_1.default)({ dev, hostname, port });
const handler = app.getRequestHandler();
app.prepare().then(() => {
    const httpServer = (0, node_http_1.createServer)(handler);
    const io = new socket_io_1.Server(httpServer);
    let users = [];
    io.on("connection", (socket) => {
        socket.on("newUser", (data) => {
            socket.join(data.space);
            users.push(data);
            console.log("ussseers", users)
            socket.to(data.space).emit("newUserResponse", users);
        });
        socket.on("message", async (data) => {
            console.log('qsdflnjkflnqsdjkflqsdjk, ok');
            await db_1.db.message.create({
                data,
            });
            const allMessages = await db_1.db.message.findMany({
                select: {
                    id: true,
                    content: true,
                    spaceId: true,
                },
            });
            socket.to(data.space).emit("messageResponse", allMessages);
        });
        socket.on("disconnect", () => {
            users = users.filter((user) => user.id.toString() !== socket.id);
            io.emit("newUserResponse", users);
            socket.disconnect();
        });
    });
    httpServer
        .once("error", (err) => {
        console.error(err);
        process.exit(1);
    })
        .listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
