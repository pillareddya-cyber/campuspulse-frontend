import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  ShieldCheck, 
  Calendar, 
  BarChart3, 
  Bell, 
  Award, 
  UploadCloud,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, pendingCount = 0 }) {
  const { isCoordinator, isAdmin } = useAuth();

  const navItems = [
    {
      id: 'clubs',
      label: 'University Clubs',
      icon: Compass,
      description: 'Explore & audition for clubs'
    },
    ...(isCoordinator ? [{
      id: 'coordinator',
      label: 'Coordinator Hub',
      icon: ShieldCheck,
      badge: pendingCount > 0 ? pendingCount : null,
      highlight: true,
      description: 'Review audition proofs & approve'
    }] : []),
    {
      id: 'events',
      label: 'Events & RSVPs',
      icon: Calendar,
      description: 'Workshops, hackathons & sports'
    },
    {
      id: 'polls',
      label: 'Live Campus Polls',
      icon: BarChart3,
      description: 'Real-time student voting'
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Bell,
      description: 'Official university broadcasts'
    },
    {
      id: 'fame',
      label: 'Hall of Fame',
      icon: Award,
      description: 'Student trophies & victories'
    },
    ...(isAdmin ? [{
      id: 'admin',
      label: 'Roster Importer',
      icon: UploadCloud,
      description: 'Bulk CSV student provisioning'
    }] : [])
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="glass-card rounded-2xl p-3 border border-slate-800/80 sticky top-20 shadow-xl shadow-black/20">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Campus Navigation
        </div>

        <nav className="space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                    : item.highlight
                    ? 'bg-purple-950/30 text-purple-200 hover:bg-purple-900/40 border border-purple-800/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className={`p-1.5 rounded-lg ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : item.highlight
                      ? 'bg-purple-800/40 text-purple-300'
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-950/40'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold leading-tight truncate">
                      {item.label}
                    </div>
                    <div className={`text-[10px] leading-tight truncate ${
                      isActive ? 'text-indigo-100' : 'text-slate-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Audition Status Banner for Students */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 px-2">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Audition Note:</span>
              <p className="mt-0.5 leading-snug">
                Applications require coordinator verification. Attach your talent notes and media links when joining.
              </p>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
