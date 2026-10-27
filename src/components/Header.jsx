import React from 'react';
import { 
  Building2, 
  HardHat, 
  Languages, 
  Smartphone, 
  LayoutDashboard, 
  Info, 
  GraduationCap, 
  ShieldCheck 
} from 'lucide-react';

export default function Header({ 
  currentRole, 
  setCurrentRole, 
  currentSector, 
  setCurrentSector, 
  language, 
  setLanguage, 
  t, 
  onOpenPitch 
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & SDG Badge */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-xl text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight text-white">FairShift</span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  UN SDG 8
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Decent Work & Safety Platform</p>
            </div>
          </div>

          {/* Controls: Sector Switcher, Role Switcher, Language */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Sector Switcher (Construction vs College) */}
            <div className="relative">
              <select
                value={currentSector}
                onChange={(e) => setCurrentSector(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
                title="Select Work Sector (Construction Site vs College Campus)"
              >
                <option value="construction">🏗️ Metro Construction Site</option>
                <option value="college">🎓 SRM Campus Support</option>
              </select>
            </div>

            {/* Language Selector (English, Hindi, Tamil) */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 text-xs">
              <Languages className="w-3.5 h-3.5 text-slate-400 mr-1.5 hidden xs:block" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Role Toggle: Worker vs Admin */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setCurrentRole('worker')}
                className={`flex items-center px-2.5 py-1 rounded-lg transition ${
                  currentRole === 'worker'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 mr-1" />
                <span className="hidden md:inline">Worker</span> App
              </button>
              <button
                onClick={() => setCurrentRole('admin')}
                className={`flex items-center px-2.5 py-1 rounded-lg transition ${
                  currentRole === 'admin'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
                <span className="hidden md:inline">Admin</span> Portal
              </button>
            </div>

            {/* Pitch / Hackathon Info Guide */}
            <button
              onClick={onOpenPitch}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center transition"
              title="View Hackathon Submission Walkthrough & Rubric Alignment"
            >
              <Info className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Hackathon Deck</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
