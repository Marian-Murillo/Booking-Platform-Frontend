"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    const [user, setUser] = useState<{
        name?: string;
        role?: string;
    } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded: any = jwtDecode(token);
        setUser({
            name: decoded.name || "Usuario",
            role: decoded.role
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); // ✅ borra sesión
        setUser(null);                    // ✅ limpia estado
        router.push("/");                 // ✅ vuelve a Home
    };

    return (
        <nav className="flex justify-between items-center px-10 py-4 border-b">
            {/* IZQUIERDA */}
            <Link href="/" className="text-xl font-bold text-red-500">
                🏠 Airbnb Clone
            </Link>

            {/* CENTRO → TU NOMBRE SI ESTÁS LOGUEADA */}
            <div className="font-semibold">
                {user ? `Welcome, ${user.name} 👋` : "Welcome"}
            </div>

            {/* DERECHA */}
            <div className="flex gap-6 items-center">
                <Link href="/" className="hover:text-red-500">
                    Home
                </Link>

                {!user && (
                    <>
                        <Link href="/login" className="hover:text-red-500">
                            Login
                        </Link>

                        <Link href="/register" className="hover:text-red-500">
                            Register
                        </Link>
                    </>
                )}

                {/* SOLO SE MUESTRA SI ES ADMIN */}
                {user?.role === "ADMIN" && (
                    <Link href="/create-property" className="hover:text-red-500">
                        Create Property
                    </Link>
                )}

                {user && (

                    <Link href="/my-bookings" className="ml-4">
                        Mis Reservas
                    </Link>

                )}
                {/* BOTÓN LOGOUT (solo si estás logueada) */}
                {user && (

                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
