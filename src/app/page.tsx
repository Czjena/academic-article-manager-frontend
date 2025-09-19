'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {

  const recentArticles = [
    {
      id: 1,
      title: 'Nowe metody analizy danych w biologii molekularnej',
      authors: ['Jan Kowalski', 'Anna Nowak'],
      abstract: 'Badania nad zastosowaniem sztucznej inteligencji w genomice...',
      status: 'opublikowany',
      category: 'Biologia'
    },
    {
      id: 2,
      title: 'Wpływ zmian klimatu na ekosystemy morskie',
      authors: ['Michał Wiśniewski'],
      abstract: 'Analiza długoterminowych zmian w populacjach ryb...',
      status: 'w recenzji',
      category: 'Ekologia'
    },
    {
      id: 3,
      title: 'Zaawansowane algorytmy uczenia maszynowego',
      authors: ['Katarzyna Zielińska', 'Tomasz Lewandowski'],
      abstract: 'Porównanie efektywności nowych architektur sieci neuronowych...',
      status: 'zaakceptowany',
      category: 'Informatyka'
    }
  ];

  return (
      <div className="min-h-screen bg-gray-900">

        {/* Hero Sekcja */}
        <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Platforma do zgłaszania i recenzowania artykułów naukowych
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Zgłaszaj swoje prace naukowe, uczestnicz w procesie recenzji i publikuj wyniki badań
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 px-8" asChild>
                <Link href="/articles/new">Zgłoś artykuł</Link>
              </Button>
              <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-200 px-8" asChild>
                <Link href="/articles">Przeglądaj artykuły</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Funkcjonalności */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Jak działa nasza platforma</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Karty */}
              {[
                { title: 'Zgłaszanie artykułów', description: 'Przesyłaj swoje prace naukowe', items: ['Obsługa formatów: PDF, LaTeX, DOCX', 'Formularz zgłoszeniowy', 'Możliwość edycji przed recenzją'] },
                { title: 'Proces recenzji', description: 'System oceny i weryfikacji', items: ['Przypisywanie recenzentów', 'System oceniania artykułów', 'Śledzenie statusów'] },
                { title: 'Publikacja', description: 'Udostępnianie wyników badań', items: ['Zatwierdzanie do publikacji', 'Generowanie PDF do druku', 'Eksport danych'] },
              ].map((card, idx) => (
                  <Card key={idx} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">{card.title}</CardTitle>
                      <CardDescription className="text-gray-400">{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-300">
                        {card.items.map((item, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                              {item}
                            </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Ostatnie artykuły */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Ostatnio dodane artykuły</h2>
              <Button variant="outline" className="border-gray-500 text-black hover:bg-gray-700" asChild>
                <Link href="/articles">Zobacz wszystkie</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                  <Card key={article.id} className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white">{article.title}</CardTitle>
                        <span className={`px-2 py-1 rounded text-xs ${
                            article.status === 'opublikowany' ? 'bg-green-900 text-green-300' :
                                article.status === 'w recenzji' ? 'bg-yellow-900 text-yellow-300' :
                                    'bg-blue-900 text-blue-300'
                        }`}>
                      {article.status}
                    </span>
                      </div>
                      <CardDescription className="text-gray-400">
                        {article.authors.join(', ')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 line-clamp-3">{article.abstract}</p>
                      <div className="mt-4 flex items-center">
                        <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">{article.category}</span>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stopka */}
        <footer className="bg-gray-900 border-t border-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">StudyPost</h3>
                <p className="text-gray-400">Platforma do zgłaszania i recenzowania prac naukowych</p>
              </div>

              <div>
                <h4 className="text-white font-medium mb-4">Nawigacja</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/" className="hover:text-white">Strona główna</Link></li>
                  <li><Link href="/articles" className="hover:text-white">Artykuły</Link></li>
                  <li><Link href="/articles/new" className="hover:text-white">Zgłoś artykuł</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-4">Kontakt</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>support@studypost.edu</li>
                  <li>+48 123 456 789</li>
                  <li>Warszawa, Polska</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
              <p>© 2025 StudyPost. Wszelkie prawa zastrzeżone.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}
