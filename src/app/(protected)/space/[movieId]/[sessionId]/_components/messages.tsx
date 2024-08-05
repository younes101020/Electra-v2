"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import type { User } from "@prisma/client";
import { useSessionStore } from "@/providers/session";
import { UserAvatar } from "@/components/user-avatar";
import { Message } from "@/index";

type MessagesProps = React.ComponentProps<typeof Card> & {
  messages: Message[];
  users: User[];
  sendMessage: (message: string) => void;
};

export function Messages({ className, sendMessage, ...props }: MessagesProps) {
  const { name, username, avatar } = useSessionStore((state) => state);
  return (
    <Card className={cn("h-[80vh]", className)} {...props}>
      <CardContent className="w-full pt-2">
        <div>
          <ul>
            {props.users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
          <ul>
            {props.messages.map((msg) => (
              <li key={msg.id} className="flex gap-3">
                <UserAvatar
                  user={{
                    name: username,
                    image: avatar.tmdb.avatar_path || null,
                  }}
                  className="h-8 w-8 mt-2"
                />
                <div className="flex flex-col gap-1">
                  <p className=" font-semibold">{msg.user!.name}</p>
                  <p className="rounded-b-lg rounded-r-lg bg-primary p-2 text-primary-foreground">
                    {msg.content}
                  </p>
                </div>
              </li>
            ))}
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
