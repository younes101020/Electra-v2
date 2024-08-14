"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";
import { useTransition } from "react";
import { logout } from "../app/(protected)/_actions/logout";
import { useSessionStore } from "@/providers/session";

export function UserAccountNav() {
  const [pending, startTransition] = useTransition();
  const { username, avatar } = useSessionStore((state) => state);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: username,
            image: avatar.tmdb.avatar_path
              ? `${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200` +
                avatar.tmdb.avatar_path
              : null,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {username && <p className="font-medium">{username}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild disabled>
          <Link href="/space">Space</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled>
          <Link href="/favorite">Mes favoris</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled>
          <Link href="/settings">Paramétres</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            startTransition(async () => {
              await logout();
            });
          }}
        >
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
