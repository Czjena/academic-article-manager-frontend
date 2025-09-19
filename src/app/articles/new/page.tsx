'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/app/providers/auth-context';

type FormState = {
  title: string;
  authors: string;
  abstract: string;
  keywords: string;
  category: string;
  file: File | null;
};

const CATEGORIES = ['Informatyka', 'Biologia', 'Fizyka', 'Ekologia', 'Inżynieria'];

export default function SubmitArticlePage() {
  const { token } = useAuth();

  const [form, setForm] = useState<FormState>({
    title: '',
    authors: '',
    abstract: '',
    keywords: '',
    category: 'Informatyka',
    file: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const saveDraft = () => {
    setError(null);
    setInfo('Szkic zapisany lokalnie (mock). Możesz dokończyć później.');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!form.title || !form.authors || !form.abstract || !form.keywords || !form.category) {
      setError('Uzupełnij wszystkie pola.');
      return;
    }

    if (!token) {
      setError('Nie jesteś zalogowany.');
      return;
    }

    setBusy(true);
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
      const res = await fetch(`${apiUrl}/api/articles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || data?.error || `${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const articleId = data.id;

      // jeśli jest plik, od razu wysyłamy
      if (form.file) {
        const payload = new FormData();
        payload.append('file', form.file);
        const fileRes = await fetch(`${apiUrl}/files/${articleId}/upload-file`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        });

        if (!fileRes.ok) {
          const fData = await fileRes.json().catch(() => null);
          throw new Error(fData?.message || fData?.error || `${fileRes.status} ${fileRes.statusText}`);
        }
        setInfo('Zgłoszenie wysłane i plik przesłany.');
      } else {
        setInfo('Zgłoszenie wysłane. Możesz teraz dodać plik.');
      }

      // wyczyść formularz
      setForm({ title: '', authors: '', abstract: '', keywords: '', category: 'Informatyka', file: null });

    } catch (err: any) {
      setError(err.message || 'Nie udało się wysłać zgłoszenia.');
    } finally {
      setBusy(false);
    }
  };

  return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Zgłoś artykuł</CardTitle>
            <CardDescription className="text-gray-400">
              Wypełnij formularz i dołącz plik (PDF / DOCX / LaTeX). Przed przesłaniem do recenzji możesz edytować zgłoszenie.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={submit}>
              {error && <div className="text-sm text-red-400">{error}</div>}
              {info && <div className="text-sm text-green-400">{info}</div>}

              <div>
                <label className="block text-sm text-gray-300 mb-1">Tytuł</label>
                <Input value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} placeholder="Tytuł artykułu" required className="bg-gray-700 border-0 text-gray-100" />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Autorzy (oddziel przecinkami)</label>
                <Input value={form.authors} onChange={e => setForm(s => ({ ...s, authors: e.target.value }))} placeholder="Jan Kowalski, Anna Nowak" required className="bg-gray-700 border-0 text-gray-100" />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Streszczenie</label>
                <textarea rows={8} value={form.abstract} onChange={e => setForm(s => ({ ...s, abstract: e.target.value }))} placeholder="Krótki opis pracy..." required className="w-full rounded-md bg-gray-700 border-0 text-gray-100 px-3 py-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Słowa kluczowe (oddziel przecinkami)</label>
                  <Input value={form.keywords} onChange={e => setForm(s => ({ ...s, keywords: e.target.value }))} placeholder="AI, grafy, sieci neuronowe" required className="bg-gray-700 border-0 text-gray-100" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Kategoria / dział</label>
                  <select value={form.category} onChange={e => setForm(s => ({ ...s, category: e.target.value }))} required className="w-full rounded-md bg-gray-700 border-0 text-gray-100 px-3 py-2">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* nowe pole pliku */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Plik (PDF / DOCX / LaTeX)</label>
                <input
                    type="file"
                    accept=".pdf,.docx,.tex"
                    onChange={e => setForm(s => ({ ...s, file: e.target.files?.[0] ?? null }))}
                    className="block w-full text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-gray-600 file:px-4 file:py-2 file:text-white hover:file:bg-gray-500"
                />
                {form.file && <p className="mt-1 text-xs text-gray-300">Wybrano: {form.file.name}</p>}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={saveDraft} className="border-gray-600 text-black hover:bg-gray-700">Zapisz szkic</Button>
                <Button type="submit" disabled={busy} className="bg-blue-600 hover:bg-blue-500">{busy ? 'Wysyłanie…' : 'Wyślij zgłoszenie'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
