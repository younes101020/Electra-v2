"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { User } from "@/index";
import { useState } from "react";

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const [isOpen, setIsOpen] = useState(true);

  return isOpen ? (
    <ul className="relative flex h-full flex-col gap-2 border-r-[.1rem] pr-4">
      <li onClick={() => setIsOpen(false)}>
        <Icons.shrink className="absolute right-[-.7rem] cursor-pointer rounded-full bg-primary p-1 text-primary-foreground" />
      </li>
      <li className="pb-2 text-lg font-medium">Utilisateurs:</li>
      {users.map((user) => (
        <li key={user!.id} className="rounded-md px-2 py-1 text-sm">
          {user!.name}
          {user.socketID ? (
            <Badge variant={"success"} className="ml-2">
              En ligne
            </Badge>
          ) : (
            <Badge variant={"destructive"} className="ml-2">
              Hors ligne
            </Badge>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <Icons.expand
      onClick={() => setIsOpen(true)}
      className="cursor-pointer rounded-full bg-primary p-1 leading-6 text-primary-foreground"
    />
  );
}
