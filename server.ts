import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { User } from "./src";

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

  let users: User[] = [];

  // Maps userId (TMDB account ID) to socket ID for DM and friend notifications
  const userSocketMap = new Map<number, string>();

  io.on("connection", (socket) => {
    socket.on("newUser", (data) => {
      // Ignore new user subscription when user is Anonymous (initial zustand value for session context)
      if (
        data.name !== "Anonymous" &&
        (!users.some((user) => user.name === data.name) || data.socketID)
      ) {
        socket.join(data.space);
        // Update socket when duplicate is found elsewhere just push the new user
        users = users.some((user) => user.name === data.name)
          ? users.map((user) => {
              if (user.name === data.name) {
                return data;
              }
              return user;
            })
          : [...users, data];
        io.to(data.space).emit(
          "newUserResponse",
          users.filter((user) => user.space === data.space),
        );
      }
    });

    // Register user for DM and friend notifications
    socket.on("registerUser", (data: { userId: number }) => {
      userSocketMap.set(data.userId, socket.id);
    });

    // Join a DM conversation room
    socket.on("joinConversation", (data: { conversationId: number }) => {
      socket.join(`dm:${data.conversationId}`);
    });

    // Leave a DM conversation room
    socket.on("leaveConversation", (data: { conversationId: number }) => {
      socket.leave(`dm:${data.conversationId}`);
    });

    // Handle direct messages
    socket.on(
      "directMessage",
      async (data: {
        conversationId: number;
        userId: number;
        content: string;
        userName: string;
        userImage: string | null;
      }) => {
        try {
          // Verify user is a participant
          const participant = await db.conversationUser.findUnique({
            where: {
              userId_conversationId: {
                userId: data.userId,
                conversationId: data.conversationId,
              },
            },
          });
          if (!participant) return;

          // Persist the message
          const message = await db.directMessage.create({
            data: {
              content: data.content,
              userId: data.userId,
              conversationId: data.conversationId,
            },
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          });

          // Update conversation timestamp
          await db.conversation.update({
            where: { id: data.conversationId },
            data: { updatedAt: new Date() },
          });

          // Broadcast to everyone in the conversation room
          io.to(`dm:${data.conversationId}`).emit(
            "directMessageResponse",
            message,
          );
        } catch (error) {
          console.error("Error handling directMessage:", error);
        }
      },
    );

    // Friend request notification — push to the receiver if they're online
    socket.on(
      "friendRequestNotification",
      (data: {
        receiverId: number;
        sender: { id: number; name: string; image: string | null };
      }) => {
        const receiverSocketId = userSocketMap.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("friendRequestReceived", {
            sender: data.sender,
          });
        }
      },
    );

    // Friend request accepted notification — push to the original sender
    socket.on(
      "friendRequestAccepted",
      (data: {
        senderId: number;
        accepter: { id: number; name: string; image: string | null };
      }) => {
        const senderSocketId = userSocketMap.get(data.senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("friendRequestAcceptedResponse", {
            accepter: data.accepter,
          });
        }
      },
    );

    socket.on("message", async (data) => {
      // When new message is sended persist it into database and broadcast it into the space
      socket.join(data.message.spaceId);
      await db.message.create({
        data: data.insertToDB,
      });
      io.to(data.message.spaceId).emit("messageResponse", data.message);
    });
    socket.on("disconnect", () => {
      // Remove user from DM socket map
      userSocketMap.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
        }
      });
      // Remove user reference
      users = users.map((user) => {
        if (user.socketID === socket.id) {
          return {
            ...user,
            socketID: false,
          };
        }
        return user;
      });
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
