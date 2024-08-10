export type Message = {
  id: number;
  content: string;
  spaceId: number | null;
  user: {
    id: number;
    name: string;
    image: string | null;
  } | null;
};

export type User = Prisma.UserCreateInput & { socketID: string };
