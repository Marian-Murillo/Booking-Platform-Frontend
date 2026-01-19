"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("User created 🎉");

    
    router.push("/login");
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Full Name" onChange={handleChange} className="border p-2"/>
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2"/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2"/>

        <button className="bg-blue-600 text-white p-2 rounded">
          SIGN IN
        </button>
      </form>
    </div>
  );
}
