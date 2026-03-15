"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import {
  friendQueryKeys,
  getFriendRequestsFn,
  acceptFriendRequestFn,
  declineFriendRequestFn,
} from "@/utils/api/social/friends";
import { useSessionStore } from "@/providers/session";
import { socket } from "@/lib/socket";
import type { FriendshipType } from "@/index";
import Link from "next/link";

export function FriendRequests() {
  const queryClient = useQueryClient();
  const {
    id: currentUserId,
    username,
    avatar,
  } = useSessionStore((state) => state);

  const { data: requests } = useQuery({
    queryKey: friendQueryKeys.requests(),
    queryFn: getFriendRequestsFn,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequestFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: friendQueryKeys.all });
      // Notify the original sender in real-time
      socket.emit("friendRequestAccepted", {
        senderId: data.senderId,
        accepter: {
          id: currentUserId,
          name: username,
          image: avatar.tmdb.avatar_path,
        },
      });
    },
  });

  const declineMutation = useMutation({
    mutationFn: declineFriendRequestFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendQueryKeys.all });
    },
  });

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          Aucune demande en attente.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {requests.map((request: FriendshipType) => {
        const avatarUrl = request.sender.image
          ? `${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200${request.sender.image}`
          : null;

        return (
          <Card key={request.id}>
            <CardContent className="flex items-center justify-between p-4">
              <Link
                href={`/users/${request.sender.id}`}
                className="flex items-center gap-3 hover:opacity-80"
              >
                <UserAvatar
                  user={{
                    name: request.sender.name,
                    image: avatarUrl,
                  }}
                  className="h-10 w-10"
                />
                <span className="font-medium">{request.sender.name}</span>
              </Link>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    acceptMutation.mutate({ friendshipId: request.id })
                  }
                  disabled={
                    acceptMutation.isPending || declineMutation.isPending
                  }
                >
                  Accepter
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    declineMutation.mutate({ friendshipId: request.id })
                  }
                  disabled={
                    acceptMutation.isPending || declineMutation.isPending
                  }
                >
                  Refuser
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
