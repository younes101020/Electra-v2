"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { useSessionStore } from "@/providers/session";
import { UserAvatar } from "@/components/user-avatar";
import { Message, User } from "@/index";
import { MutableRefObject } from "react";
import { Badge } from "@/components/ui/badge";

type MessagesProps = React.ComponentProps<typeof Card> & {
  messages: Message[];
  messagesEndRef: MutableRefObject<HTMLDivElement | null>;
  users: User[];
  sendMessage: (message: string) => void;
};

export function Messages({
  className,
  sendMessage,
  messagesEndRef,
  ...props
}: MessagesProps) {
  const { username, id } = useSessionStore((state) => state);
  console.log(props.users, "USERS");
  return (
    <Card className={cn("h-[80vh]", className)} {...props}>
      <CardContent className="mb-4 h-full w-full pt-2">
        <div className="flex h-full gap-4">
          <ul className="flex h-full flex-col gap-2 border-r-[.1rem] pr-4">
            <li className="pb-2 text-lg font-medium">Utilisateurs:</li>
            {props.users.map((user) => (
              <li
                key={user!.id}
                className="rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground"
              >
                {user!.name}
                {user.socketID ? (
                  <Badge variant={"success"} className="ml-2">
                    En ligne
                  </Badge>
                ) : (
                  <Badge variant={"destructive"} className="ml-2">
                    Hors ligne
                  </Badge>
                )}
              </li>
            ))}
          </ul>
          <ul className="flex flex-1 flex-col gap-4 overflow-scroll overflow-x-hidden">
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
