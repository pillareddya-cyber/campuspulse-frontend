import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Play, 
  FileText, 
  ExternalLink, 
  UserCheck, 
  Clock, 
  Search,
  Filter,
  Volume2,
  Video,
  Award,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function CoordinatorHub({ onActionCompleted }) {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING'); // PENDING, APPROVED, REJECTED, ALL
  const [search, setSearch] = useState('');
  const [reviewingId, setReviewingId] = useState(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState(null); // { url, type, title }

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await api.get('/memberships/coordinator');
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (membershipId, status) => {
    setSubmitting(true);
    try {
      await api.post(`/memberships/review/${membershipId}`, {
        status,
        feedback: feedbackNote.trim() || undefined
      });
      setReviewingId(null);
      setFeedbackNote('');
      await fetchApplications();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      alert('Error reviewing application: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesFilter = filter === 'ALL' || app.status === filter;
    const matchesSearch = 
      app.student_name.toLowerCase().includes(search.toLowerCase()) ||
      app.student_email.toLowerCase().includes(search.toLowerCase()) ||
      (app.student_roll && app.student_roll.toLowerCase().includes(search.toLowerCase())) ||
      app.club_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = applications.filter(a => a.status === 'PENDING').length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-purple-800/40 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="h-12 w-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-900/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Coordinator Audition Hub
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
                  Verified Coordinator
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Review applicant talent submissions, watch audition reels, listen to audio files, and approve club rosters.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-lg font-extrabold text-amber-400 leading-none">{pendingCount}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase mt-1">Pending</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-lg font-extrabold text-emerald-400 leading-none">{approvedCount}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase mt-1">Approved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 w-full sm:w-auto">
          {[
            { id: 'PENDING', label: `Pending (${pendingCount})` },
            { id: 'APPROVED', label: `Approved (${approvedCount})` },
            { id: 'REJECTED', label: 'Declined' },
            { id: 'ALL', label: 'All Submissions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search student or club..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
          Loading applicant auditions...
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
          <ShieldCheck className="h-10 w-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-300">No applications in this category</h3>
          <p className="text-xs text-slate-500 mt-1">
            {filter === 'PENDING' ? 'All student talent auditions have been reviewed!' : 'No records found matching filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="glass-card rounded-2xl p-5 border border-slate-800/90 hover:border-slate-700 transition space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                
                {/* Student Info */}
                <div className="flex items-start space-x-3.5">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow shrink-0">
                    {app.student_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white">{app.student_name}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                        {app.student_roll || '24EG105Axx'}
                      </span>
                      <span className="text-slate-500 text-xs">• {app.student_dept || 'Engineering'}</span>
                    </div>
                    <div className="text-xs text-slate-400">{app.student_email}</div>
                    
                    <div className="mt-1 flex items-center space-x-2 text-[11px]">
                      <span className="text-slate-500">Applying for:</span>
                      <span className="font-bold text-indigo-400">{app.club_name}</span>
                      <span className="text-slate-600">•</span>
                      <span className="px-2 py-0.2 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 font-semibold text-[10px]">
                        {app.talent_category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {app.status === 'APPROVED' ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approved Member</span>
                    </span>
                  ) : app.status === 'PENDING' ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold animate-pulse">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Action Required</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Declined</span>
                    </span>
                  )}
                </div>

              </div>

              {/* Talent Notes & Experience */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
                <div className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>Applicant Talent & Audition Note</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">
                  {app.talent_note || 'No additional note supplied.'}
                </p>
              </div>

              {/* Audition Media Studio Preview (Video, Audio, Docs) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                
                {/* Physical Uploaded Media */}
                {app.media_proof_url && (
                  <>
                    {app.media_type === 'video' && (
                      <button
                        onClick={() => setActiveMediaModal({ url: app.media_proof_url, type: 'video', title: `${app.student_name}'s Video Audition Reel` })}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 text-xs font-semibold transition"
                      >
                        <Video className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Play Video Audition</span>
                      </button>
                    )}

                    {app.media_type === 'audio' && (
                      <button
                        onClick={() => setActiveMediaModal({ url: app.media_proof_url, type: 'audio', title: `${app.student_name}'s Audio Vocal Audition` })}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-700/50 text-xs font-semibold transition"
                      >
                        <Volume2 className="h-3.5 w-3.5 text-purple-400" />
                        <span>Play Audio Clip</span>
                      </button>
                    )}

                    {app.media_type === 'image' && (
                      <a
                        href={app.media_proof_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                      >
                        <Play className="h-3.5 w-3.5 text-emerald-400" />
                        <span>View Art / Photo Proof</span>
                      </a>
                    )}

                    {app.media_type === 'document' && (
                      <a
                        href={app.media_proof_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                      >
                        <FileText className="h-3.5 w-3.5 text-amber-400" />
                        <span>View PDF Certificate</span>
                      </a>
                    )}
                  </>
                )}

                {/* External Portfolio Link */}
                {app.portfolio_link && (
                  <a
                    href={app.portfolio_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition"
                  >
                    <span>External Portfolio</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                )}

                {!app.media_proof_url && !app.portfolio_link && (
                  <span className="text-[11px] text-slate-500 italic">No media attachments provided</span>
                )}
              </div>

              {/* Feedback already given */}
              {app.coordinator_feedback && (
                <div className="text-[11px] text-slate-400 border-l-2 border-indigo-500 pl-2 mt-2">
                  <span className="font-semibold text-slate-300">Previous Note:</span> {app.coordinator_feedback}
                </div>
              )}

              {/* Evaluation Action Buttons for Coordinator */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[10px] text-slate-500">
                  Applied: {new Date(app.applied_at).toLocaleString()}
                </div>

                <div className="flex items-center space-x-2">
                  {reviewingId === app.id ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Add feedback/welcome note..."
                        value={feedbackNote}
                        onChange={(e) => setFeedbackNote(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReview(app.id, 'APPROVED')}
                          disabled={submitting}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                        >
                          Confirm Approve
                        </button>
                        <button
                          onClick={() => handleReview(app.id, 'REJECTED')}
                          disabled={submitting}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow"
                        >
                          Confirm Decline
                        </button>
                        <button
                          onClick={() => { setReviewingId(null); setFeedbackNote(''); }}
                          className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {app.status !== 'APPROVED' && (
                        <button
                          onClick={() => { setReviewingId(app.id); setFeedbackNote(''); }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                      )}
                      {app.status !== 'REJECTED' && (
                        <button
                          onClick={() => { setReviewingId(app.id); setFeedbackNote(''); }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Decline</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* In-Browser Audition Media Player Modal */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Play className="h-4 w-4 text-indigo-400" />
                <span>{activeMediaModal.title}</span>
              </h3>
              <button
                onClick={() => setActiveMediaModal(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg bg-slate-800"
              >
                Close Player ✕
              </button>
            </div>

            <div className="bg-black rounded-xl overflow-hidden p-2 flex items-center justify-center min-h-[240px]">
              {activeMediaModal.type === 'video' ? (
                <video
                  src={activeMediaModal.url}
                  controls
                  autoPlay
                  className="max-h-[60vh] w-full rounded-lg"
                >
                  Your browser does not support HTML5 video playback.
                </video>
              ) : (
                <div className="w-full p-6 text-center">
                  <Volume2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-bounce" />
                  <audio
                    src={activeMediaModal.url}
                    controls
                    autoPlay
                    className="w-full"
                  >
                    Your browser does not support HTML5 audio playback.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
