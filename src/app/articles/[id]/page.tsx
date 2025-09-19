'use client';
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/auth-context";

type Article = {
  id: string;
  title: string;
  authors: string[] | string | null;
  abstract: string;
  status: "zgłoszony" | "w recenzji" | "zaakceptowany" | "odrzucony" | "opublikowany";
  category: string | null;
  fileUrl?: string;
};

export default function ArticleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError("");

      try {
        const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
        const res = await fetch(`${BASE_URL}/api/articles/${id}`, {
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

        const data: Article = await res.json();
        setArticle(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Błąd pobierania artykułu");
        } else {
          setError("Błąd pobierania artykułu");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, token]);

  const downloadSummaryPdf = async () => {
    if (!token || !article) return;
    try {
      const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
      const res = await fetch(`${BASE_URL}/api/articles/summary-pdf`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: article.title,
          abstractText: article.abstract,
        }),
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `summary_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Błąd pobierania PDF streszczenia: ${err.message}`);
      } else {
        alert("Błąd pobierania PDF streszczenia");
      }
    }
  };

  if (loading) return <p className="text-gray-400">Ładowanie…</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!article) return <p className="text-gray-400">Nie znaleziono artykułu.</p>;

  return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{article.title}</h1>
          <Link href="/articles" className="rounded-lg border px-3 py-2 hover:bg-gray-800">
            ← Wróć
          </Link>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Szczegóły</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-300">
            <p><b>Autorzy:</b> {Array.isArray(article.authors) ? article.authors.join(", ") : article.authors || "Brak autorów"}</p>
            <p><b>Kategoria:</b> {article.category || "Brak kategorii"}</p>
            <p><b>Status:</b> {article.status}</p>
            <p className="pt-2">
              <b>Streszczenie:</b><br />
              {article.abstract}
            </p>

            {article.fileUrl && (
                <div className="pt-4">
                  <Button asChild variant="secondary" className="bg-gray-700 hover:bg-gray-600">
                    <a href={article.fileUrl} target="_blank" rel="noreferrer">Pobierz plik</a>
                  </Button>
                </div>
            )}

            <div className="pt-4">
              <Button onClick={downloadSummaryPdf} variant="secondary" className="bg-white text-black hover:bg-gray-600">
                Pobierz PDF streszczenia
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
  );
}
