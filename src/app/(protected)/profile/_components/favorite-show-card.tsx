import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface FavoriteShowCardProps {
  id: number;
  original_title: string;
  poster_path: string;
}

export function FavoriteShowCard({
  id,
  original_title,
  poster_path,
}: FavoriteShowCardProps) {
  return (
    <Link href={`/movies/${id}`}>
      <Card className="h-full transition-colors hover:border-foreground/25">
        <CardHeader className="p-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200${poster_path}`}
            alt={`Poster de ${original_title}`}
            width={200}
            height={300}
            className="h-auto w-full rounded-t-lg object-cover"
          />
        </CardHeader>
        <CardContent className="p-3">
          <p className="truncate text-sm font-medium">{original_title}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
