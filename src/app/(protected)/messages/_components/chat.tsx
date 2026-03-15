"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { socket } from "@/lib/socket";
import useDirectMessage from "@/hooks/use-direct-message";
import {
  conversationQueryKeys,
  getConversationMessagesFn,
} from "@/utils/api/social/conversations";
import type { ConversationType, DirectMessageType } from "@/index";

interface ChatProps {
  conversation: ConversationType;
  currentUserId: number;
}

export function Chat({ conversation, currentUserId }: ChatProps) {
  const [input, setInput] = useState("");

  // Fetch initial messages from the server
  const { data: initialMessages } = useQuery({
    queryKey: conversationQueryKeys.messages(conversation.id),
    queryFn: () =>
      getConversationMessagesFn({ conversationId: conversation.id }),
  });

  const { messages, messagesEndRef, sendMessage } = useDirectMessage(
    socket,
    conversation.id,
    initialMessages || [],
  );

  const otherUser = conversation.users.find((u) => u.userId !== currentUserId);
  const otherUserName = otherUser?.user.name || "Utilisateur";
  const otherAvatarUrl = otherUser?.user.image
    ? `${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200${otherUser.user.image}`
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-center gap-3 border-b">
        <UserAvatar
          user={{ name: otherUserName, image: otherAvatarUrl }}
          className="h-8 w-8"
        />
        <CardTitle className="text-lg">{otherUserName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Aucun message. Commencez la conversation !
            </p>
          )}
          {messages.map((msg: DirectMessageType) => (
            <DirectMessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.userId === currentUserId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 border-t p-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Envoyer un message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()}>
            Envoyer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DirectMessageBubble({
  message,
  isOwn,
}: {
  message: DirectMessageType;
  isOwn: boolean;
}) {
  return (
    <div className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 ${
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {!isOwn && (
          <p className="mb-1 text-xs font-medium">{message.user.name}</p>
        )}
        <p className="text-sm">{message.content}</p>
        <p className="mt-1 text-right text-[10px] opacity-60">
          {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
