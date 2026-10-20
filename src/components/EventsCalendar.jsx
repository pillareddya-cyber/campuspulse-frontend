import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Plus, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function EventsCalendar() {
  const { isCoordinator, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rsvpingId, setRsvpingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New event state
  const [clubId, setClubId] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [venue, setVenue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.get('/events');
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRsvpToggle = async (event) => {
    setRsvpingId(event.id);
    try {
      if (event.is_rsvped) {
        await api.delete(`/events/rsvp/${event.id}`);
      } else {
        await api.post(`/events/rsvp/${event.id}`);
      }
      await fetchEvents();
    } catch (err) {
      alert(err.message || 'Error updating RSVP');
    } finally {
      setRsvpingId(null);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/events', {
        clubId: Number(clubId),
        title,
        description,
        eventDate,
        eventTime,
        venue
      });
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setEventDate('');
      setEventTime('');
      setVenue('');
      await fetchEvents();
    } catch (err) {
      alert('Failed to publish event: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-indigo-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">University Events & RSVPs</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official club workshops, state hackathons, stage plays, and athletics meets across campus.
          </p>
        </div>

        {isCoordinator && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            <Plus className="h-4 w-4" />
            <span>Create Club Event</span>
          </button>
        )}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
          Loading upcoming university events...
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
          No upcoming events scheduled right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/40">
                    {ev.club_name}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Users className="h-3.5 w-3.5 text-slate-500" />
                    <span>{ev.rsvp_count} Attendees</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {ev.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {ev.description}
                </p>

                {/* Metadata Chips */}
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="text-slate-200 font-semibold">{ev.event_date}</span>
                    <span className="text-slate-500">•</span>
                    <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>{ev.event_time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>{ev.venue}</span>
                  </div>
                </div>
              </div>

              {/* RSVP Action */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                {ev.is_rsvped ? (
                  <button
                    onClick={() => handleRsvpToggle(ev)}
                    disabled={rsvpingId === ev.id}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/60 hover:bg-rose-950/40 text-emerald-300 hover:text-rose-300 border border-emerald-700/50 hover:border-rose-700/50 text-xs font-bold transition flex items-center justify-center space-x-2 group"
                  >
                    <CheckCircle2 className="h-4 w-4 group-hover:hidden" />
                    <span className="group-hover:hidden">RSVP Confirmed • You are attending</span>
                    <span className="hidden group-hover:inline">Click to Cancel RSVP</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRsvpToggle(ev)}
                    disabled={rsvpingId === ev.id}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2"
                  >
                    <span>{rsvpingId === ev.id ? 'Confirming...' : 'RSVP for Event'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-3">Publish University Event</h3>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Organizing Club</label>
                <select
                  value={clubId}
                  onChange={(e) => setClubId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value={1}>CodeCrafters</option>
                  <option value={2}>Specdam</option>
                  <option value={3}>Sports Arena</option>
                  <option value={4}>Click Cadets</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Prompt Engineering Boot Camp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Agenda, speakers, topics covered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 04:00 PM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Venue</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Auditorium B / Seminar Hall"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
                >
                  {submitting ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
