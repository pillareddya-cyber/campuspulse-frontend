import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  X, 
  Loader2,
  Users
} from 'lucide-react';

export default function LivePolls() {
  const { isCoordinator, user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingPollId, setVotingPollId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New poll form
  const [newQuestion, setNewQuestion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '']);
  const [submittingPoll, setSubmittingPoll] = useState(false);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await api.get('/polls');
      setPolls(data);
    } catch (err) {
      console.error('Failed to load polls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionId) => {
    setVotingPollId(pollId);
    try {
      await api.post(`/polls/vote/${pollId}`, { optionId });
      await fetchPolls();
    } catch (err) {
      alert(err.message || 'Failed to submit vote');
    } finally {
      setVotingPollId(null);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const validOptions = newOptions.filter(o => o.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 poll options.');
      return;
    }

    setSubmittingPoll(true);
    try {
      await api.post('/polls', {
        question: newQuestion,
        description: newDescription,
        options: validOptions
      });
      setShowCreateModal(false);
      setNewQuestion('');
      setNewDescription('');
      setNewOptions(['', '', '']);
      await fetchPolls();
    } catch (err) {
      alert('Failed to publish poll: ' + err.message);
    } finally {
      setSubmittingPoll(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-indigo-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Live Campus Polls</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time student democracy. Vote on university hackathon topics, cultural themes, and club initiatives.
          </p>
        </div>

        {isCoordinator && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            <Plus className="h-4 w-4" />
            <span>Launch Campus Poll</span>
          </button>
        )}
      </div>

      {/* Polls List */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
          Loading live polls...
        </div>
      ) : polls.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
          No active polls currently available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map((poll) => (
            <div
              key={poll.id}
              className="glass-card rounded-2xl p-5 border border-slate-800/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="font-semibold text-indigo-400 uppercase tracking-wider">
                    Posted by {poll.createdBy}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{poll.totalVotes} student votes</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5">
                  {poll.question}
                </h3>
                {poll.description && (
                  <p className="text-xs text-slate-400 mb-4">{poll.description}</p>
                )}

                {/* Options List */}
                <div className="space-y-2.5 my-3">
                  {poll.options.map((opt) => {
                    const isSelected = poll.userVotedOptionId === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => !poll.hasVoted && handleVote(poll.id, opt.id)}
                        className={`relative overflow-hidden rounded-xl p-3 border transition cursor-pointer ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-950/40 text-white'
                            : poll.hasVoted
                            ? 'border-slate-800 bg-slate-900/60 text-slate-300 cursor-default'
                            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        {/* Progress Bar background if voted */}
                        {poll.hasVoted && (
                          <div
                            className={`absolute left-0 top-0 bottom-0 opacity-20 transition-all duration-500 ${
                              isSelected ? 'bg-indigo-500' : 'bg-slate-500'
                            }`}
                            style={{ width: `${opt.percentage}%` }}
                          />
                        )}

                        <div className="relative flex items-center justify-between z-10">
                          <div className="flex items-center space-x-2.5">
                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-indigo-400 bg-indigo-600'
                                : 'border-slate-600 bg-slate-800'
                            }`}>
                              {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-medium leading-snug">{opt.text}</span>
                          </div>

                          {poll.hasVoted && (
                            <span className="text-xs font-bold text-slate-300 ml-2">
                              {opt.percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                {poll.hasVoted ? (
                  <span className="text-emerald-400 flex items-center space-x-1 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Your vote has been counted</span>
                  </span>
                ) : (
                  <span className="text-indigo-400">Click any option to cast your vote</span>
                )}
                <span className="text-slate-500">Active</span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create Poll Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-3">Launch New Campus Poll</h3>

            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Poll Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Which technology stack for the next club hackathon?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Brief context for voters..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Poll Options</label>
                {newOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    required={idx < 2}
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newOptions];
                      updated[idx] = e.target.value;
                      setNewOptions(updated);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                ))}
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
                  disabled={submittingPoll}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
                >
                  {submittingPoll ? 'Publishing...' : 'Publish Poll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
