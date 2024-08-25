"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { useSessionStore } from "@/providers/session";
import { UserAvatar } from "@/components/user-avatar";
import { Message, User } from "@/index";
import { MutableRefObject, RefObject } from "react";
import { UserList } from "./userlist";

type MessagesProps = React.ComponentProps<typeof Card> & {
  messages: Message[];
  messagesEndRef: MutableRefObject<HTMLDivElement | null>;
  formRef: RefObject<HTMLFormElement>;
  users: User[];
  sendMessage: (message: string) => void;
};

export function Messages({
  className,
  sendMessage,
  messagesEndRef,
  ...props
}: MessagesProps) {
  const { username, id } = useSessionStore((state) => state)
  return (
    <div className="w-full space-y-3">
      <Card className={cn("h-[80vh]", className)} {...props}>
        <CardContent className="h-full w-full pt-2 pb-0">
          <div className="flex h-full gap-4">
            <UserList users={props.users} />
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
                        ? `${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200` +
                          msg.user?.image
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
      </Card>
      <form
        ref={props.formRef}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage((e.target as HTMLFormElement).message.value);
        }}
        className="flex w-full gap-2"
      >
        <Input type="text" placeholder="Ecris ici" name="message" />
        <Button type="submit">Envoyer</Button>
      </form>
    </div>
  );
}
