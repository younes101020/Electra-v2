"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { userQueryKeys, getUserProfileFn } from "@/utils/api/social/users";
import {
  friendQueryKeys,
  getFriendshipStatusFn,
  sendFriendRequestFn,
  acceptFriendRequestFn,
  removeFriendFn,
} from "@/utils/api/social/friends";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

interface UserProfileProps {
  userId: number;
  currentUserId: number;
}

export function UserProfile({ userId, currentUserId }: UserProfileProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: userQueryKeys.profile(userId),
    queryFn: () => getUserProfileFn({ userId }),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { data: friendship, isLoading: isFriendshipLoading } = useQuery({
    queryKey: friendQueryKeys.status(userId),
    queryFn: () => getFriendshipStatusFn({ otherUserId: userId }),
    refetchOnMount: false,
  });

  const sendRequestMutation = useMutation({
    mutationFn: sendFriendRequestFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendQueryKeys.status(userId),
      });
      toast({
        title: "Demande envoyée",
        description: "Votre demande d'ami a été envoyée.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande d'ami.",
        variant: "destructive",
      });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequestFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendQueryKeys.status(userId),
      });
      queryClient.invalidateQueries({
        queryKey: friendQueryKeys.requests(),
      });
      queryClient.invalidateQueries({
        queryKey: friendQueryKeys.list(),
      });
      toast({
        title: "Demande acceptée",
        description: "Vous êtes maintenant amis !",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande.",
        variant: "destructive",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFriendFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendQueryKeys.status(userId),
      });
      queryClient.invalidateQueries({
        queryKey: friendQueryKeys.list(),
      });
      toast({
        title: "Ami supprimé",
        description: "Cette personne a été retirée de vos amis.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cet ami.",
        variant: "destructive",
      });
    },
  });

  const handleSendRequest = () => {
    sendRequestMutation.mutate({ receiverId: userId });
  };

  const handleAccept = () => {
    if (friendship) {
      acceptMutation.mutate({ friendshipId: friendship.id });
    }
  };

  const handleRemove = () => {
    if (friendship) {
      removeMutation.mutate({ friendshipId: friendship.id });
    }
  };

  const handleMessage = () => {
    router.push(`/messages?with=${userId}`);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const avatarUrl = profile.image;
  const isMutating =
    sendRequestMutation.isPending ||
    acceptMutation.isPending ||
    removeMutation.isPending;

  /** Renders the appropriate action button(s) based on friendship status */
  const renderFriendAction = () => {
    if (isFriendshipLoading) {
      return <Spinner className="h-5 w-5" />;
    }

    // No existing friendship
    if (!friendship) {
      return (
        <Button onClick={handleSendRequest} disabled={isMutating} size="sm">
          Ajouter en ami
        </Button>
      );
    }

    // Pending — current user sent the request
    if (
      friendship.status === "PENDING" &&
      friendship.senderId === currentUserId
    ) {
      return (
        <Badge variant="secondary" className="px-3 py-1.5 text-sm">
          Demande envoyée
        </Badge>
      );
    }

    // Pending — current user received the request
    if (
      friendship.status === "PENDING" &&
      friendship.receiverId === currentUserId
    ) {
      return (
        <Button onClick={handleAccept} disabled={isMutating} size="sm">
          Accepter la demande
        </Button>
      );
    }

    // Accepted — already friends
    if (friendship.status === "ACCEPTED") {
      return (
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1.5 text-sm">
            Amis
          </Badge>
          <Button onClick={handleMessage} variant="outline" size="sm">
            Envoyer un message
          </Button>
          <Button
            onClick={handleRemove}
            disabled={isMutating}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            Supprimer
          </Button>
        </div>
      );
    }

    // Declined — allow re-sending
    if (friendship.status === "DECLINED") {
      return (
        <Button onClick={handleSendRequest} disabled={isMutating} size="sm">
          Ajouter en ami
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <UserAvatar
              user={{
                name: profile.name,
                image: avatarUrl,
              }}
              className="h-20 w-20"
            />
            <div className="flex flex-col gap-1">
              <CardTitle>{profile.name}</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">{renderFriendAction()}</div>
        </CardHeader>
      </Card>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">
          Films favoris de {profile.name}
        </h2>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Les favoris publics ne sont pas encore disponibles pour ce profil.
          </CardContent>
        </Card>
      </section>

      <div>
        <Link
          href="/friends"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Retour à la liste d&apos;amis
        </Link>
      </div>
    </>
  );
}
