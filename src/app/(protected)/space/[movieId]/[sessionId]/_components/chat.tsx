import { Message, User } from "@prisma/client";
import { socket } from "@/lib/socket";
import useSocketConnection from "@/hooks/useSockerConnection";
import { Messages } from "./messages";

interface ChatProps {
  initiatorUsername: string;
  message: Message[];
}

export function Chat({ initiatorUsername, message }: ChatProps) {
  const { isConnected, transport, users, messages, sendMessage } =
    useSocketConnection(socket, initiatorUsername, message);
  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <div className="flex w-full justify-center">
        <Messages messages={messages} users={users} />
      </div>
    </div>
  );
}
