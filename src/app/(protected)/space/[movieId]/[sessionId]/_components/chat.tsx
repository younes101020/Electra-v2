"use client";

import { Message } from "@prisma/client";
import useSocketConnection from "@/hooks/useSockerConnection";
import { Messages } from "./messages";
import { socket } from "@/lib/socket";

interface ChatProps {
  initiatorUsername: string;
  space: number;
  message: Message[];
}

export function Chat({ initiatorUsername, message, space }: ChatProps) {
  const { isConnected, transport, users, messages, sendMessage } =
    useSocketConnection(socket, initiatorUsername, message, space);
  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <div className="flex w-full justify-center">
        <Messages messages={messages} users={users} sendMessage={sendMessage} />
      </div>
    </div>
  );
}
