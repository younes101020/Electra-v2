export type Message = {
  id: number;
  content: string;
  spaceId: number | null;
  user: {
    name: string;
  } | null;
};
