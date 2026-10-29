import { lazy, Suspense } from 'react';
import { CoffeeDemo } from '@coffee-bot/pages/demo';

const CoffeePage = lazy(() => import('@coffee-bot/pages/ai').then((module) => ({ default: module.CoffeePage })));

function App() {
  const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  const localAI = localHost && new URLSearchParams(window.location.search).get('mode') === 'ai';
  return localAI ? (
    <>
      <aside className='coffee-demo__notice'>Lokal AI-version · Kräver Ollama. Beställningar bekräftas endast lokalt. <a href={window.location.pathname}>Till visningsdemon</a></aside>
      <Suspense fallback={<p role='status'>Laddar AI-versionen...</p>}><CoffeePage /></Suspense>
    </>
  ) : <CoffeeDemo />;
}

export default App;
