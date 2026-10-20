import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  X, 
  Sparkles, 
  Upload, 
  Link as LinkIcon, 
  Film, 
  Music, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function JoinModal({ club, isOpen, onClose, onSuccess }) {
  const [talentCategory, setTalentCategory] = useState('Coding');
  const [talentNote, setTalentNote] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !club) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds the 50MB limit.');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      let uploadedFileUrl = null;
      let mediaType = 'link';

      // If user uploaded a physical file, upload to /api/uploads first
      if (selectedFile) {
        const formData = new FormData();
        formData.append('mediaFile', selectedFile);

        const uploadRes = await api.upload('/uploads', formData);
        uploadedFileUrl = uploadRes.fileUrl;
        mediaType = uploadRes.mediaType;
      } else if (portfolioLink) {
        mediaType = 'link';
      }

      // Submit application
      await api.post(`/memberships/apply/${club.id}`, {
        talentCategory,
        talentNote,
        mediaProofUrl: uploadedFileUrl,
        mediaType,
        portfolioLink: portfolioLink.trim() || null
      });

      onSuccess(`Your audition for ${club.name} was submitted! Coordinator ${club.coordinatorName} will review it.`);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">
              Join {club.name}
            </h2>
            <p className="text-xs text-slate-400">
              Submit your talent background & audition proofs to Coordinator <span className="text-indigo-300 font-semibold">{club.coordinatorName}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Talent Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Primary Talent & Specialization
            </label>
            <select
              value={talentCategory}
              onChange={(e) => setTalentCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="Coding">Coding, Web & Software Development</option>
              <option value="Music">Vocal Singing & Musical Instruments</option>
              <option value="Dance">Dance & Choreography</option>
              <option value="Drama">Theater, Acting & Scriptwriting</option>
              <option value="Photography">Photography & Cinematography</option>
              <option value="Design">UI/UX, Graphic Design & Digital Art</option>
              <option value="Sports">Athletics & Competitive Sports</option>
              <option value="Other">Other Creative / Technical Talent</option>
            </select>
          </div>

          {/* Talent Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Audition Notes & Experience (Optional but recommended)
            </label>
            <textarea
              rows={3}
              value={talentNote}
              onChange={(e) => setTalentNote(e.target.value)}
              placeholder="e.g. 4 years classical vocal training; 1st prize at state fest; built college portal in React..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Media Proof File Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Audition Proof File (Video, Audio, Image, or Certificate)</span>
              <span className="text-[10px] text-slate-500">Max 50MB</span>
            </label>
            
            <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-xl p-4 text-center cursor-pointer transition bg-slate-900/50">
              <input
                type="file"
                onChange={handleFileChange}
                accept="video/*,audio/*,image/*,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Film className="h-4 w-4" />
                  <Music className="h-4 w-4" />
                  <FileText className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-slate-300">
                  {selectedFile ? (
                    <span className="text-indigo-400 font-semibold">{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  ) : (
                    <span>Click to browse audition video, singing MP3, photo, or PDF certificate</span>
                  )}
                </p>
                <p className="text-[10px] text-slate-500">MP4, MOV, MP3, WAV, JPG, PNG, PDF</p>
              </div>
            </div>
          </div>

          {/* External Portfolio URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
              <span>External Portfolio Link (Optional)</span>
            </label>
            <input
              type="url"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://github.com/your-username or Google Drive / YouTube link"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Audition...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Submit Audition Application</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
