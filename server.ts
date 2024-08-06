import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { Prisma, PrismaClient } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  const db = new PrismaClient();

  let users: Prisma.UserCreateInput[] = [];

  io.on("connection", (socket) => {
    socket.on("newUser", (data) => {
      socket.join(data.space);
      users.push(data);
      console.log(users)
      socket.to(data.space).emit("newUserResponse", users);
    });
    socket.on("message", async (data) => {
      console.log(data, "DATA")
      await db.message.create({
        data,
      });
      const allMessages = await db.message.findMany({
        select: {
          id: true,
          content: true,
          spaceId: true,
          user: {
            select: {
              name: true,
            },
          },
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
