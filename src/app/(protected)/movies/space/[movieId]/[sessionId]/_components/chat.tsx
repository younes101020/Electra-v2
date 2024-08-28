"use client";

import useSocketConnection from "@/hooks/useSockerConnection";
import { Messages } from "./messages";
import { socket } from "@/lib/socket";
import type { Message } from "@/index";
import { RevalidateOrmCache } from "../_actions/revalidation";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface ChatProps {
  space: number;
  movieId: string;
  user?: Message["user"][];
  message?: Message[];
}

export function Chat({ message = [], space, user = [], movieId }: ChatProps) {
  const formEl = useRef(null);
  const { users, messages, sendMessage, messagesEndRef, formRef } =
    useSocketConnection(socket, message, user, space, formEl);
  return (
    <div className="px-5 pt-28 md:px-24">
      <div className="flex w-full justify-center">
        <Messages
          formRef={formRef}
          messages={messages}
          messagesEndRef={messagesEndRef}
          users={users}
          sendMessage={sendMessage}
          className="flex w-full flex-col items-center justify-between"
        />
        <form action={RevalidateOrmCache} ref={formEl} hidden>
          <input type="text" name="movieid" value={movieId} hidden />
          <Button type="submit"></Button>
        </form>
      </div>
    </div>
  );
}
