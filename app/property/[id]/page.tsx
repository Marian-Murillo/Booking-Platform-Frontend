"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [totalNights, setTotalNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Cargar propiedad y fechas no disponibles
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        setTotalPrice(data.pricePerNight);

        // Convertir fechas bloqueadas a objetos Date
        const blocked = data.unavailableDates.map((d: string) => new Date(d));
        setDisabledDates(blocked);
      });
  }, [id]);

  // Calcular noches y precio cada vez que cambian las fechas
  useEffect(() => {
    if (!property) return;

    const start = range[0].startDate;
    const end = range[0].endDate;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    setTotalNights(nights);
    setTotalPrice(nights * property.pricePerNight);
  }, [range, property]);

  const handleReserve = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión para reservar");
      return;
    }

    // Validar si hay fechas bloqueadas en el rango seleccionado
    const hasBlockedDate = disabledDates.some(date => {
      const start = new Date(range[0].startDate);
      const end = new Date(range[0].endDate);
      return date >= start && date <= end;
    });

    if (hasBlockedDate) {
      alert("Has seleccionado fechas no disponibles");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        propertyId: id,
        startDate: range[0].startDate,
        endDate: range[0].endDate,
        totalPrice
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al reservar");
      return;
    }

    alert("Reserva creada con éxito 🎉");

    // (Opcional) Refrescar fechas bloqueadas después de reservar
    setDisabledDates(prev => [
      ...prev,
      ...getDatesInRange(range[0].startDate, range[0].endDate)
    ]);
  };

  if (!property) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* IZQUIERDA - INFO DE LA PROPIEDAD */}
      <div>
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-gray-600">{property.location}</p>
        <p className="mt-4">{property.description}</p>

        <p className="mt-4 font-bold text-xl">
          ${property.pricePerNight} / night
        </p>
      </div>

      {/* DERECHA - CALENDARIO + RESERVA */}
      <div className="border p-4 rounded-xl shadow-lg">
        <h2 className="font-bold mb-2">Select start and end dates</h2>

        <DateRange
          ranges={range}
          onChange={(item: any) => setRange([item.selection])}
          minDate={new Date()}
          disabledDates={disabledDates}
        />

        <div className="mt-4 space-y-2">
          <p>
            Nights: <span className="font-bold">{totalNights}</span>
          </p>

          <p className="text-lg">
            Total:{" "}
            <span className="font-bold text-red-500">
              ${totalPrice}
            </span>
          </p>

          <button
            onClick={handleReserve}
            className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}

// Función auxiliar para refrescar fechas bloqueadas (opcional)
function getDatesInRange(startDate: Date, endDate: Date) {
  const dates: Date[] = [];
  let current = new Date(startDate);

  while (current <= new Date(endDate)) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
