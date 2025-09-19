'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/providers/auth-context';

export default function ReviewPage() {
    const router = useRouter();
    const { articleId } = useParams<{ articleId: string }>();
    const { token } = useAuth();

    const [content, setContent] = useState('');
    const [rating, setRating] = useState<number>(5); // mock rating domyślnie 5
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!token) throw new Error('Brak tokenu');
            if (!articleId) throw new Error('Brak ID artykułu');

            const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
            const res = await fetch(`${BASE_URL}/api/reviewers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ articleId, content, rating }),
            });

            const resData = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(resData?.error || `Błąd wysyłania recenzji (${res.status})`);
            }

            setSuccess('Recenzja została dodana!');
            setContent('');
            setRating(5);
            router.push(`/articles`);
        } catch (err: any) {
            setError(err.message || 'Błąd wysyłania recenzji');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-4">
            <h1 className="text-2xl font-semibold">Dodaj recenzję</h1>

            {articleId && <p className="text-gray-400">Artykuł UUID: {articleId}</p>}
            {error && <p className="text-red-400">{error}</p>}
            {success && <p className="text-green-400">{success}</p>}

            <form onSubmit={submitReview} className="space-y-2">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Napisz recenzję..."
                    className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white"
                    rows={6}
                    required
                />

                <div className="flex items-center gap-2">
                    <label className="text-gray-300">Ocena:</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="rounded bg-gray-800 border border-gray-700 text-white px-2 py-1"
                    >
                        {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Wysyłanie...' : 'Dodaj recenzję'}
                </Button>
            </form>
        </div>
    );
}
