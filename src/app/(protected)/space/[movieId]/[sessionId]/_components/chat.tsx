"use client";

import useSocketConnection from "@/hooks/useSockerConnection";
import { Messages } from "./messages";
import { socket } from "@/lib/socket";
import type { Message } from "@/index";

interface ChatProps {
  space: number;
  user?: Message["user"][];
  message?: Message[];
}

export function Chat({ message = [], space, user = [] }: ChatProps) {
  const { users, messages, sendMessage, messagesEndRef } = useSocketConnection(
    socket,
    message,
    user,
    space,
  );
  return (
    <div className="px-10">
      <div className="flex w-full justify-center">
        <Messages
          messages={messages}
          messagesEndRef={messagesEndRef}
          users={users}
          sendMessage={sendMessage}
          className="flex w-full flex-col items-center justify-between"
        />
      </div>
    </div>
  );
}
