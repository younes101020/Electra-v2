"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import {
  friendQueryKeys,
  getFriendsFn,
  removeFriendFn,
} from "@/utils/api/social/friends";
import { useSessionStore } from "@/providers/session";
import type { FriendshipType } from "@/index";
import Link from "next/link";

export function FriendsList() {
  const queryClient = useQueryClient();
  const { id: currentUserId } = useSessionStore((state) => state);

  const { data: friends } = useQuery({
    queryKey: friendQueryKeys.list(),
    queryFn: getFriendsFn,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const removeMutation = useMutation({
    mutationFn: removeFriendFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendQueryKeys.all });
    },
  });

  if (!friends || friends.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          Vous n&apos;avez pas encore d&apos;amis. Recherchez des utilisateurs
          pour commencer !
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {friends.map((friendship: FriendshipType) => {
        // Show the other user (not the current user)
        const friend =
          friendship.senderId === currentUserId
            ? friendship.receiver
            : friendship.sender;

        const avatarUrl = friend.image
          ? `${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200${friend.image}`
          : null;

        return (
          <Card key={friendship.id}>
            <CardContent className="flex items-center justify-between p-4">
              <Link
                href={`/users/${friend.id}`}
                className="flex items-center gap-3 hover:opacity-80"
              >
                <UserAvatar
                  user={{ name: friend.name, image: avatarUrl }}
                  className="h-10 w-10"
                />
                <span className="font-medium">{friend.name}</span>
              </Link>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/messages?with=${friend.id}`}>Message</Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    removeMutation.mutate({ friendshipId: friendship.id })
                  }
                  disabled={removeMutation.isPending}
                >
                  Retirer
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
