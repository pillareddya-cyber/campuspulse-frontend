import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  Sparkles,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify college credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#070b14]">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* University Crest & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-indigo-600/30 items-center justify-center mb-1">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-indigo-400" />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center space-x-2">
            <span>CampusPulse</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-widest font-bold">
              AU
            </span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Anurag University Club & Audition Ecosystem. Access is strictly limited to verified university accounts.
          </p>
        </div>

        {/* Login Glass Card */}
        <div className="glass-card rounded-3xl p-7 border border-slate-800 shadow-2xl space-y-5">
          
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 pb-2 border-b border-slate-800">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>College-Only Verification Required</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* College Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                University Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. 24eg105a36@anurag.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Account Password</span>
                <span className="text-[10px] text-slate-500 font-mono">BCrypt Protected</span>
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to CampusPulse</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>One-Click Test Accounts</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('24eg105a61@anurag.edu.in', 'password123')}
                className="w-full p-2.5 rounded-xl bg-purple-950/30 hover:bg-purple-900/50 border border-purple-800/40 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-purple-200">Pillareddy Akshitha (Coordinator)</div>
                  <div className="text-[10px] text-purple-400">Coordinates CodeCrafters & Specdam</div>
                </div>
                <span className="text-[10px] font-semibold text-purple-300 px-2 py-0.5 rounded bg-purple-900/50">
                  Fill Credentials
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('24eg105a36@anurag.edu.in', 'student123')}
                className="w-full p-2.5 rounded-xl bg-indigo-950/30 hover:bg-indigo-900/50 border border-indigo-800/40 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-indigo-200">Rahul Reddy (Student)</div>
                  <div className="text-[10px] text-indigo-400">Roll No: 24EG105A36 (Applicant)</div>
                </div>
                <span className="text-[10px] font-semibold text-indigo-300 px-2 py-0.5 rounded bg-indigo-900/50">
                  Fill Credentials
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('admin@anurag.edu.in', 'admin123')}
                className="w-full p-2.5 rounded-xl bg-amber-950/30 hover:bg-amber-900/50 border border-amber-800/40 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-amber-200">University Dean (Admin)</div>
                  <div className="text-[10px] text-amber-400">Student Roster Provisioning</div>
                </div>
                <span className="text-[10px] font-semibold text-amber-300 px-2 py-0.5 rounded bg-amber-900/50">
                  Fill Credentials
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-500">
          CampusPulse • Anurag University Student Clubs & Auditions System
        </p>

      </div>
    </div>
  );
}
