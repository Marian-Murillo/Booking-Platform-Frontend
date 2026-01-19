"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      setError("Debes iniciar sesión para ver tus reservas.");
      return;
    }

    fetch("http://localhost:5000/api/bookings/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error al cargar reservas");
        }

        // 🔹 IMPORTANTE: Nos aseguramos de que siempre sea un array
        setBookings(Array.isArray(data) ? data : data.bookings || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-10">Loading Bookings...</p>;

  if (error) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-4 text-red-500">{error}</p>
        <Link href="/" className="text-red-500 underline">
          Explore more Properties
        </Link>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-4">You have no bookings yet.</p>
        <Link href="/" className="text-red-500 underline">
          Explore more Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((b) => {
          const start = new Date(b.startDate).toLocaleDateString();
          const end = new Date(b.endDate).toLocaleDateString();

          return (
            <div
              key={b._id}
              className="border rounded-xl p-4 shadow-md flex gap-4"
            >
              <div>
                <h2 className="font-bold text-lg">
                  {b.property?.title}
                </h2>
                <p className="text-gray-600">
                  {b.property?.location}
                </p>

                <p className="mt-2">
                  📅 {start} → {end}
                </p>

                <p className="mt-1 font-bold">
                  Total: ${b.totalPrice}
                </p>

                <Link
                  href={`/property/${b.property?._id}`}
                  className="text-red-500 underline mt-2 block"
                >
                  View Property
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
