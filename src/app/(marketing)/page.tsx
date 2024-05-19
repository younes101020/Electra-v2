import {
  Card as CardComponent,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hero } from "./_components/hero";
import { Icons } from "@/components/icons";

export default function Accueil() {
  return (
    <>
        <section className="w-full">
          <Hero />
        </section>
        <section className="w-full px-7 pb-10 flex flex-col lg:flex-row gap-20 justify-center items-center">
          <CardComponent
            className={`w-[350px] z-50 relative after:absolute after:top-[-4rem] after:content-['1'] after:text-8xl after:text-primary-foreground/50 after:font-semibold`}
          >
            <div className="absolute right-[-1rem] top-[-1rem] text-primary-foreground bg-primary/50 rounded-full p-2">
              <div className="p-2 bg-primary rounded-full">
                <Icons.message />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Discutez</CardTitle>
            </CardHeader>
            <CardContent>
              Grand admirateur d'un film ou d'une série en particulier ? Alors
              rejoignez un espace où vous trouverez d'autres personnes
              partageant la même obsession que vous !
            </CardContent>
          </CardComponent>
          <CardComponent
            className={`w-[350px] z-50 relative after:absolute after:top-[-4rem] after:content-['2'] after:text-8xl after:text-primary-foreground/50 after:font-semibold`}
          >
            <div className="absolute right-[-1rem] top-[-1rem] text-primary-foreground bg-primary/50 rounded-full p-2">
              <div className="p-2 bg-primary rounded-full">
                <Icons.save />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Sauvegardez</CardTitle>
            </CardHeader>
            <CardContent>
              Vous avez beaucoup trop de choses à visionner et vous avez peur
              d'oublier ? Pas de souci, ajoutez du contenu cinématographique à
              votre liste de visionnage et consultez-la à tout moment.
            </CardContent>
          </CardComponent>
          <CardComponent
            className={`w-[350px] z-50 relative after:absolute after:top-[-4rem] after:content-['3'] after:text-8xl after:text-primary-foreground/50 after:font-semibold`}
          >
            <div className="absolute right-[-1rem] top-[-1rem] text-primary-foreground bg-primary/50 rounded-full p-2">
              <div className="p-2 bg-primary rounded-full">
                <Icons.activity />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Notez</CardTitle>
            </CardHeader>
            <CardContent>
              Influencez le référencement des différents contenus
              cinématographiques au sein de l'application en donnant une
              notation en étoiles. Plus un film ou une série obtient une haute
              note d'étoiles, mieux il est référencé.
            </CardContent>
          </CardComponent>
        </section>
    </>
  );
}
