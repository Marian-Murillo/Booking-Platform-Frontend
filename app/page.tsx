import Link from "next/link";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`);
  const properties = await res.json();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
      {properties.map((p: any) => (
        <div 
          key={p._id} 
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
        >
          {/* IMAGEN (luego la conectamos a tu backend) */}
          

          <div className="p-4 space-y-2">
            <h2 className="text-lg font-bold">{p.title}</h2>
            <p className="text-gray-600">{p.location}</p>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-red-500">
                ${p.pricePerNight} / nigth
              </span>

              <Link
                href={`/property/${p._id}`}
                className="bg-black text-white px-3 py-1 rounded-lg text-sm"
              >
                Details
              </Link>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
