import { useEffect, useState } from 'react';
import AppRouter from './routes/AppRouter';
import { useAuthStore } from './store/authStore';

function App() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const refreshSession = useAuthStore((state) => state.refreshSession);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      setCheckingSession(false);
      return;
    }

    refreshSession().finally(() => setCheckingSession(false));
  }, [hasHydrated, token, refreshSession]);

  if (!hasHydrated || checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-slate-500">Loading Smart Retail POS...</p>
        </div>
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
