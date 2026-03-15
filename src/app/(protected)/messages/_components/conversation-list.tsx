"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import type { ConversationType } from "@/index";

interface ConversationListProps {
  conversations: ConversationType[];
  activeConversationId: number | null;
  onSelectConversation: (conversation: ConversationType) => void;
  currentUserId: number;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUserId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          Aucune conversation.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {conversations.map((conversation) => {
        const otherUser = conversation.users.find(
          (u) => u.userId !== currentUserId,
        );
        if (!otherUser) return null;

        const lastMessage =
          conversation.messages.length > 0 ? conversation.messages[0] : null;

        const avatarUrl = otherUser.user.image
          ? `${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200${otherUser.user.image}`
          : null;

        const isActive = conversation.id === activeConversationId;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent",
              isActive && "border-primary bg-accent",
            )}
          >
            <UserAvatar
              user={{ name: otherUser.user.name, image: avatarUrl }}
              className="h-10 w-10"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-medium">{otherUser.user.name}</span>
              {lastMessage && (
                <span className="truncate text-sm text-muted-foreground">
                  {lastMessage.content}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
