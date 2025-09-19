'use client';

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/auth-context";

type Article = {
  id: string;
  title: string;
  authors: string[] | string | null;
  abstract: string;
  status: "submitted" | "reviewed" | "published" | "accepted" | "rejected";
  category: string | null;
};

// Formatuje autorów do stringa
function formatAuthors(authors: string[] | string | null | undefined) {
  if (Array.isArray(authors)) return authors.join(", ");
  if (typeof authors === "string") return authors;
  return "Brak autorów";
}

// Mapy dla statusów i kolorów
const STATUS_LABELS: Record<string, string> = {
  published: "Opublikowany",
  reviewed: "W recenzji",
  submitted: "Zgłoszony",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony"
};

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-900 text-green-300",
  reviewed: "bg-yellow-900 text-yellow-300",
  submitted: "bg-blue-900 text-blue-300",
  accepted: "bg-blue-900 text-blue-300",
  rejected: "bg-red-900 text-red-300"
};

export default function ArticlesPage() {
  const params = useSearchParams();
  const router = useRouter();
  const queryParam = (params.get("query") || "").trim();
  const { token, isLoggedIn } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [localQ, setLocalQ] = useState(queryParam);

  const submitLocal = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/articles?query=${encodeURIComponent(localQ.trim())}`);
  };

  useEffect(() => {
    if (!token || !isLoggedIn) return;

    const fetchArticles = async () => {
      setLoading(true);
      setError("");

      try {
        const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
        const searchParams = new URLSearchParams();

        if (queryParam) {
          searchParams.append("title", queryParam);
          searchParams.append("authors", queryParam);
        }

        const url = `${BASE_URL}/api/articles/filter?${searchParams.toString()}`;
        console.log("Fetching URL:", url);

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          let msg = `${res.status} ${res.statusText}`;
          try {
            const data = await res.json();
            msg = data?.message || data?.error || msg;
          } catch {}
          throw new Error(msg);
        }

        const data: Article[] = await res.json();
        setArticles(data);

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Błąd pobierania artykułów");
        } else {
          setError("Błąd pobierania artykułów");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [queryParam, token, isLoggedIn]);

  const downloadAllPdf = async () => {
    if (!token) return;
    try {
      const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
      const res = await fetch(`${BASE_URL}/api/articles/export/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `articles.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Błąd pobierania PDF: ${err.message}`);
      } else {
        alert("Błąd pobierania PDF");
      }
    }
  };

  if (!isLoggedIn) {
    return (
        <div className="text-center py-20">
          <p className="text-lg text-gray-300 mb-4">
            Aby przeglądać artykuły, prosimy się zalogować.
          </p>
          <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Zaloguj się
          </Link>
        </div>
    );
  }

  return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Artykuły</h1>

          <div className="flex gap-2">
            <Button
                onClick={downloadAllPdf}
                variant="secondary"
                className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Pobierz PDF wszystkich artykułów
            </Button>

            <form onSubmit={submitLocal} className="flex gap-2">
              <Input
                  value={localQ}
                  onChange={(e) => setLocalQ(e.target.value)}
                  placeholder="Szukaj..."
                  className="w-64"
              />
              <Button type="submit">Szukaj</Button>
              <Link
                  href="/articles/new"
                  className="rounded-lg bg-blue-600 px-3 py-2 hover:bg-blue-700 text-white"
              >
                Zgłoś artykuł
              </Link>
            </form>
          </div>
        </div>

        {loading && <p className="text-gray-400">Ładowanie artykułów...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {articles.map(a => (
              <Card key={a.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white">{a.title}</CardTitle>
                    <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[a.status] || "bg-gray-700 text-gray-300"}`}>
                  {STATUS_LABELS[a.status] || a.status}
                </span>
                  </div>
                  <CardDescription className="text-gray-400">
                    {formatAuthors(a.authors)} • {a.category || "Brak kategorii"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 line-clamp-3">{a.abstract}</p>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Link href={`/articles/${a.id}`} className="inline-block rounded-lg border bg-blue-600 px-3 py-2 hover:bg-gray-700 text-white">
                      Szczegóły
                    </Link>
                    <Link href={`/review/${a.id}`} className="inline-block rounded-lg bg-green-600 px-3 py-2 hover:bg-green-700 text-white">
                      Dodaj recenzję
                    </Link>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
      </div>
  );
}
