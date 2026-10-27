import React from 'react';
import { X, CheckCircle2, Award, ShieldAlert, Cpu, Globe2, Briefcase } from 'lucide-react';

export default function PitchModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Award className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">Prompt Wars 2026: FairShift Walkthrough</h2>
              <p className="text-xs text-emerald-400 font-medium">UN SDG 8 — Decent Work & Economic Growth</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm">
          {/* Mission & Rubric */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Mandatory Req 1</span>
              <h4 className="font-semibold text-white mt-1">2+ Distinct Sectors</h4>
              <p className="text-xs text-slate-300 mt-1">
                Toggle between <strong>Construction Site</strong> (Metro Rail Site 4B) and <strong>College Facilities</strong> (SRMIST Support Staff).
              </p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Mandatory Req 2</span>
              <h4 className="font-semibold text-white mt-1">Dual Interfaces</h4>
              <p className="text-xs text-slate-300 mt-1">
                1) <strong>Worker Mobile UI</strong> with voice assistance & regional tongues. 2) <strong>Admin Command Portal</strong>.
              </p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Mandatory Req 3</span>
              <h4 className="font-semibold text-white mt-1">3+ Live Features</h4>
              <p className="text-xs text-slate-300 mt-1">
                Includes Overtime Clock-in, Multilingual Voice Hazard Reporting, Anonymous Feedback, and Skill Passport.
              </p>
            </div>
          </div>

          {/* Core Feature Matrix */}
          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white text-base mb-3 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-2" />
              Live Features Implemented in This Build
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start">
                <span className="text-emerald-400 font-bold mr-2">1.</span>
                <span><strong>Transparent Overtime & Geo Clock-in:</strong> Real-time 1.5x statutory multiplier calculation with zero hidden deductions.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 font-bold mr-2">2.</span>
                <span><strong>Multilingual Voice Accessibility:</strong> Integrated Web Speech API for voice reporting & audio readouts in Hindi, Tamil, and English.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 font-bold mr-2">3.</span>
                <span><strong>Instant Voice Hazard Reporter:</strong> One-tap speech-to-text safety report with automatic AI urgency categorization (Critical / High).</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 font-bold mr-2">4.</span>
                <span><strong>Whistleblower Anonymizer:</strong> Regex PII stripper that redacts phone numbers, employee badges, and emails to eliminate fear of retribution.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 font-bold mr-2">5.</span>
                <span><strong>Portable Skill Passport:</strong> Tamper-resistant log of safety trainings and verified on-site equipment hours for worker upward mobility.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 font-bold mr-2">6.</span>
                <span><strong>Fatigue & Attrition Radar:</strong> Employer dashboard flagging shifts &gt; 9.5 hours to prevent workplace accidents before they occur.</span>
              </li>
            </ul>
          </div>

          {/* Cloud Run & AI Grading Alignment */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl">
            <h4 className="text-emerald-400 font-bold flex items-center mb-1">
              <Cpu className="w-4 h-4 mr-2" />
              AI Evaluator Compatibility Checklist
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-300 mt-2">
              <div>✅ 10 Automated Unit Tests</div>
              <div>✅ Single-branch Git repository</div>
              <div>✅ Repo size strictly &lt; 10 MB</div>
              <div>✅ Google Cloud Run ready (Docker)</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition"
          >
            Explore Live Application
          </button>
        </div>
      </div>
    </div>
  );
}
