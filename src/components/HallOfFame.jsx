import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Award, 
  Trophy, 
  Star, 
  Medal, 
  Sparkles,
  Calendar,
  UserCheck
} from 'lucide-react';

export default function HallOfFame() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        setLoading(true);
        const data = await api.get('/achievements');
        setAchievements(data);
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAchievements();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-amber-800/40 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-purple-950/40">
        <div className="flex items-center space-x-3.5">
          <div className="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-900/20">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Student Hall of Fame & Achievements
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Celebrating Anurag University student victories in national hackathons, cultural festivals, and varsity championships.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
          Loading student achievements...
        </div>
      ) : achievements.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
          No achievements recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.badge_icon === 'Medal' ? (
                      <Medal className="h-5 w-5" />
                    ) : item.badge_icon === 'Star' ? (
                      <Star className="h-5 w-5" />
                    ) : (
                      <Trophy className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    {item.club_name}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5 leading-snug group-hover:text-amber-300 transition">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-semibold text-slate-200">{item.student_name}</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{item.achievement_date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
