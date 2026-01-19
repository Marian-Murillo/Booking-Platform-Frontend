"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);

    alert("Correct Login 🚀");

    // 👉 REDIRECCIÓN AQUÍ
    router.push("/");
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2"/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2"/>

        <button className="bg-green-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
