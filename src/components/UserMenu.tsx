"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/providers/auth-context";

export default function UserMenu() {
    const { logout, isLoggedIn } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    }, []);

    if (!isLoggedIn) return null;

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg border px-3 py-1 hover:bg-gray-800/40"
            >
        <span className="hidden sm:inline text-sm">
          Zalogowany
        </span>
                <span className="w-7 h-7 rounded-full bg-blue-500 text-white grid place-items-center text-xs">
          U
        </span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-gray-900/95 backdrop-blur p-1 shadow-xl">
                    <a href="/profile" className="block rounded-lg px-3 py-2 hover:bg-gray-800">
                        Profil
                    </a>
                    <button
                        onClick={logout}
                        className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-800"
                    >
                        Wyloguj
                    </button>
                </div>
            )}
        </div>
    );
}
