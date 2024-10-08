"use client";

import type { Message, User } from "@/index";
import { useSessionStore } from "@/providers/session";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
  RefObject,
} from "react";
import { Socket } from "socket.io-client";

interface UseSocketConnectionReturn {
  users: Message["user"][];
  messagesEndRef: MutableRefObject<HTMLDivElement | null>;
  formRef: RefObject<HTMLFormElement>;
  messages: Message[];
  sendMessage: (message: string) => void;
}

/**
 * This hook manages a socket connection and chat related state
 */
const useSocketConnection = (
  socket: Socket,
  initialMessages: Message[],
  initialUsers: User[],
  space: number,
  formEl: RefObject<HTMLFormElement>,
): UseSocketConnectionReturn => {
  const { id, username, avatar } = useSessionStore((state) => state);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [spaceState, setSpaceState] = useState(space);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const formRef = useRef<null | HTMLFormElement>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const onConnect = useCallback(() => {
    socket.emit("newUser", {
      name: username,
      socketID: socket.id,
      space,
      id,
    });
  }, [socket, id]);

  const onDisconnect = useCallback(() => {
    setSpaceState(0);
  }, []);

  const onNewUserResponse = (data: User[]) => {
    setUsers((prevUsers) => {
      const userList = prevUsers.map((registeredUser) => {
        if (
          data.some((onlineUser) => onlineUser?.name === registeredUser?.name)
        ) {
          const overrideWithOnlineUser = data.filter(
            (onlineUser) => onlineUser.name === registeredUser?.name,
          );
          return overrideWithOnlineUser[0];
        }
        return registeredUser;
      });
      const overrideDuplicateUserWithOnline = userList.filter(
        (registeredUser) =>
          !data.some((onlineUser) => registeredUser?.name === onlineUser.name),
      );
      return [...overrideDuplicateUserWithOnline, ...data];
    });
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newUserResponse", onNewUserResponse);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("newUserResponse");
    };
  }, [socket, username, onDisconnect]);

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
      formRef.current!.reset();
      // Revalidate cached space data
      formEl?.current!.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    },
    [socket, id],
  );

  return {
    users,
    messagesEndRef,
    formRef,
    messages,
    sendMessage,
  };
};

export default useSocketConnection;
