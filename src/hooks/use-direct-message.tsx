"use client";

import type { DirectMessageType } from "@/index";
import { useSessionStore } from "@/providers/session";
import { useState, useCallback, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface UseDirectMessageReturn {
  messages: DirectMessageType[];
  messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
  sendMessage: (content: string) => void;
}

/**
 * This hook manages a socket connection for direct messaging in a conversation.
 * It joins the conversation room, listens for new messages, and provides
 * a sendMessage function.
 *
 * @param socket - The Socket.IO client instance
 * @param conversationId - The conversation to join
 * @param initialMessages - Messages loaded from the server
 * @returns messages, messagesEndRef, sendMessage
 */
const useDirectMessage = (
  socket: Socket,
  conversationId: number,
  initialMessages: DirectMessageType[],
): UseDirectMessageReturn => {
  const { id, username, avatar } = useSessionStore((state) => state);
  const [messages, setMessages] =
    useState<DirectMessageType[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Join the conversation room on mount, leave on unmount
  useEffect(() => {
    socket.emit("joinConversation", { conversationId });
    return () => {
      socket.emit("leaveConversation", { conversationId });
    };
  }, [socket, conversationId]);

  // Listen for incoming direct messages
  useEffect(() => {
    const onDirectMessageResponse = (message: DirectMessageType) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("directMessageResponse", onDirectMessageResponse);

    return () => {
      socket.off("directMessageResponse", onDirectMessageResponse);
    };
  }, [socket]);

  const sendMessage = useCallback(
    (content: string) => {
      socket.emit("directMessage", {
        conversationId,
        userId: id,
        content,
        userName: username,
        userImage: avatar.tmdb.avatar_path,
      });
    },
    [socket, conversationId, id, username, avatar],
  );

  return {
    messages,
    messagesEndRef,
    sendMessage,
  };
};

export default useDirectMessage;
