export default function SpacePage({ params }: { params: { id: string } }) {
  return <div>Show space id: {params.id}</div>;
}
