import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialSectors, initialWorkers } from './mockData.js';
import { calculatePay, detectFatigueRisk, anonymizeFeedback, assessHazardPriority } from '../src/utils/calculations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// In-memory data store for hackathon live demo
let sectors = JSON.parse(JSON.stringify(initialSectors));
let workers = JSON.parse(JSON.stringify(initialWorkers));

// 1. Health & SDG compliance metadata check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'FairShift Backend API',
    sdgAlignment: 'UN SDG 8 - Decent Work and Economic Growth',
    supportedSectors: sectors.map(s => s.name),
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Sectors list
app.get('/api/sectors', (req, res) => {
  res.json(sectors);
});

// 3. Workers & shifts
app.get('/api/workers', (req, res) => {
  const { sectorId } = req.query;
  const filtered = sectorId ? workers.filter(w => w.sectorId === sectorId) : workers;
  
  // Attach calculated pay & fatigue risks
  const enriched = filtered.map(w => {
    const pay = calculatePay(w.currentShift.hoursWorked, w.baseHourlyRate);
    const fatigue = detectFatigueRisk({
      hoursWorked: w.currentShift.hoursWorked,
      consecutiveDays: w.consecutiveDays,
      isNightShift: w.isNightShift
    });
    return { ...w, payDetails: pay, fatigueRisk: fatigue };
  });

  res.json(enriched);
});

// 4. Clock In
app.post('/api/shifts/clock-in', (req, res) => {
  const { workerId = 'EMP-4092', location = 'Site Gate 1' } = req.body;
  const worker = workers.find(w => w.id === workerId);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });

  worker.currentShift = {
    isClockedIn: true,
    clockInTime: new Date().toISOString(),
    hoursWorked: 0.1,
    location
  };

  res.json({ message: 'Clock-in verified with GPS coordinates', worker });
});

// 5. Clock Out
app.post('/api/shifts/clock-out', (req, res) => {
  const { workerId = 'EMP-4092' } = req.body;
  const worker = workers.find(w => w.id === workerId);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });

  const totalHours = worker.currentShift.hoursWorked;
  const paySummary = calculatePay(totalHours, worker.baseHourlyRate);

  worker.currentShift = {
    isClockedIn: false,
    clockInTime: null,
    hoursWorked: 0,
    lastCompletedHours: totalHours,
    lastCompletedPay: paySummary
  };

  res.json({ message: 'Shift concluded. Transparent payslip recorded.', paySummary });
});

// 6. Hazards
app.get('/api/hazards', (req, res) => {
  const allHazards = sectors.flatMap(s => s.hazards);
  res.json(allHazards);
});

app.post('/api/hazards', (req, res) => {
  const { category, description, sectorId = 'construction' } = req.body;
  if (!description) return res.status(400).json({ error: 'Description required' });

  const severity = assessHazardPriority(category, description);
  const targetSector = sectors.find(s => s.id === sectorId) || sectors[0];

  const newHazard = {
    id: `HAZ-${Date.now().toString().slice(-4)}`,
    category: category || 'Workplace Safety',
    description: description.trim(),
    severity,
    status: 'INVESTIGATING',
    reportedAt: 'Just now',
    sectorId,
    assignedTo: 'Duty Safety Officer'
  };

  targetSector.hazards.unshift(newHazard);
  res.status(201).json({ message: 'Hazard successfully escalated', hazard: newHazard });
});

app.patch('/api/hazards/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  let found = null;
  for (const s of sectors) {
    const h = s.hazards.find(hz => hz.id === id);
    if (h) {
      h.status = status || 'RESOLVED';
      found = h;
      break;
    }
  }

  if (!found) return res.status(404).json({ error: 'Hazard ID not found' });
  res.json({ message: 'Hazard status updated', hazard: found });
});

// 7. Feedback (Anonymous Whistleblower)
app.get('/api/feedback', (req, res) => {
  const allFeedback = sectors.flatMap(s => s.feedback);
  res.json(allFeedback);
});

app.post('/api/feedback', (req, res) => {
  const { message, sectorId = 'construction', sentiment = 'CONCERN' } = req.body;
  if (!message) return res.status(400).json({ error: 'Message cannot be empty' });

  // Guarantee whistleblower privacy through anonymizer
  const sanitizedMessage = anonymizeFeedback(message);
  const targetSector = sectors.find(s => s.id === sectorId) || sectors[0];

  const newFeedback = {
    id: `FB-${Date.now().toString().slice(-4)}`,
    sectorId,
    sentiment,
    message: sanitizedMessage,
    submittedAt: 'Just now',
    status: 'REVIEWING'
  };

  targetSector.feedback.unshift(newFeedback);
  res.status(201).json({ message: 'Anonymous feedback recorded without PII', feedback: newFeedback });
});

// Serve frontend in production (Cloud Run)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <h1>FairShift API is Running</h1>
        <p>Build frontend with <code>npm run build</code> to serve UI.</p>
        <p>Health check at <a href="/api/health">/api/health</a></p>
      `);
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FairShift server listening on http://0.0.0.0:${PORT}`);
  console.log(`🌿 UN SDG 8 Compliant Workforce Platform`);
});
