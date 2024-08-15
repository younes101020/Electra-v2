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
      <CardContent className="grid pt-4 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {cast.map((perso) => (
          <div key={perso.id} className="flex flex-col space-y-2">
            <div>
              <Avatar className="h-12 w-12">
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
