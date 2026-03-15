"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { userQueryKeys, searchUsersFn } from "@/utils/api/social/users";
import {
  sendFriendRequestFn,
  friendQueryKeys,
  getFriendshipStatusFn,
} from "@/utils/api/social/friends";
import { useSessionStore } from "@/providers/session";
import { socket } from "@/lib/socket";
import type { UserProfile } from "@/index";
import Link from "next/link";

export function UserSearch() {
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();
  const {
    id: currentUserId,
    username,
    avatar,
  } = useSessionStore((state) => state);

  const { data: users, isLoading } = useQuery({
    queryKey: userQueryKeys.search(query),
    queryFn: () => searchUsersFn({ query }),
    enabled: query.trim().length >= 2,
  });

  const sendRequest = useMutation({
    mutationFn: sendFriendRequestFn,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: friendQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.search(query),
      });
      // Notify the receiver in real-time
      socket.emit("friendRequestNotification", {
        receiverId: variables.receiverId,
        sender: {
          id: currentUserId,
          name: username,
          image: avatar.tmdb.avatar_path,
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Rechercher par nom d'utilisateur..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />
      {isLoading && query.trim().length >= 2 && (
        <p className="text-sm text-muted-foreground">Recherche en cours...</p>
      )}
      {users && users.length > 0 && (
        <div className="flex flex-col gap-2">
          {users.map((user: UserProfile) => (
            <UserSearchResult
              key={user.id}
              user={user}
              onSendRequest={() => sendRequest.mutate({ receiverId: user.id })}
              isPending={sendRequest.isPending}
            />
          ))}
        </div>
      )}
      {users && users.length === 0 && query.trim().length >= 2 && (
        <p className="text-sm text-muted-foreground">
          Aucun utilisateur trouvé.
        </p>
      )}
    </div>
  );
}

function UserSearchResult({
  user,
  onSendRequest,
  isPending,
}: {
  user: UserProfile;
  onSendRequest: () => void;
  isPending: boolean;
}) {
  const avatarUrl = user.image
    ? `${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200${user.image}`
    : null;

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <Link
          href={`/users/${user.id}`}
          className="flex items-center gap-3 hover:opacity-80"
        >
          <UserAvatar
            user={{ name: user.name, image: avatarUrl }}
            className="h-10 w-10"
          />
          <span className="font-medium">{user.name}</span>
        </Link>
        <Button size="sm" onClick={onSendRequest} disabled={isPending}>
          Ajouter
        </Button>
      </CardContent>
    </Card>
  );
}
