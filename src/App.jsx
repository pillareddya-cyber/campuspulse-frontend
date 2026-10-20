import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { GraduationCap, Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center animate-pulse">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          <span>Connecting to CampusPulse...</span>
        </div>
      </div>
    );
  }

  return user ? <DashboardPage /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
