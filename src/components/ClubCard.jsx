import React from 'react';
import { 
  Users, 
  Calendar, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Code,
  Palette,
  Trophy,
  Camera
} from 'lucide-react';

const iconMap = {
  Code: Code,
  Palette: Palette,
  Trophy: Trophy,
  Camera: Camera
};

export default function ClubCard({ club, onApply, onViewDetails }) {
  const IconComponent = iconMap[club.iconName] || Sparkles;

  const getStatusBadge = () => {
    if (club.membershipStatus === 'APPROVED') {
      return (
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Joined & Active</span>
        </div>
      );
    }
    if (club.membershipStatus === 'PENDING') {
      return (
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold animate-pulse">
          <Clock className="h-3.5 w-3.5" />
          <span>Audition Under Review</span>
        </div>
      );
    }
    if (club.membershipStatus === 'REJECTED') {
      return (
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Audition Declined</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:shadow-indigo-500/10">
      
      {/* Club Banner Header */}
      <div>
        <div className={`h-28 bg-gradient-to-r ${club.bannerColor || 'from-indigo-600 to-purple-700'} p-4 relative flex items-start justify-between`}>
          <div className="h-12 w-12 rounded-xl bg-slate-950/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md">
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          
          <div className="bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center space-x-1 text-white text-xs font-semibold">
            <Users className="h-3.5 w-3.5 opacity-80" />
            <span>{club.memberCount} members</span>
          </div>
        </div>

        {/* Club Details */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              {club.category}
            </span>
            {getStatusBadge()}
          </div>

          <h3 className="text-lg font-bold text-white mt-1 group-hover:text-indigo-300 transition">
            {club.name}
          </h3>

          <p className="text-xs font-medium text-slate-400 italic mt-0.5">
            "{club.tagline}"
          </p>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
            {club.description}
          </p>

          {/* Feedback note if rejected */}
          {club.membershipStatus === 'REJECTED' && club.coordinatorFeedback && (
            <div className="mt-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-[11px] text-rose-300">
              <span className="font-semibold">Coordinator Feedback:</span> {club.coordinatorFeedback}
            </div>
          )}

          {/* Coordinator & Meeting schedule */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Coordinator: <span className="text-slate-200 font-semibold">{club.coordinatorName}</span>
              </span>
            </div>
            {club.meetingSchedule && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-300">{club.meetingSchedule}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0">
        {club.membershipStatus === 'APPROVED' ? (
          <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/40 text-emerald-300 text-xs font-semibold text-center border border-emerald-800/40 flex items-center justify-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>You are a verified member</span>
          </div>
        ) : club.membershipStatus === 'PENDING' ? (
          <div className="w-full py-2.5 px-4 rounded-xl bg-amber-950/40 text-amber-300 text-xs font-semibold text-center border border-amber-800/40 flex items-center justify-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Audition Pending Review</span>
          </div>
        ) : (
          <button
            onClick={() => onApply(club)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold text-center transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2 group/btn"
          >
            <span>{club.membershipStatus === 'REJECTED' ? 'Re-apply with New Audition' : 'Join Club & Submit Audition'}</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

    </div>
  );
}
