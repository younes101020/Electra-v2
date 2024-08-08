"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { useSessionStore } from "@/providers/session";
import { UserAvatar } from "@/components/user-avatar";
import { Message } from "@/index";
import { MutableRefObject, useRef } from "react";

type MessagesProps = React.ComponentProps<typeof Card> & {
  messages: Message[];
  messagesEndRef: MutableRefObject<HTMLDivElement | null>;
  users: Message["user"][];
  sendMessage: (message: string) => void;
};

export function Messages({ className, sendMessage, messagesEndRef, ...props }: MessagesProps) {
  const { username, avatar, id } = useSessionStore((state) => state);
  return (
    <Card className={cn("h-[80vh]", className)} {...props}>
      <CardContent className="mb-4 w-full overflow-scroll pt-2">
        <div className="flex gap-4">
          <ul>
            <li className="pb-2 font-medium">Utilisateurs:</li>
            {props.users.map((user) => (
              <li key={user!.id} className="text-sm">
                {user!.name}
              </li>
            ))}
          </ul>
          <ul className="flex flex-1 flex-col gap-4">
            {props.messages.map((msg) => (
              <li
                key={msg.id}
                className={`flex gap-3 ${id === msg.user?.id && "self-end"}`}
              >
                <UserAvatar
                  user={{
                    name: username,
                    image: msg.user?.image
                      ? "https://image.tmdb.org/t/p/w200" + msg.user?.image
                      : null,
                  }}
                  className="mt-2 h-8 w-8"
                />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{msg.user!.name}</p>
                  <p className="rounded-b-lg rounded-r-lg bg-primary p-2 text-primary-foreground">
                    {msg.content}
                  </p>
                </div>
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        </div>
      </CardContent>
      <CardFooter className="w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage((e.target as HTMLFormElement).message.value);
          }}
          className="flex w-full gap-2"
        >
          <Input type="text" placeholder="Ecris ici" name="message" />
          <Button type="submit">Envoyer</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
