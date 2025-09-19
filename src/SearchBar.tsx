"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/articles?query=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-3 w-full max-w-lg">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Szukaj artykułów..."
        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
      >
        Szukaj
      </button>
    </form>
  );
}
