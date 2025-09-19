'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError('Hasła nie są identyczne')
            return
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const res = await fetch(`${apiUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errText = await res.text()
                throw new Error(errText || 'Błąd rejestracji')
            }

            setSuccess('Konto zostało pomyślnie utworzone!')
            setTimeout(() => router.push('/login'), 2000) // Przekierowanie po 2 sekundach
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-2xl font-semibold text-gray-200 text-center">StudyPost</h1>
                <p className="text-sm text-gray-400 text-center">Masz konto? <a href="/login" className="text-gray-300 hover:underline">Zaloguj się</a></p>
                <form onSubmit={handleRegister} className="space-y-4">
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-400 text-sm text-center">{success}</p>}
                    <h2 className="text-lg text-gray-200 text-center">Zarejestruj się</h2>
                    <div>
                        <Input
                            id="email"
                            type="email"
                            className="bg-gray-700 text-gray-100 border-0 focus:ring-0 w-full placeholder:text-gray-400"
                            placeholder="example@studypost.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            id="password"
                            type="password"
                            className="bg-gray-700 text-gray-100 border-0 focus:ring-0 w-full placeholder:text-gray-400"
                            placeholder="Wprowadź hasło"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            id="confirmPassword"
                            type="password"
                            className="bg-gray-700 text-gray-100 border-0 focus:ring-0 w-full placeholder:text-gray-400"
                            placeholder="Potwierdź hasło"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md"
                    >
                        Zarejestruj się
                    </Button>
                </form>
            </div>
        </div>
    )
}