"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card as ConfirmCard,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { confirmAuth } from "../_actions/confirmAuth";

interface ICreds {
  access_token: string;
  account_id: string;
}

type CardProps = React.ComponentProps<typeof ConfirmCard> & ICreds;

export function Card({ className, ...props }: CardProps) {
  // see: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#passing-additional-arguments
  const confirmLastAuthStep = confirmAuth.bind(null, props);
  return (
    <ConfirmCard className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>Plus qu'une dernière étape!</CardTitle>
        <CardDescription>
          Vous devez valider votre demande de connexion afin d'accéder à Electra
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <form action={confirmLastAuthStep}>
          <Button className="w-full" type="submit">
            <Icons.check className="mr-2 h-4 w-4" /> Valider
          </Button>
        </form>
      </CardFooter>
    </ConfirmCard>
  );
}
