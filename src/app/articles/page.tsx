import { Suspense } from 'react';
import ArticlesClient from './ArticlesClient';

// A simple loading component to show as a fallback
function ArticlesLoading() {
  return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Artykuły</h1>
          {/* You can add skeleton loaders for the buttons and search bar here */}
        </div>
        <p className="text-gray-400">Ładowanie artykułów...</p>
      </div>
  );
}

export default function ArticlesPage() {
  return (
      <Suspense fallback={<ArticlesLoading />}>
        <ArticlesClient />
      </Suspense>
  );
}