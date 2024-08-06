"use client";

import useSocketConnection from "@/hooks/useSockerConnection";
import { Messages } from "./messages";
import { socket } from "@/lib/socket";
import { useSessionStore } from "@/providers/session";
import type { Message } from "@/index";

interface ChatProps {
  initiatorUsername: string;
  space: number;
  user: Message["user"][];
  message: Message[];
}

export function Chat({ initiatorUsername, message, space, user }: ChatProps) {
  const { isConnected, users, messages, sendMessage } = useSocketConnection(
    socket,
    initiatorUsername,
    message,
    user,
    space,
  );
  return (
    <div className="px-10">
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <div className="flex w-full justify-center">
        <Messages
          messages={messages}
          users={users}
          sendMessage={sendMessage}
          className="flex w-full flex-col items-center justify-between"
        />
      </div>
    </div>
  );
}
