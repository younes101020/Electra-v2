import {
  Card as CardComponent,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hero } from "./_components/hero";
import { Icons } from "@/components/icons";
import { CanvasRevealEffectDemo3 } from "./_components/reveal";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Promo } from "./_components/promo";

type Promo = {
  icon: any;
  title: string;
  description: string;
};

const promos: Promo[] = [
  {
    icon: <Icons.message />,
    title: "Discutez",
    description:
      "Grand admirateur d'un film en particulier ? Alors rejoignez un espace où vous trouverez d'autres personnes partageant la même obsession que vous !",
  },
  {
    icon: <Icons.save />,
    title: "Sauvegardez",
    description:
      "Vous avez beaucoup trop de choses à visionner et vous avez peur d'oublier ? Pas de souci, ajoutez du contenu cinématographique à votre liste de visionnage et consultez-la à tout moment.",
  },
  {
    icon: <Icons.star />,
    title: "Notez",
    description:
      "Influencez le référencement des différents contenus cinématographiques au sein de l'application en donnant une notation en étoiles. Plus un film obtient une haute note d'étoiles, mieux il est référencé.",
  },
];

export default function Landing() {
  return (
    <>
      <section className="w-full px-14 md:px-28 py-20 pt-28 md:pt-20">
        <Hero />
      </section>
      <section className="pt-5 h-screen">
        <CanvasRevealEffectDemo3 />
      </section>
      <section className="flex h-screen w-full p-10 md:p-28">
        <Promo />
      </section>
    </>
  );
}
