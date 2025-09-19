'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-context';

const disabled = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DISABLE_GUARD === '1';

export default function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (disabled) {
      setLoading(false);
      return;
    }

    if (!isLoggedIn) {
      router.replace('/login');
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, router]);

  if (!disabled && loading) {
    return (
        <div className="text-center py-20">
          <p className="text-lg text-gray-300">Sprawdzanie dostępu...</p>
        </div>
    );
  }

  return <>{children}</>;
}
