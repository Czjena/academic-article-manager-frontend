"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-context";

const disabled =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_DISABLE_GUARD === "1";

export default function Guard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (disabled) return; // 🔓 podgląd bez logowania w dev
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (!disabled && (loading || !user)) return null;
  return <>{children}</>;
}
