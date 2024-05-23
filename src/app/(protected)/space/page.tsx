"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card as ConfirmCard,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

type CardProps = React.ComponentProps<typeof ConfirmCard> & { messages: Array<string> };

function Card({ className, ...props }: CardProps) {
  return (
    <ConfirmCard className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>Plus qu'une dernière étape!</CardTitle>
        <CardDescription>
          Vous devez valider votre demande de connexion afin d'accéder à Electra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
            {/* TODO: GENERATE ID FOR EACH MSG SERVER SIDE AND USE IT ON KEY INSTEAD OF INDEX */}
            {props.messages.map((msg,i) => <li key={i}>{msg}</li>)}
        </ul>
      </CardContent>
      <CardFooter>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            socket.emit("message", e.target.message.value);
          }}
          className="flex gap-2"
        >
          <Input type="text" placeholder="Message" name="message" />
          <Button type="submit">Envoyer</Button>
        </form>
      </CardFooter>
    </ConfirmCard>
  );
}

export default function SpacePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    function onFooEvent(value: string) {
        setMessages(messages.concat(value));
    }
    socket.on('message', onFooEvent);
    return () => {
      socket.off('message', onFooEvent);
    };
  }, [message]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <div className="w-full flex justify-center">
        <Card />
      </div>
    </div>
  );
}
