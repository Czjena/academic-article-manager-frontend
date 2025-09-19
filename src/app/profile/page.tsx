'use client';
import Guard from '@/components/Guard';
import { useAuth } from '@/app/providers/auth-context';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <Guard>
            <h1 className="text-2xl font-semibold mb-3">Profil</h1>
            {user ? (
                <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Username:</strong> {user.username || 'Brak'}</p>
                    <pre className="mt-3 p-3 bg-gray-900 rounded-xl">{JSON.stringify(user, null, 2)}</pre>
                </div>
            ) : (
                <p className="text-gray-400">Brak danych użytkownika.</p>
            )}
        </Guard>
    );
}