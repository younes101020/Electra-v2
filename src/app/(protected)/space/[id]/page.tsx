import useSocketConnection from "@/hooks/useSockerConnection";
import { socket } from "@/lib/socket";
import { Messages } from "../_components/messages";

export default function SpacePage() {
  const { isConnected, transport, users, messages, sendMessage } =
    useSocketConnection(socket, "younes");
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
