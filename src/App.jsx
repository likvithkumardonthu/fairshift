import React, { useState } from 'react';
import Header from './components/Header.jsx';
import WorkerApp from './components/WorkerApp.jsx';
import AdminPortal from './components/AdminPortal.jsx';
import PitchModal from './components/PitchModal.jsx';
import { translations } from './translations.js';
import { initialSectors, initialWorkers } from '../server/mockData.js';
import { calculatePay, detectFatigueRisk, assessHazardPriority, anonymizeFeedback } from './utils/calculations.js';
import { Smartphone, LayoutDashboard, Award, Sparkles } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState('worker'); // 'worker' | 'admin'
  const [currentSector, setCurrentSector] = useState('construction'); // 'construction' | 'college'
  const [language, setLanguage] = useState('en'); // 'en' | 'hi' | 'ta'
  const [isPitchOpen, setIsPitchOpen] = useState(false);

  // Sectors & workers state
  const [sectorsData, setSectorsData] = useState(initialSectors);
  const [workersData, setWorkersData] = useState(() => {
    return initialWorkers.map(w => ({
      ...w,
      payDetails: calculatePay(w.currentShift.hoursWorked, w.baseHourlyRate),
      fatigueRisk: detectFatigueRisk({
        hoursWorked: w.currentShift.hoursWorked,
        consecutiveDays: w.consecutiveDays,
        isNightShift: w.isNightShift
      })
    }));
  });

  const t = translations[language] || translations.en;

  // Add hazard in real time (visible instantly across both Worker & Admin portals)
  const handleAddHazard = ({ category, description, sectorId }) => {
    const severity = assessHazardPriority(category, description);
    const newHazard = {
      id: `HAZ-${Date.now().toString().slice(-4)}`,
      category,
      description: description.trim(),
      severity,
      status: 'INVESTIGATING',
      reportedAt: 'Just now',
      sectorId,
      assignedTo: 'On-Duty Safety Inspector'
    };

    setSectorsData(prev => prev.map(s => {
      if (s.id === sectorId) {
        return {
          ...s,
          hazards: [newHazard, ...s.hazards]
        };
      }
      return s;
    }));
  };

  // Add feedback with guaranteed anonymity
  const handleAddFeedback = ({ message, sentiment, sectorId }) => {
    const cleanMessage = anonymizeFeedback(message);
    const newFeedback = {
      id: `FB-${Date.now().toString().slice(-4)}`,
      sectorId,
      sentiment,
      message: cleanMessage,
      submittedAt: 'Just now',
      status: 'REVIEWING'
    };

    setSectorsData(prev => prev.map(s => {
      if (s.id === sectorId) {
        return {
          ...s,
          feedback: [newFeedback, ...s.feedback]
        };
      }
      return s;
    }));
  };

  // Resolve hazard from Admin view
  const handleResolveHazard = (hazardId) => {
    setSectorsData(prev => prev.map(s => ({
      ...s,
      hazards: s.hazards.map(h => h.id === hazardId ? { ...h, status: 'RESOLVED' } : h)
    })));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentSector={currentSector}
        setCurrentSector={setCurrentSector}
        language={language}
        setLanguage={setLanguage}
        t={t}
        onOpenPitch={() => setIsPitchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRole === 'worker' ? (
          <div className="relative">
            {/* Quick floating helper banner for judges */}
            <div className="max-w-md mx-auto pt-3 px-4 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center text-emerald-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Mobile PWA Experience (Dual UI 1)
              </span>
              <button
                onClick={() => setCurrentRole('admin')}
                className="hover:text-white underline text-[11px]"
              >
                Switch to Admin Portal →
              </button>
            </div>

            <WorkerApp
              currentSector={currentSector}
              t={t}
              language={language}
              sectorsData={sectorsData}
              onAddHazard={handleAddHazard}
              onAddFeedback={handleAddFeedback}
            />
          </div>
        ) : (
          <AdminPortal
            currentSector={currentSector}
            sectorsData={sectorsData}
            workersData={workersData}
            t={t}
            onResolveHazard={handleResolveHazard}
          />
        )}
      </main>

      {/* Presentation Pitch / Rubric Modal */}
      <PitchModal isOpen={isPitchOpen} onClose={() => setIsPitchOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>
          Prompt Wars 2026 • ACM Student Chapter, SRMIST • Built for <strong>UN SDG 8 (Decent Work & Economic Growth)</strong>
        </p>
      </footer>
    </div>
  );
}
