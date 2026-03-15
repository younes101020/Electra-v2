"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSessionStore } from "@/providers/session";
import { socket } from "@/lib/socket";
import {
  conversationQueryKeys,
  getConversationsFn,
  getOrCreateConversationFn,
} from "@/utils/api/social/conversations";
import { ConversationList } from "./conversation-list";
import { Chat } from "./chat";
import type { ConversationType } from "@/index";

export function MessagesContent() {
  const searchParams = useSearchParams();
  const withUserId = searchParams.get("with");
  const { id: currentUserId } = useSessionStore((state) => state);
  const queryClient = useQueryClient();

  const [activeConversation, setActiveConversation] =
    useState<ConversationType | null>(null);

  const { data: conversations } = useQuery({
    queryKey: conversationQueryKeys.list(),
    queryFn: getConversationsFn,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Register user for DM notifications on mount
  useEffect(() => {
    if (currentUserId) {
      socket.emit("registerUser", { userId: currentUserId });
    }
  }, [currentUserId]);

  // Auto-open conversation when ?with=userId is provided
  const createConversation = useMutation({
    mutationFn: getOrCreateConversationFn,
    onSuccess: (conversation) => {
      setActiveConversation(conversation);
      queryClient.invalidateQueries({
        queryKey: conversationQueryKeys.list(),
      });
    },
  });

  useEffect(() => {
    if (withUserId && currentUserId) {
      const otherUserId = parseInt(withUserId, 10);
      if (!isNaN(otherUserId) && otherUserId !== currentUserId) {
        createConversation.mutate({ otherUserId });
      }
    }
  }, [withUserId, currentUserId]);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="w-80 flex-shrink-0 overflow-y-auto">
        <h1 className="mb-4 text-2xl font-bold">Messages</h1>
        <ConversationList
          conversations={conversations || []}
          activeConversationId={activeConversation?.id ?? null}
          onSelectConversation={setActiveConversation}
          currentUserId={currentUserId}
        />
      </div>
      <div className="flex-1">
        {activeConversation ? (
          <Chat
            conversation={activeConversation}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Sélectionnez une conversation pour commencer.
          </div>
        )}
      </div>
    </div>
  );
}
