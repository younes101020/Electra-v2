import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Casting } from "@/index";

type CharactersProps = { cast: Casting };

export function Characters({ cast }: CharactersProps) {
  return (
    <Card className="md:w-1/3">
      <CardHeader>
        <CardTitle>Acteurs et actrices</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="grid space-y-4 pt-2 md:grid-cols-2 xl:grid-cols-3">
        {cast.map((perso) => (
          <div key={perso.id} className="space-y-2 flex flex-col items-center">
            <div>
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/original${perso.profile_path}`}
                  alt={perso.original_name}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h3 className="leading-none tracking-tight">{perso.character}</h3>
              <CardDescription>{perso.original_name}</CardDescription>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
