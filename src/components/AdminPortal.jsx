import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  HeartHandshake, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Eye, 
  FileSpreadsheet, 
  Activity,
  Flame,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export default function AdminPortal({ 
  currentSector, 
  sectorsData, 
  workersData, 
  t, 
  onResolveHazard 
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [selectedWorker, setSelectedWorker] = useState(null);

  const sector = sectorsData.find(s => s.id === currentSector) || sectorsData[0];
  const sectorWorkers = workersData.filter(w => w.sectorId === currentSector);

  // Fatigue risk calculations
  const fatigueAlerts = sectorWorkers.filter(w => w.fatigueRisk && w.fatigueRisk.hasRisk);
  const criticalFatigue = sectorWorkers.filter(w => w.fatigueRisk && w.fatigueRisk.riskLevel === 'CRITICAL');

  // Filtered hazards
  const filteredHazards = sector.hazards.filter(h => {
    if (filterSeverity === 'ALL') return true;
    return h.severity === filterSeverity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Workforce Telemetry
            </span>
            <span className="text-xs text-slate-400">• Sector: <strong className="text-white">{sector.name}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            {t.adminDashboardTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time SDG 8 compliance monitoring, fatigue prevention radar, and instant safety escalation.
          </p>
        </div>

        {/* Quick Sector Health Badge */}
        <div className="flex items-center space-x-4 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Trust & Decent Work Score</span>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-2xl font-black text-emerald-400">{sector.workforceRiskScore}%</span>
              <span className="text-xs text-emerald-500 font-semibold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> High
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.livePersonnel}</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{sector.activeWorkersCount}</span>
            <span className="text-xs text-emerald-400 font-medium">100% geo-verified</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active shifts on site with biometric/QR sync</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.fatigueAlertsCount}</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400">{fatigueAlerts.length}</span>
            <span className="text-xs text-amber-300 font-medium">Workers &gt; 9.5h</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Flags potential accident risk before fatigue strikes</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.hazardsPending}</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-rose-400">
              {sector.hazards.filter(h => h.status !== 'RESOLVED').length}
            </span>
            <span className="text-xs text-rose-300 font-medium">Urgent</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Open safety hazards requiring site engineer sign-off</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Anonymous Feedback</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-teal-400">{sector.feedback.length}</span>
            <span className="text-xs text-teal-300 font-medium">Total submissions</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Protected whistleblower reports with 0% PII leak</p>
        </div>
      </div>

      {/* SECTION 1: CRITICAL FATIGUE & OVERTIME RADAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center">
              <Flame className="w-5 h-5 text-amber-400 mr-2" />
              Real-time Fatigue & Overtime Mitigation Radar
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies frontline personnel exceeding safety thresholds to eliminate exhaustion-related injuries.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-xl self-start sm:self-auto">
            Statutory Limit: 8 hrs (Max OT: 4 hrs)
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectorWorkers.map((w) => {
            const hasRisk = w.fatigueRisk && w.fatigueRisk.hasRisk;
            const isCritical = w.fatigueRisk && w.fatigueRisk.riskLevel === 'CRITICAL';
            return (
              <div 
                key={w.id} 
                className={`p-4 rounded-2xl border transition ${
                  isCritical 
                    ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-900/10' 
                    : hasRisk 
                    ? 'bg-amber-950/20 border-amber-500/40' 
                    : 'bg-slate-850/60 border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">{w.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{w.id}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{w.role}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCritical 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : hasRisk 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {w.fatigueRisk.riskLevel}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Hours Logged</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {w.currentShift.hoursWorked} hrs
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Overtime Accrued</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {w.payDetails ? `${w.payDetails.overtimeHours} hrs (₹${w.payDetails.overtimePay})` : '0h'}
                    </span>
                  </div>
                </div>

                {hasRisk && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-[11px] text-amber-200">
                    <p className="font-medium">{w.fatigueRisk.warnings[0].reason}</p>
                    <p className="text-[10px] text-slate-400 mt-1 italic">
                      💡 {w.fatigueRisk.warnings[0].recommendation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: HAZARD ESCALATION DESK & ANONYMOUS WHISTLEBLOWER FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Safety Hazard Escalation Desk */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center">
                  <ShieldAlert className="w-5 h-5 text-rose-400 mr-2" />
                  Site Hazard Escalation Desk
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct worker voice and camera hazard submissions.
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex space-x-1 bg-slate-800 p-1 rounded-xl text-[10px] font-bold">
                {['ALL', 'CRITICAL', 'HIGH'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setFilterSeverity(lvl)}
                    className={`px-2 py-0.5 rounded-lg transition ${
                      filterSeverity === lvl ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredHazards.map((hz) => (
                <div key={hz.id} className="p-4 bg-slate-850 rounded-2xl border border-slate-750 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        hz.severity === 'CRITICAL' 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {hz.severity}
                      </span>
                      <span className="text-xs font-bold text-white">{hz.category}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      hz.status === 'RESOLVED' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {hz.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200">{hz.description}</p>
                  
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Assigned: <strong>{hz.assignedTo}</strong></span>
                    {hz.status !== 'RESOLVED' && (
                      <button
                        onClick={() => onResolveHazard(hz.id)}
                        className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl font-bold transition text-xs flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t.resolve}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Anonymous Workforce Feedback & Attrition Warning */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center">
                <HeartHandshake className="w-5 h-5 text-teal-400 mr-2" />
                Protected Whistleblower & Sentiment Feed
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Anonymous grievance insights to resolve unrest and retention gaps early.
              </p>
            </div>

            <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {sector.feedback.map((fb) => (
                <div key={fb.id} className="p-4 bg-slate-850 rounded-2xl border border-slate-750 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      fb.sentiment === 'CONCERN' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {fb.sentiment}
                    </span>
                    <span className="text-[10px] text-slate-500">{fb.submittedAt}</span>
                  </div>

                  <p className="text-xs text-slate-200 italic">"{fb.message}"</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center text-teal-400">
                      🛡️ Identity Protected (No IP/User Record)
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded font-mono text-slate-300">
                      Status: {fb.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: AUDITED PAYROLL & LABOR COMPLIANCE TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400 mr-2" />
              Transparent Payroll & Overtime Compliance Ledger
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified timesheet logs with statutory 1.5x overtime multiplication and EPF compliance.
            </p>
          </div>
          <button 
            onClick={() => alert("Payroll audit report exported to CSV!")}
            className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>Export Verified CSV</span>
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/60 rounded-xl">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Shift Hours</th>
                <th className="py-3 px-4">Base Pay</th>
                <th className="py-3 px-4">OT Hours (1.5x)</th>
                <th className="py-3 px-4">Statutory Deductions</th>
                <th className="py-3 px-4 text-right">Net Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sectorWorkers.map(w => {
                const pay = w.payDetails || { standardPay: 0, overtimeHours: 0, overtimePay: 0, deductions: 0, netPay: 0 };
                return (
                  <tr key={w.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {w.name}
                      <span className="block text-[10px] text-slate-500 font-mono">{w.id}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{w.role}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-white">{w.currentShift.hoursWorked} hrs</td>
                    <td className="py-3.5 px-4 font-mono">₹{pay.standardPay}</td>
                    <td className="py-3.5 px-4 font-mono text-amber-400 font-semibold">
                      +{pay.overtimeHours} hrs (₹{pay.overtimePay})
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-400">-₹{pay.deductions}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      ₹{pay.netPay}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
