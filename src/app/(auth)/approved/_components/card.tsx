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
import { useRouter } from 'next/navigation'
import { Icons } from "@/components/icons";
import fetcher from "@/utils/http";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface ICreds {
  access_token: string;
  account_id: string;
}

type CardProps = React.ComponentProps<typeof ConfirmCard> & ICreds;

export function Card({ className, ...props }: CardProps) {
    const router = useRouter()
  const { toast } = useToast();
  const handleClick = async () => {
    const res = await fetcher(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/approved`,
      {
        body: JSON.stringify({
          account_id: props.account_id,
          access_token: props.access_token,
        }),
      }
    );
    if (!res.ok) {
      toast({
        title: "Connexion impossible",
        description:
          "Un problème s'est produit lors de la tentative de validation, veuillez retourner à la page principal et pour vous reconnecter",
        action: <Link href={"/"}>Page principal</Link>,
      });
    }
    router.push('/accueil')
  };
  return (
    <ConfirmCard className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>Plus qu'une dernière étape!</CardTitle>
        <CardDescription>
          Vous devez valider votre demande de connexion afin d'accéder à Electra
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={handleClick}>
          <Icons.check className="mr-2 h-4 w-4" /> Valider
        </Button>
      </CardFooter>
    </ConfirmCard>
  );
}
