export const initialSectors = [
  {
    id: "construction",
    name: "Metro Rail Infrastructure (Site 4B)",
    type: "Construction Site",
    location: "Kattankulathur Zone 3",
    activeWorkersCount: 48,
    workforceRiskScore: 78, // out of 100
    hourlyRate: 140, // ₹ / hr
    roles: ["Scaffolder", "Mason", "Crane Operator", "Steel Bender", "Electrician"],
    hazards: [
      {
        id: "HAZ-101",
        category: "Working at Height",
        description: "Missing guardrails on 4th floor scaffolding near Pillar 12.",
        severity: "CRITICAL",
        status: "INVESTIGATING",
        reportedAt: "Today, 08:30 AM",
        sectorId: "construction",
        assignedTo: "Chief Safety Engineer V. Sharma"
      },
      {
        id: "HAZ-102",
        category: "Electrical Hazard",
        description: "Exposed generator cable waterlogged near mixing bay.",
        severity: "HIGH",
        status: "RESOLVED",
        reportedAt: "Yesterday, 04:15 PM",
        sectorId: "construction",
        assignedTo: "Electrical Safety Officer"
      }
    ],
    feedback: [
      {
        id: "FB-201",
        sectorId: "construction",
        sentiment: "CONCERN",
        message: "Drinking water stations on the western tower run empty by 1 PM under direct sun.",
        submittedAt: "2 hours ago",
        status: "ACTION_TAKEN"
      },
      {
        id: "FB-202",
        sectorId: "construction",
        sentiment: "POSITIVE",
        message: "New anti-vibration gloves provided this Monday have reduced hand numbness significantly.",
        submittedAt: "Yesterday",
        status: "ACKNOWLEDGED"
      }
    ]
  },
  {
    id: "college",
    name: "SRM Campus Support & Facilities",
    type: "Higher Education Campus",
    location: "SRM Tech Park & Hostel Blocks",
    activeWorkersCount: 64,
    workforceRiskScore: 89,
    hourlyRate: 110,
    roles: ["Sanitation Executive", "Hostel Electrician", "Landscape Groundskeeper", "Plumber"],
    hazards: [
      {
        id: "HAZ-201",
        category: "Chemical & Waste",
        description: "Bio-waste chemical storage lock broken behind Main Biotech Lab.",
        severity: "HIGH",
        status: "INVESTIGATING",
        reportedAt: "Today, 07:45 AM",
        sectorId: "college",
        assignedTo: "Campus Health & Environment Lead"
      },
      {
        id: "HAZ-202",
        category: "Slip & Fall",
        description: "Polished granite ramp slippery near Architecture Block during rain.",
        severity: "MEDIUM",
        status: "RESOLVED",
        reportedAt: "2 days ago",
        sectorId: "college",
        assignedTo: "Facilities Head"
      }
    ],
    feedback: [
      {
        id: "FB-301",
        sectorId: "college",
        sentiment: "CONCERN",
        message: "Hostel night sanitation staff request safety reflective vests for perimeter walks at night.",
        submittedAt: "1 day ago",
        status: "REVIEWING"
      }
    ]
  }
];

export const initialWorkers = [
  {
    id: "EMP-4092",
    name: "Ramesh Kumar",
    phoneMasked: "+91 98*** **210",
    role: "Senior Scaffolder & Site Rigger",
    sectorId: "construction",
    baseHourlyRate: 140,
    currentShift: {
      isClockedIn: true,
      clockInTime: new Date(Date.now() - 9.8 * 3600 * 1000).toISOString(), // 9.8 hrs ago for demo fatigue alert!
      hoursWorked: 9.8,
      location: "Metro Pillar 14"
    },
    consecutiveDays: 6,
    isNightShift: false,
    verifiedSkills: [
      { id: "SK-1", title: "Heavy Scaffolding Safety Level 2", issuer: "National Skill Dev Council", date: "Jan 2025", hours: 420 },
      { id: "SK-2", title: "Confined Space & Harness Certified", issuer: "L&T Safety Institute", date: "Aug 2025", hours: 180 },
      { id: "SK-3", title: "First Aid & CPR First Responder", issuer: "Red Cross India", date: "Nov 2025", hours: 40 }
    ]
  },
  {
    id: "EMP-5104",
    name: "Murugan Selvam",
    phoneMasked: "+91 94*** **882",
    role: "Campus Sanitation Lead",
    sectorId: "college",
    baseHourlyRate: 110,
    currentShift: {
      isClockedIn: true,
      clockInTime: new Date(Date.now() - 7.5 * 3600 * 1000).toISOString(),
      hoursWorked: 7.5,
      location: "Main Auditorium Roster"
    },
    consecutiveDays: 4,
    isNightShift: false,
    verifiedSkills: [
      { id: "SK-4", title: "Industrial Chemical Handling", issuer: "Facility Council", date: "Mar 2025", hours: 310 },
      { id: "SK-5", title: "Campus Bio-Waste Protocols", issuer: "SRM Env Safety", date: "Dec 2024", hours: 220 }
    ]
  },
  {
    id: "EMP-6231",
    name: "Amit Patel",
    phoneMasked: "+91 97*** **331",
    role: "Tower Crane Operator",
    sectorId: "construction",
    baseHourlyRate: 190,
    currentShift: {
      isClockedIn: true,
      clockInTime: new Date(Date.now() - 12.2 * 3600 * 1000).toISOString(), // 12.2 hrs -> CRITICAL Fatigue!
      hoursWorked: 12.2,
      location: "Tower Crane C-2"
    },
    consecutiveDays: 7,
    isNightShift: true,
    verifiedSkills: [
      { id: "SK-6", title: "Heavy Machinery High Mast Rigging", issuer: "ISO 9001 Infra", date: "May 2024", hours: 950 }
    ]
  }
];
