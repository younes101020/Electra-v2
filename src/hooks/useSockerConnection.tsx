import { Message, User } from "@prisma/client";
import { useState, useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";

interface UseSocketConnectionReturn {
  isConnected: boolean;
  transport: string;
  users: User[];
  messages: Message[];
  sendMessage: (message: string) => void;
}

/**
 * This hook manages a socket connection and related state
 */
const useSocketConnection = (
  socket: Socket,
  username: string,
  initialMessages: Message[] = [],
): UseSocketConnectionReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const onConnect = useCallback(() => {
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);

    socket.io.engine.on("upgrade", (transport: { name: string }) => {
      setTransport(transport.name);
    });
  }, [socket]);

  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    setTransport("N/A");
  }, []);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    socket.emit("newUser", { username, socketID: socket.id });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newUserResponse", (data: User[]) => setUsers(data));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("newUserResponse");
    };
  }, [socket, username, onConnect, onDisconnect]);

  useEffect(() => {
    const onMessageResponse = (value: Message) => {
      setMessages((prevMessages) => [...prevMessages, value]);
    };

    socket.on("messageResponse", onMessageResponse);

    return () => {
      socket.off("messageResponse", onMessageResponse);
    };
  }, [socket]);

  const sendMessage = useCallback(
    (message: string) => {
      socket.emit("message", message);
    },
    [socket],
  );

  return {
    isConnected,
    transport,
    users,
    messages,
    sendMessage,
  };
};

export default useSocketConnection;
