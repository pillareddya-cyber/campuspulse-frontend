import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  AlertTriangle, 
  Plus, 
  X, 
  Megaphone,
  User,
  Clock
} from 'lucide-react';

export default function AnnouncementsFeed() {
  const { isCoordinator } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [clubId, setClubId] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await api.get('/announcements');
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/announcements', {
        title,
        content,
        clubId: clubId ? Number(clubId) : null,
        isUrgent
      });
      setShowModal(false);
      setTitle('');
      setContent('');
      setClubId('');
      setIsUrgent(false);
      await fetchAnnouncements();
    } catch (err) {
      alert('Failed to post announcement: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-indigo-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">University Announcements</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official broadcasts, audition deadlines, and university club notices.
          </p>
        </div>

        {isCoordinator && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            <Plus className="h-4 w-4" />
            <span>Post Broadcast</span>
          </button>
        )}
      </div>

      {/* Announcements Feed */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
          Loading announcements...
        </div>
      ) : announcements.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
          No announcements posted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`glass-card rounded-2xl p-5 border transition ${
                item.is_urgent
                  ? 'border-rose-700/60 bg-rose-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center space-x-2">
                  {item.is_urgent ? (
                    <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase animate-pulse">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Urgent Notice</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
                      Campus Update
                    </span>
                  )}
                  {item.club_name && (
                    <span className="text-xs font-semibold text-slate-400">
                      • {item.club_name}
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 flex items-center space-x-1 shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center space-x-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span>Authorized by: <strong className="text-slate-300">{item.author_name}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-3">Broadcast University Notice</h3>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Scope</label>
                <select
                  value={clubId}
                  onChange={(e) => setClubId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="">Campus-Wide (All Anurag University Students)</option>
                  <option value={1}>CodeCrafters Club Only</option>
                  <option value={2}>Specdam Club Only</option>
                  <option value={3}>Sports Arena Only</option>
                  <option value={4}>Click Cadets Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audition submission deadline extended"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed announcement content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="urgentCheck" className="text-xs text-rose-300 font-medium cursor-pointer">
                  Mark as URGENT (Highlights in red with notification alert)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
                >
                  {submitting ? 'Broadcasting...' : 'Broadcast Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
