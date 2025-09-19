"use client";

export default function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls =
    s.includes("opublik") ? "bg-green-900 text-green-300" :
    s.includes("recenz")   ? "bg-yellow-900 text-yellow-300" :
    s.includes("akcept")   ? "bg-blue-900 text-blue-300" :
    s.includes("odrz")     ? "bg-red-900 text-red-300" :
                              "bg-gray-700 text-gray-300";
  return (
    <span className={`px-2 py-1 rounded text-xs ${cls}`}>{status}</span>
  );
}
