"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-context";

export default function ProtectedGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  // Jeśli nie jesteś zalogowany, możesz zwrócić loader/spinner albo null
  if (!isLoggedIn) return null;

  return <>{children}</>;
}
