'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/providers/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const extractToken = async (res: Response) => {
    try {
      const data = await res.clone().json();
      return data?.token || data?.accessToken || null;
    } catch { }
    try {
      const txt = (await res.clone().text()).trim();
      if (/^Bearer\s+/i.test(txt)) return txt.replace(/^Bearer\s+/i, '').trim();
      if (txt) return txt;
    } catch { }
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
      if (!BASE_URL) throw new Error('Brak NEXT_PUBLIC_API_URL w .env');

      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let msg = `${response.status} ${response.statusText}`;
        try {
          const data = await response.clone().json();
          msg = data?.message || data?.error || msg;
        } catch {
          try {
            const txt = await response.clone().text();
            if (txt) msg = txt;
          } catch { }
        }
        throw new Error(msg);
      }

      const token = await extractToken(response);
      if (!token) throw new Error('Nie otrzymano tokena z serwera');

      await login(token);
      router.replace('/articles');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Nie udało się zalogować');
      } else {
        setError('Nie udało się zalogować');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-2xl font-semibold text-gray-200 text-center">StudyPost</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <Input
                id="email"
                type="email"
                placeholder="example@studypost.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 text-gray-100 border-0 focus:ring-0 w-full placeholder:text-gray-400 py-2"
            />
            <Input
                id="password"
                type="password"
                placeholder="Wprowadź hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 text-gray-100 border-0 focus:ring-0 w-full placeholder:text-gray-400 py-2"
            />
            <Button type="submit" disabled={busy} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md">
              {busy ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>
          <p className="text-sm text-gray-400 text-center">
            Nie masz konta? <a href="/register" className="text-gray-300 hover:underline">Zarejestruj się</a>
          </p>
        </div>
      </div>
  );
}
