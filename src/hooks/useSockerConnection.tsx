import { useState, useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";

export interface User {
  username: string;
  socketID: string;
}

export interface Message {
  text: string;
  sender: string;
  timestamp: number;
}

interface UseSocketConnectionReturn {
  isConnected: boolean;
  transport: string;
  users: User[];
  messages: Message[];
  sendMessage: (message: string) => void;
}

const useSocketConnection = (
  socket: Socket,
  username: string,
): UseSocketConnectionReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const onConnect = useCallback(() => {
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name); // Note: This might need a type assertion if the Socket type doesn't include io.engine

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
