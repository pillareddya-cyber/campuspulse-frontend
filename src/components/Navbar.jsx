import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  GraduationCap, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  Activity,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ onSelectTab, activeTab }) {
  const { user, logout, login } = useAuth();
  const [backendStatus, setBackendStatus] = useState('checking');
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        await api.get('/health');
        if (isMounted) setBackendStatus('online');
      } catch (e) {
        if (isMounted) setBackendStatus('offline');
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleQuickSwitch = async (email, password) => {
    try {
      await login(email, password);
      setShowDemoMenu(false);
    } catch (err) {
      alert('Quick switch failed: ' + err.message);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & University Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('clubs')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  CampusPulse
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AU
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 -mt-0.5">
                Anurag University Club Ecosystem
              </p>
            </div>
          </div>

          {/* Right Header Navigation & Profile */}
          <div className="flex items-center space-x-3">
            
            {/* Backend Health Indicator */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium">
              <span className={`h-2 w-2 rounded-full ${
                backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`} />
              <span className="text-slate-400 text-[11px]">
                {backendStatus === 'online' ? 'API Online' : 'API Connecting...'}
              </span>
            </div>

            {/* Demo Quick Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 text-xs font-semibold border border-indigo-700/30 transition-all duration-150"
                title="Switch demo account to test different roles"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Role Switcher</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-72 glass-panel rounded-xl shadow-2xl p-2 z-50 border border-slate-700/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 border-b border-slate-800">
                    Switch Test Account
                  </div>
                  
                  <button
                    onClick={() => handleQuickSwitch('24eg105a61@anurag.edu.in', 'password123')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 transition flex items-start space-x-2 mt-1"
                  >
                    <ShieldCheck className="h-4 w-4 text-purple-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-100">Pillareddy Akshitha</div>
                      <div className="text-[11px] text-purple-400 font-medium">Club Coordinator (CodeCrafters & Specdam)</div>
                      <div className="text-[10px] text-slate-500">24eg105a61@anurag.edu.in</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickSwitch('24eg105a36@anurag.edu.in', 'student123')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 transition flex items-start space-x-2"
                  >
                    <UserCheck className="h-4 w-4 text-indigo-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-100">Rahul Reddy</div>
                      <div className="text-[11px] text-indigo-400 font-medium">Student (Applicant)</div>
                      <div className="text-[10px] text-slate-500">24eg105a36@anurag.edu.in</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickSwitch('admin@anurag.edu.in', 'admin123')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 transition flex items-start space-x-2"
                  >
                    <Activity className="h-4 w-4 text-amber-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-100">Campus Dean / Admin</div>
                      <div className="text-[11px] text-amber-400 font-medium">University Admin (Roster Importer)</div>
                      <div className="text-[10px] text-slate-500">admin@anurag.edu.in</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Logged in User Profile Chip */}
            {user && (
              <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-none">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                    <span className={`px-1.5 py-0.2 rounded font-semibold text-[9px] uppercase ${
                      user.role === 'COORDINATOR' 
                        ? 'bg-purple-900/60 text-purple-300 border border-purple-700/40' 
                        : user.role === 'ADMIN'
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-700/40'
                        : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/40'
                    }`}>
                      {user.role}
                    </span>
                    {user.rollNumber && <span className="text-slate-500">• {user.rollNumber}</span>}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Sign out of CampusPulse"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
