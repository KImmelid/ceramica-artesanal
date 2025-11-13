export default function WorkshopsSkeleton() {
  const Card = () => (
    <div className="card">
      <div className="skeleton h-5 w-40 mb-2" />
      <div className="skeleton h-4 w-64 mb-2" />
      <div className="skeleton h-4 w-52 mb-4" />
      <div className="flex gap-2">
        <div className="skeleton h-10 w-28" />
        <div className="skeleton h-10 w-24" />
      </div>
    </div>
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card />
      <Card />
      <Card />
      <Card />
    </div>
  );
}

