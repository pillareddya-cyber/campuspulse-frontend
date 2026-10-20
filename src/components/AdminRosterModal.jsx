import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  UploadCloud, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  ShieldCheck,
  Building,
  Key,
  Database
} from 'lucide-react';

export default function AdminRosterModal() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      const [statsData, usersData] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSampleLoad = () => {
    const sample = `Name,Email,RollNumber,Department\n` +
      `Divya Sharma,24eg105a71@anurag.edu.in,24EG105A71,Information Technology\n` +
      `Karthik Varma,24eg105a82@anurag.edu.in,24EG105A82,Computer Science\n` +
      `Meera Nair,24eg105a93@anurag.edu.in,24EG105A93,Electronics & Communication\n` +
      `Sai Teja,24eg105a99@anurag.edu.in,24EG105A99,Mechanical Engineering`;
    setCsvText(sample);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!csvText.trim()) {
      setError('Please provide CSV data or click "Load Sample College Students".');
      return;
    }

    setImporting(true);
    setError(null);
    setImportResult(null);

    try {
      // Parse CSV
      const lines = csvText.trim().split('\n');
      const students = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || (i === 0 && line.toLowerCase().includes('email'))) continue; // skip header

        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          students.push({
            name: parts[0],
            email: parts[1],
            rollNumber: parts[2] || '',
            department: parts[3] || 'General'
          });
        }
      }

      if (students.length === 0) {
        throw new Error('No valid student entries found in CSV. Format: Name,Email,RollNumber,Department');
      }

      const res = await api.post('/admin/roster', {
        students,
        defaultPassword: 'student123'
      });

      setImportResult(res);
      setCsvText('');
      await fetchAdminData();
    } catch (err) {
      setError(err.message || 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-amber-800/40 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-indigo-950/40">
        <div className="flex items-center space-x-3.5">
          <div className="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-900/20">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              University Student Roster Provisioning
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure college-only account import. Pre-approve verified Anurag University emails and assign initial credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
            <div className="text-2xl font-black text-indigo-400">{stats.totalStudents}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">Enrolled Students</div>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
            <div className="text-2xl font-black text-purple-400">{stats.totalCoordinators}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">Coordinators</div>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
            <div className="text-2xl font-black text-amber-400">{stats.pendingApplications}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">Pending Auditions</div>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
            <div className="text-2xl font-black text-emerald-400">{stats.approvedMembers}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">Active Club Members</div>
          </div>
        </div>
      )}

      {/* CSV Roster Importer Box */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Bulk Student Import (CSV)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste CSV with format: <code className="text-indigo-300">Name,Email,RollNumber,Department</code>
            </p>
          </div>

          <button
            type="button"
            onClick={handleSampleLoad}
            className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 text-xs font-semibold border border-indigo-700/50 transition self-start sm:self-auto"
          >
            + Load Sample College Students
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {importResult && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs space-y-1">
            <div className="font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>{importResult.message}</span>
            </div>
            <p className="text-slate-400">
              Default password for newly imported students: <code className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded">student123</code> (Hashed securely with BCrypt).
            </p>
          </div>
        )}

        <form onSubmit={handleImport} className="space-y-3">
          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Name,Email,RollNumber,Department&#10;Sneha Reddy,24eg105a88@anurag.edu.in,24EG105A88,Computer Science"
            className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Duplicate emails are automatically skipped without overwriting existing data.
            </div>

            <button
              type="submit"
              disabled={importing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold transition shadow-lg shadow-emerald-700/30 flex items-center space-x-2"
            >
              <UploadCloud className="h-4 w-4" />
              <span>{importing ? 'Processing Roster...' : 'Import Approved Students'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Registered Users Roster Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800/90 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Users className="h-4 w-4 text-indigo-400" />
            <span>Approved University Accounts ({users.length})</span>
          </h3>
          <span className="text-[11px] text-slate-500">BCrypt Encrypted Credentials</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Student / Member Name</th>
                <th className="py-2.5 px-3">College Email</th>
                <th className="py-2.5 px-3">Roll Number</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-white">{u.name}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{u.email}</td>
                  <td className="py-2.5 px-3 text-slate-300">{u.roll_number || '—'}</td>
                  <td className="py-2.5 px-3 text-slate-400">{u.department || 'General'}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'COORDINATOR'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : u.role === 'ADMIN'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
