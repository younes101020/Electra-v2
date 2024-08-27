import { getTMDBAccountId } from "@/lib/session";
import { Metadata } from "next/types";
import defaultImage from "@/../public/img/no-image.png";
import { getUserSpaces } from "@/services/space";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/components/icons";

export const metadata: Metadata = {
    title: "Mes Spaces",
    description: "Gérez vos espaces de discussion cinéma",
};

export default async function SpacePage() {
    const tmdbAccoundId = await getTMDBAccountId();
    const userSpaces = await getUserSpaces(tmdbAccoundId);

    return (
        <div className="container mx-auto px-5 py-28 md:px-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSpaces.map((space) => (
                    <Card key={space.id} className="hover:shadow-xl transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-semibold">{space.movie_title} Space</CardTitle>
                            <div className="relative max-h-44 overflow-hidden">
                                <Image 
                                    src={space.movie_poster ? `${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200${space.movie_poster}` : defaultImage }
                                    alt={`${space.movie_title} poster`}
                                    width={200}
                                    height={200}
                                    className="w-full h-auto mt-2 mb-4 rounded-md"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/75 to-transparent rounded-b-md" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
                                <Icons.user className="h-5 w-5" />
                                <span>/</span>
                                <p>{space.users.length} participants</p>
                            </div>
                            <Link 
                                href={`/movies/space/${space.showId}`} 
                                className="w-full inline-block text-center py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/75 transition-colors"
                            >
                                Rejoindre le Space
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}