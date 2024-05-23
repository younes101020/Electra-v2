export default function CustomSpacePage({ params }: { params: { id: string } }) {
  return <div>Show space id: {params.id}</div>;
}
