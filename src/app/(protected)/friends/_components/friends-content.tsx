"use client";

import { UserSearch } from "./user-search";
import { FriendRequests } from "./friend-requests";
import { FriendsList } from "./friends-list";

export function FriendsContent() {
  return (
    <>
      <h1 className="text-3xl font-bold">Mes amis</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Rechercher des utilisateurs</h2>
        <UserSearch />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Demandes reçues</h2>
        <FriendRequests />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Mes amis</h2>
        <FriendsList />
      </section>
    </>
  );
}
