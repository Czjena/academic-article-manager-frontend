"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";

type KPI = { label: string; value: number };
type Monthly = { m: string; submitted: number; published: number };
type Slice = { name: string; value: number };

export default function RechartsClient({
  kpis,
  monthly,
  statusPie,
}: {
  kpis: KPI[];
  monthly: Monthly[];
  statusPie: Slice[];
}) {
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
