import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ClubCard from '../components/ClubCard';
import JoinModal from '../components/JoinModal';
import CoordinatorHub from '../components/CoordinatorHub';
import LivePolls from '../components/LivePolls';
import EventsCalendar from '../components/EventsCalendar';
import AnnouncementsFeed from '../components/AnnouncementsFeed';
import HallOfFame from '../components/HallOfFame';
import AdminRosterModal from '../components/AdminRosterModal';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Award,
  Bell
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isCoordinator, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('clubs');
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [selectedClubForModal, setSelectedClubForModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [pendingAuditionsCount, setPendingAuditionsCount] = useState(0);

  const fetchClubs = async () => {
    try {
      setLoadingClubs(true);
      const data = await api.get('/clubs');
      setClubs(data);
    } catch (err) {
      console.error('Failed to load clubs:', err);
    } finally {
      setLoadingClubs(false);
    }
  };

  const fetchPendingAuditions = async () => {
    if (isCoordinator) {
      try {
        const apps = await api.get('/memberships/coordinator');
        const pending = apps.filter(a => a.status === 'PENDING').length;
        setPendingAuditionsCount(pending);
      } catch (e) {}
    }
  };

  useEffect(() => {
    fetchClubs();
    fetchPendingAuditions();
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleApplySuccess = (msg) => {
    showToast(msg);
    fetchClubs();
    fetchPendingAuditions();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      
      {/* Top Navbar */}
      <Navbar onSelectTab={setActiveTab} activeTab={activeTab} />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel border border-emerald-500/50 bg-emerald-950/80 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white text-xs font-bold pl-2">✕</button>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Sidebar */}
          <Sidebar 
            activeTab={activeTab} 
            onSelectTab={setActiveTab} 
            pendingCount={pendingAuditionsCount}
          />

          {/* Dynamic Content Panel */}
          <main className="flex-1 w-full min-w-0">
            
            {/* TAB 1: CLUBS */}
            {activeTab === 'clubs' && (
              <div className="space-y-6">
                
                {/* Hero Banner */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 relative overflow-hidden">
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-3">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Anurag University Club Admissions 2026</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Find Your Creative & Technical Passion
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Join premier campus clubs, showcase your audition reels, code in national hackathons, and collaborate with student leaders across departments.
                    </p>
                  </div>
                </div>

                {/* Clubs Grid */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold text-white">Official University Clubs</h2>
                      <p className="text-xs text-slate-400">Apply with your talent notes and audition proofs</p>
                    </div>
                  </div>

                  {loadingClubs ? (
                    <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
                      Loading university clubs...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {clubs.map((club) => (
                        <ClubCard
                          key={club.id}
                          club={club}
                          onApply={(c) => setSelectedClubForModal(c)}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: COORDINATOR HUB */}
            {activeTab === 'coordinator' && (
              <CoordinatorHub 
                onActionCompleted={() => {
                  fetchClubs();
                  fetchPendingAuditions();
                  showToast('Application reviewed and club roster updated!');
                }}
              />
            )}

            {/* TAB 3: EVENTS & RSVPS */}
            {activeTab === 'events' && (
              <EventsCalendar />
            )}

            {/* TAB 4: LIVE POLLS */}
            {activeTab === 'polls' && (
              <LivePolls />
            )}

            {/* TAB 5: ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <AnnouncementsFeed />
            )}

            {/* TAB 6: HALL OF FAME */}
            {activeTab === 'fame' && (
              <HallOfFame />
            )}

            {/* TAB 7: ADMIN ROSTER IMPORTER */}
            {activeTab === 'admin' && (
              <AdminRosterModal />
            )}

          </main>

        </div>
      </div>

      {/* Talent Audition Submission Modal */}
      {selectedClubForModal && (
        <JoinModal
          club={selectedClubForModal}
          isOpen={!!selectedClubForModal}
          onClose={() => setSelectedClubForModal(null)}
          onSuccess={handleApplySuccess}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>CampusPulse</strong> • Designed for Anurag University Clubs & Student Governance
          </div>
          <div className="text-[11px] text-slate-600">
            Node.js Express REST API • SQLite Database • React Vite Tailwind
          </div>
        </div>
      </footer>

    </div>
  );
}
