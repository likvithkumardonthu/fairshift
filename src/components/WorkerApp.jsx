import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  MessageSquare, 
  Award, 
  Volume2, 
  Mic, 
  MicOff, 
  Camera, 
  CheckCircle, 
  ShieldAlert, 
  MapPin, 
  Sparkles,
  ChevronRight,
  Flame
} from 'lucide-react';
import { calculatePay, assessHazardPriority, anonymizeFeedback } from '../utils/calculations.js';

export default function WorkerApp({ 
  currentSector, 
  t, 
  language, 
  sectorsData, 
  onAddHazard, 
  onAddFeedback 
}) {
  const [activeTab, setActiveTab] = useState('shift'); // 'shift' | 'safety' | 'feedback' | 'skills'
  const [isClockedIn, setIsClockedIn] = useState(true);
  
  // Real-time dynamic shift duration (hours)
  // Initialized at 9.8 hours to showcase the overtime 1.5x calculation and fatigue alert
  const [hoursWorked, setHoursWorked] = useState(9.8);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Safety reporting state
  const [hazardCategory, setHazardCategory] = useState('Working at Height');
  const [hazardText, setHazardText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hazardSuccess, setHazardSuccess] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(true);

  // Feedback state
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSentiment, setFeedbackSentiment] = useState('CONCERN');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Sector config
  const sector = sectorsData.find(s => s.id === currentSector) || sectorsData[0];
  const baseRate = sector.hourlyRate || 140;

  // Real-time pay calculation
  const pay = calculatePay(hoursWorked, baseRate);

  // Periodic increment to simulate live shift timer
  useEffect(() => {
    if (!isClockedIn) return;
    const interval = setInterval(() => {
      setHoursWorked(prev => Number((prev + 0.01).toFixed(2)));
    }, 15000); // slight increment every 15s
    return () => clearInterval(interval);
  }, [isClockedIn]);

  // Audio Speech synthesis for low literacy workers
  const handleReadPayslip = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    let textToSpeak = "";

    if (language === 'hi') {
      textToSpeak = `नमस्ते रमेश जी। आज का कुल समय ${pay.hoursWorked} घंटे है। सामान्य वेतन ${pay.standardPay} रुपये, और ओवरटाइम का वेतन ${pay.overtimePay} रुपये है। ईपीएफ कटौती के बाद आपका शुद्ध वेतन ${pay.netPay} रुपये है।`;
    } else if (language === 'ta') {
      textToSpeak = `வணக்கம் ரமேஷ். இன்றைய மொத்த வேலை நேரம் ${pay.hoursWorked} மணி நேரம். அடிப்படை சம்பளம் ${pay.standardPay} ரூபாய், கூடுதல் பணி ஊதியம் ${pay.overtimePay} ரூபாய். பிடித்தம் போக உங்கள் நிகர சம்பளம் ${pay.netPay} ரூபாய்.`;
    } else {
      textToSpeak = `Hello Ramesh. Today's total logged shift is ${pay.hoursWorked} hours. Standard pay is ₹${pay.standardPay}, and overtime pay at 1.5x rate is ₹${pay.overtimePay}. Total take-home pay after deductions is ₹${pay.netPay}.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    
    // Choose speech language
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'ta') utterance.lang = 'ta-IN';
    else utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Voice speech-to-text recognition for safety reports
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback demo text
      const demoTexts = {
        en: "Loose scaffolding planks observed on the 3rd floor edge with no safety net below.",
        hi: "तीसरी मंजिल पर पाड़ के तख्ते ढीले हैं और नीचे कोई सुरक्षा जाल नहीं है।",
        ta: "மூன்றாவது தளத்தில் பாதுகாப்பு வலை இல்லாமல் பலகைகள் தளர்வாக உள்ளன."
      };
      setHazardText(demoTexts[language] || demoTexts.en);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setHazardText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.warn("Speech recognition error", e);
      setIsListening(false);
    }
  };

  // Submit hazard
  const handleSubmitHazard = (e) => {
    e.preventDefault();
    if (!hazardText.trim()) return;

    onAddHazard({
      category: hazardCategory,
      description: hazardText,
      sectorId: currentSector
    });

    setHazardSuccess(true);
    setHazardText('');
    setTimeout(() => setHazardSuccess(false), 4000);
  };

  // Submit anonymous feedback
  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    onAddFeedback({
      message: feedbackText,
      sentiment: feedbackSentiment,
      sectorId: currentSector
    });

    setFeedbackSuccess(true);
    setFeedbackText('');
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  return (
    <div className="max-w-md mx-auto pb-24 pt-4 px-3 sm:px-4">
      {/* Worker Identity Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-xl relative overflow-hidden mb-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=150&auto=format&fit=crop&q=80" 
                  alt="Worker Profile" 
                  className="w-12 h-12 rounded-2xl object-cover"
                />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${isClockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-white text-base leading-tight">{t.workerName}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-700/60 rounded-md text-slate-300">
                  {t.workerId}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {currentSector === 'construction' ? 'Senior Scaffolder & Site Rigger' : 'Campus Sanitation & Facility Lead'}
              </p>
              <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-emerald-400 font-medium">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{sector.name}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
              isClockedIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {isClockedIn ? t.onShift : t.offShift}
            </span>
          </div>
        </div>

        {/* Shift Clock-in tactile action button */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">{t.shiftDuration}</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-2xl font-black text-white font-mono">{hoursWorked}</span>
              <span className="text-xs text-slate-400">hours</span>
              {pay.overtimeHours > 0 && (
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center">
                  <Flame className="w-3 h-3 mr-0.5 text-amber-400 fill-amber-400" />
                  +{pay.overtimeHours}h OT (1.5x)
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsClockedIn(!isClockedIn)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg active:scale-95 ${
              isClockedIn
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/25'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{isClockedIn ? t.clockOut : t.clockIn}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 mb-5 text-center">
        <button
          onClick={() => setActiveTab('shift')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 ${
            activeTab === 'shift' 
              ? 'bg-emerald-500 text-slate-950 shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-[11px]">{t.tabShift}</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 relative ${
            activeTab === 'safety' 
              ? 'bg-emerald-500 text-slate-950 shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="text-[11px]">{t.tabSafety}</span>
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 ${
            activeTab === 'feedback' 
              ? 'bg-emerald-500 text-slate-950 shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[11px]">{t.tabFeedback}</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 ${
            activeTab === 'skills' 
              ? 'bg-emerald-500 text-slate-950 shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span className="text-[11px]">{t.tabSkills}</span>
        </button>
      </div>

      {/* TAB 1: SHIFT & TRANSPARENT PAYSLIP */}
      {activeTab === 'shift' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm">{t.payslipTitle}</h3>
                <p className="text-[11px] text-slate-400">{t.payslipSub}</p>
              </div>
              <button
                onClick={handleReadPayslip}
                disabled={isSpeaking}
                className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5 transition active:scale-95"
                title="Read out payslip in local tongue (Voice Audio)"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-emerald-300' : ''}`} />
                <span className="text-xs font-semibold">{isSpeaking ? t.speaking : 'Audio'}</span>
              </button>
            </div>

            {/* Payslip Line Items */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 px-3 bg-slate-800/40 rounded-xl">
                <span className="text-slate-300">{t.baseHours} (8 hrs @ ₹{baseRate}/hr)</span>
                <span className="font-mono font-semibold text-white">₹{pay.standardPay}</span>
              </div>

              <div className="flex justify-between py-1.5 px-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 font-medium">
                <span className="flex items-center">
                  <Flame className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  {t.otHours} ({pay.overtimeHours} hrs @ 1.5x = ₹{baseRate * 1.5}/hr)
                </span>
                <span className="font-mono font-bold">+₹{pay.overtimePay}</span>
              </div>

              <div className="flex justify-between py-1.5 px-3 bg-slate-800/40 rounded-xl">
                <span className="text-slate-400">{t.deductions}</span>
                <span className="font-mono text-rose-400">-₹{pay.deductions}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline px-1">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{t.netPay}</span>
                  <p className="text-[10px] text-slate-400">Direct Bank / UPI transfer upon shift end</p>
                </div>
                <span className="text-2xl font-black text-emerald-400 font-mono">₹{pay.netPay}</span>
              </div>
            </div>

            {/* Fair Wage Guarantee SDG 8 Pill */}
            <div className="mt-4 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                <strong>SDG 8 Protected:</strong> Overtime is calculated to the exact minute under statutory labor standards. No uncounted hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTANT VOICE HAZARD REPORT */}
      {activeTab === 'safety' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-rose-400" />
                {t.safetyTitle}
              </h3>
              <p className="text-[11px] text-slate-400">{t.safetySub}</p>
            </div>

            {hazardSuccess && (
              <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
                {t.hazardSubmitted}
              </div>
            )}

            <form onSubmit={handleSubmitHazard} className="mt-4 space-y-3.5">
              {/* Category selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  {t.hazardCategory}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Working at Height', 'Electrical Hazard', 'Slip & Ramp Risk', 'Chemical & Bio-Waste'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setHazardCategory(cat)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition flex items-center space-x-2 ${
                        hazardCategory === cat
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="truncate">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hazard description & Voice input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Voice or Text Description
                  </label>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? t.micListening : t.micStart}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={hazardText}
                  onChange={(e) => setHazardText(e.target.value)}
                  placeholder={t.hazardDescPlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Photo Evidence Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Camera className="w-4 h-4 text-slate-400" />
                  <span>Attach Site Camera Evidence</span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasPhoto(!hasPhoto)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    hasPhoto ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {hasPhoto ? 'Photo Attached (1)' : 'Add Photo'}
                </button>
              </div>

              <button
                type="submit"
                disabled={!hazardText.trim()}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-2xl text-xs transition shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{t.submitHazard}</span>
              </button>
            </form>
          </div>

          {/* Recent site hazards */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4">
            <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">{t.recentHazards}</h4>
            <div className="space-y-2.5">
              {sector.hazards.map((hz) => (
                <div key={hz.id} className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hz.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {hz.severity}
                      </span>
                      <span className="text-[11px] font-semibold text-white">{hz.category}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-snug">{hz.description}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{hz.reportedAt} • {hz.assignedTo}</p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                    hz.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300 animate-pulse'
                  }`}>
                    {hz.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 100% ANONYMOUS VOICE / FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-teal-400" />
                {t.feedbackTitle}
              </h3>
              <p className="text-[11px] text-slate-400">{t.feedbackSub}</p>
            </div>

            {feedbackSuccess && (
              <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
                {t.feedbackSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitFeedback} className="mt-4 space-y-3.5">
              <div className="flex space-x-2">
                {[
                  { id: 'CONCERN', label: '⚠️ Issue/Concern', color: 'text-amber-300' },
                  { id: 'IDEA', label: '💡 Improvement Idea', color: 'text-teal-300' },
                  { id: 'POSITIVE', label: '👏 Appreciation', color: 'text-emerald-300' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFeedbackSentiment(item.id)}
                    className={`flex-1 py-2 px-1 text-[11px] rounded-xl font-bold border transition ${
                      feedbackSentiment === item.id
                        ? 'bg-slate-800 border-teal-500 text-white shadow-inner'
                        : 'bg-slate-850 border-slate-700 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={t.feedbackPlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Privacy Guarantee Pill */}
              <div className="p-3 bg-teal-950/30 border border-teal-500/30 rounded-2xl text-[11px] text-teal-300">
                🛡️ <strong>Zero-Footprint Anonymity:</strong> Your device IP, phone number, and employee code are automatically stripped before reaching management.
              </div>

              <button
                type="submit"
                disabled={!feedbackText.trim()}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 text-slate-950 font-extrabold rounded-2xl text-xs transition shadow-lg shadow-emerald-500/20"
              >
                {t.feedbackSubmit}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: PORTABLE SKILL PASSPORT */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center">
                  <Award className="w-4 h-4 mr-2 text-amber-400" />
                  {t.skillsTitle}
                </h3>
                <p className="text-[11px] text-slate-400">{t.skillsSub}</p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Tier-1 Certified
              </span>
            </div>

            <div className="mt-4 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">{t.totalHoursLogged}</span>
                <p className="text-xl font-black text-white font-mono mt-0.5">1,240 hrs</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Zero Lost Time Injuries</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">100% Safety Record</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { title: "Heavy Scaffolding Rigging L2", authority: "National Skill Council", date: "Jan 2025", hours: "420 hrs" },
                { title: "Confined Space & Fall Arrest", authority: "L&T Safety Institute", date: "Aug 2025", hours: "180 hrs" },
                { title: "First Aid & CPR Responder", authority: "Indian Red Cross", date: "Nov 2025", hours: "40 hrs" },
              ].map((badge, idx) => (
                <div key={idx} className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                      <p className="text-[10px] text-slate-400">{badge.authority} • {badge.date}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    {badge.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
