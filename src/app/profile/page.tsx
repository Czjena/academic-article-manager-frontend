'use client';
import ProtectedGuard from '@/app/protected/guard';
import { useAuth } from '@/app/providers/auth-context';

export default function ProfilePage() {
    const { token, isLoggedIn } = useAuth(); // <- zamiast user

    return (
        <ProtectedGuard>
            <div>
                <h1>Profil użytkownika</h1>
                <p>Twój token: {token}</p>
                <p>Status logowania: {isLoggedIn ? 'Zalogowany' : 'Nie zalogowany'}</p>
            </div>
        </ProtectedGuard>
    );
}
