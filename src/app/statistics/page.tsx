'use client';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';

type StatsResponse = {
  submitted: number;
  reviewed: number;
  published: number;
};

type KPI = { label: string; value: number };
type Monthly = { m: string; submitted: number; published: number };
type Slice = { name: string; value: number };

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://academic-article-manager-backend.up.railway.app';

export default function RechartsClient() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const kpis: KPI[] = useMemo(() => {
    if (!stats) return [];
    return [
      { label: 'Zgłoszone', value: stats.submitted },
      { label: 'W recenzji', value: stats.reviewed },
      { label: 'Opublikowane', value: stats.published },
      { label: 'Recenzenci aktywni', value: 0 }, // mock
    ];
  }, [stats]);

  const statusPie: Slice[] = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Zgłoszony', value: stats.submitted },
      { name: 'W recenzji', value: stats.reviewed },
      { name: 'Opublikowany', value: stats.published },
    ];
  }, [stats]);

  const monthly: Monthly[] = useMemo(() => {
    if (!stats) return [];
    return [{ m: 'Aktualne', submitted: stats.submitted, published: stats.published }];
  }, [stats]);

  if (loading) {
    return (
        <div className="text-center py-20">
          <p className="text-lg text-gray-300 mb-4">Ładowanie statystyk...</p>
        </div>
    );
  }

  if (!stats) {
    return (
        <div className="text-center py-20">
          <p className="text-lg text-gray-300 mb-4">Brak statystyk do wyświetlenia.</p>
        </div>
    );
  }

  const pieColors = ["#60a5fa", "#fbbf24", "#93c5fd", "#f87171", "#34d399"];

  return (
      <div className="space-y-6">
        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">{k.label}</div>
                  <div className="text-3xl font-semibold mt-1 text-white">{k.value}</div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Wykres liniowy */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="mb-3 text-gray-200 font-medium">Zgłoszenia vs publikacje</div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="m" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="submitted" name="Zgłoszone" />
                  <Line type="monotone" dataKey="published" name="Opublikowane" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Wykres kołowy */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="mb-3 text-gray-200 font-medium">Udział statusów</div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPie} dataKey="value" nameKey="name" outerRadius={100} label>
                    {statusPie.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
