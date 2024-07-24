"use client";

import { socket } from "@/lib/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Message, User } from "@prisma/client";

type MessagesProps = React.ComponentProps<typeof Card> & {
  messages: Message[];
  users: User[];
};

export function Messages({ className, ...props }: MessagesProps) {
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>Plus qu&apos;une dernière étape!</CardTitle>
        <CardDescription>
          Vous devez valider votre demande de connexion afin d&apos;accéder à
          Electra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <ul>
            {props.users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
          <ul>
            {/* TODO: GENERATE ID FOR EACH MSG SERVER SIDE AND USE IT ON KEY INSTEAD OF INDEX */}
            {props.messages.map((msg) => (
              <li key={msg.id}>{msg.content}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            socket.emit("message", (e.target as HTMLFormElement).message.value);
          }}
          className="flex gap-2"
        >
          <Input type="text" placeholder="Message" name="message" />
          <Button type="submit">Envoyer</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
