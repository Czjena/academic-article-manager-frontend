"use client";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth-context";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";

export default function NavBar() {
  const { isLoggedIn } = useAuth(); // usunięto token

  return (
      <header className="w-full bg-gray-900/70 backdrop-blur sticky top-0 z-40 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-6">
          {/* LEWA STRONA: logo i linki */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-block w-6 h-6 rounded-lg bg-blue-500" />
              <span className="font-semibold">StudyPost</span>
            </Link>
            <nav className="hidden md:flex items-center gap-5">
              <Link href="/articles" className="hover:underline">Artykuły</Link>
              <Link href="/articles/new" className="hover:underline">Zgłoś artykuł</Link>
              <Link href="/statistics" className="hover:underline">Statystyki</Link>
            </nav>
          </div>

          {/* PRAWA STRONA: wyszukiwarka + logowanie */}
          <div className="flex items-center gap-4">
            <SearchBar />
            {isLoggedIn ? (
                <UserMenu />
            ) : (
                <>
                  <Link
                      href="/login"
                      className="rounded-lg border px-3 py-1 hover:bg-gray-800/40"
                  >
                    Zaloguj się
                  </Link>
                  <Link
                      href="/register"
                      className="rounded-lg bg-blue-600 px-3 py-1 hover:bg-blue-700"
                  >
                    Zarejestruj
                  </Link>
                </>
            )}
          </div>
        </div>
      </header>
  );
}
