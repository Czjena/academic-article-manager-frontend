/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// const disabled = process.env.NEXT_PUBLIC_DISABLE_GUARD === '1';
const disabled = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DISABLE_GUARD === '1';

export default function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (disabled) {
      setLoading(false);
      return;
    }

    // Tutaj nie używamy useAuth, np. zawsze przekierowujemy do /login
    setLoading(false);
    // router.replace('/login'); // odkomentuj jak chcesz wymusić login
  }, [router]);

  if (!disabled && loading) {
    return (
        <div className="text-center py-20">
          <p className="text-lg text-gray-300">Sprawdzanie dostępu...</p>
        </div>
    );
  }

  return <>{children}</>;
}
