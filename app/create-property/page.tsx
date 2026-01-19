"use client";

import { useState } from "react";

export default function CreateProperty() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    pricePerNight: 0
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    alert("Property Created 🏠");
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Property</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="title" placeholder="Title" onChange={handleChange} className="border p-2"/>
        <input name="location" placeholder="Location" onChange={handleChange} className="border p-2"/>
        <input name="pricePerNight" type="number" placeholder="Price per Nigth" onChange={handleChange} className="border p-2"/>

        <button className="bg-purple-600 text-white p-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
