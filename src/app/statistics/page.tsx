'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/providers/auth-context';
import Link from 'next/link';

const RechartsClient = dynamic(() => import('./RechartsClient'), { ssr: false });

const RANGES = [
  { id: '30d', label: 'Ostatnie 30 dni' },
  { id: '90d', label: 'Ostatnie 90 dni' },
  { id: 'ytd', label: 'Rok bieżący (YTD)' },
] as const;

type RangeId = typeof RANGES[number]['id'];

type StatsResponse = {
  submitted: number;
  reviewed: number;
  published: number;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function StatisticsPage() {
  const { isLoggedIn } = useAuth();
  const [range, setRange] = useState<RangeId>('30d');
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch statystyk
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await fetch(`${BASE_URL}/api/articles/statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Błąd pobierania statystyk');

        const data: StatsResponse = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isLoggedIn]);

  // Hooki muszą być zawsze wywołane
  const kpis = useMemo(() => {
    if (!stats) return [];
    return [
      { label: 'Zgłoszone', value: stats.submitted },
      { label: 'W recenzji', value: stats.reviewed },
      { label: 'Opublikowane', value: stats.published },
      { label: 'Recenzenci aktywni', value: 0 }, // mock
    ];
  }, [stats]);

  const statusPie = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Zgłoszony', value: stats.submitted },
      { name: 'W recenzji', value: stats.reviewed },
      { name: 'Opublikowany', value: stats.published },
    ];
  }, [stats]);

  // Widok dla niezalogowanego użytkownika
  if (!isLoggedIn) {
    return (
        <div className="text-center py-20">
          <p className="text-lg text-gray-300 mb-4">
            Musisz się zalogować, aby przeglądać statystyki.
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

  // Loader podczas pobierania statystyk
  if (loading) {
    return (
        <div className="text-center py-20">
          <p className="text-lg text-gray-300 mb-4">Ładowanie statystyk...</p>
        </div>
    );
  }

  // Jeśli zalogowany, ale brak statystyk
  if (!stats) {
    return (
        <div className="text-center py-20">
          <p className="text-lg text-gray-300 mb-4">
            Brak statystyk do wyświetlenia.
          </p>
        </div>
    );
  }

  // Dashboard
  return (
      <div className="space-y-4">
        {/* FILTRY */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <h1 className="text-2xl font-semibold">Statystyki</h1>
          <div className="flex gap-2">
            <select
                value={range}
                onChange={e => setRange(e.target.value as RangeId)}
                className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
            >
              {RANGES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
              ))}
            </select>
          </div>
        </div>

        {/* DASHBOARD */}
        <RechartsClient
            kpis={kpis}
            monthly={[{ m: 'Aktualne', submitted: stats.submitted, published: stats.published }]}
            statusPie={statusPie}
        />
      </div>
  );
}
