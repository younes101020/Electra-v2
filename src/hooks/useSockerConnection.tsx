"use client";

import type { Message, User } from "@/index";
import { useSessionStore } from "@/providers/session";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
} from "react";
import { Socket } from "socket.io-client";

interface UseSocketConnectionReturn {
  isConnected: boolean;
  users: Message["user"][];
  messagesEndRef: MutableRefObject<HTMLDivElement | null>;
  messages: Message[];
  sendMessage: (message: string) => void;
}

/**
 * This hook manages a socket connection and chat related state
 */
const useSocketConnection = (
  socket: Socket,
  initialMessages: Message[],
  initialUsers: Message["user"][],
  space: number,
): UseSocketConnectionReturn => {
  const { id, username, avatar } = useSessionStore((state) => state);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [users, setUsers] = useState<Message["user"][]>(initialUsers);
  const [spaceState, setSpaceState] = useState(space);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log(users, "UHJHISFDGOJKFSDGOJKFSDG");

  useEffect(scrollToBottom, [messages]);

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

    socket.emit("newUser", {
      name: username,
      socketID: socket.id,
      space,
      id,
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newUserResponse", (data: User[]) => {
      setUsers((prevUsers) => {
        const userList = prevUsers
          .map((registeredUser) => {
            if (
              data.some(
                (onlineUser) => onlineUser?.name === registeredUser?.name,
              )
            ) {
              const overrideWithOnlineUser = data.filter(
                (onlineUser) => onlineUser.name === registeredUser?.name,
              );
              return overrideWithOnlineUser[0];
            }
            return registeredUser;
          })
        const overrideDuplicateUserWithOnline = prevUsers.filter(
          (registeredUser) =>
            !data.some(
              (onlineUser) => registeredUser?.name === onlineUser.name,
            ),
        );
        return [...overrideDuplicateUserWithOnline, ...data];
      });
    });

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
      socket.emit("message", {
        message: {
          content: message,
          spaceId: spaceState,
          user: { name: username, image: avatar.tmdb.avatar_path, id },
        },
        insertToDB: {
          content: message,
          spaceId: spaceState,
          userId: id,
        },
      });
    },
    [socket, id],
  );

  return {
    isConnected,
    users,
    messagesEndRef,
    messages,
    sendMessage,
  };
};

export default useSocketConnection;
