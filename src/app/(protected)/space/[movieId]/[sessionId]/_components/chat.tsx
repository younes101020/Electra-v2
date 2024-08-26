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
  const { users, messages, sendMessage, messagesEndRef, formRef } = useSocketConnection(
    socket,
    message,
    user,
    space,
  );
  return (
    <div className="px-5 py-16 md:px-10 h-[90vh]">
      <div className="flex w-full justify-center">
        <Messages
          formRef={formRef}
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
