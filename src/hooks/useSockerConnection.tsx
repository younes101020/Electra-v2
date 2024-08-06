import type { Message } from "@/index";
import { useState, useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";

interface UseSocketConnectionReturn {
  isConnected: boolean;
  users: Message["user"][];
  messages: Message[];
  sendMessage: (message: string) => void;
}

/**
 * This hook manages a socket connection and chat related state
 */
const useSocketConnection = (
  socket: Socket,
  username: string,
  initialMessages: Message[],
  initialUsers: Message["user"][],
  space: number,
  userId: number,
): UseSocketConnectionReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [users, setUsers] = useState<Message["user"][]>(initialUsers);
  const [spaceState, setSpaceState] = useState(space);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const onConnect = useCallback(() => {
    setIsConnected(true);
  }, [socket]);

  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    setSpaceState(0);
  }, []);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    socket.emit("newUser", { username, socketID: socket.id, space });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newUserResponse", (data: Message["user"][]) => setUsers(data));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("newUserResponse");
    };
  }, [socket, username, onConnect, onDisconnect]);

  useEffect(() => {
    const onMessageResponse = (value: Message) => {
      console.log(value);
      setMessages((prevMessages) => [...prevMessages, value]);
    };

    socket.on("messageResponse", onMessageResponse);

    return () => {
      socket.off("messageResponse", onMessageResponse);
    };
  }, [socket]);

  const sendMessage = useCallback(
    (message: string) => {
      socket.emit("message", { content: message, spaceId: spaceState, userId });
    },
    [socket],
  );

  return {
    isConnected,
    users,
    messages,
    sendMessage,
  };
};

export default useSocketConnection;
