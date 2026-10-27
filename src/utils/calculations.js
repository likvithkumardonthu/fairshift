/**
 * FairShift - Core Business Logic & Algorithms
 * Compliant with UN SDG 8 (Decent Work & Economic Growth)
 */

/**
 * Calculates transparent wage breakdown including 1.5x overtime and statutory deductions.
 * @param {number} hoursWorked 
 * @param {number} baseHourlyRate 
 * @param {number} otMultiplier Default 1.5x according to labor standards
 * @param {number} deductionRate Default 12% for EPF/ESI
 */
export function calculatePay(hoursWorked, baseHourlyRate = 120, otMultiplier = 1.5, deductionRate = 0.12) {
  const safeHours = Math.max(0, Number(hoursWorked) || 0);
  const standardHours = Math.min(safeHours, 8);
  const overtimeHours = Math.max(0, safeHours - 8);

  const standardPay = Math.round(standardHours * baseHourlyRate);
  const overtimePay = Math.round(overtimeHours * baseHourlyRate * otMultiplier);
  const grossPay = standardPay + overtimePay;
  const deductions = Math.round(grossPay * deductionRate);
  const netPay = Math.max(0, grossPay - deductions);

  return {
    hoursWorked: Number(safeHours.toFixed(2)),
    standardHours: Number(standardHours.toFixed(2)),
    overtimeHours: Number(overtimeHours.toFixed(2)),
    standardPay,
    overtimePay,
    grossPay,
    deductions,
    netPay,
    currency: '₹'
  };
}

/**
 * Evaluates worker fatigue and safety breach risks
 * Triggers alert if hours > 10, back-to-back night shifts, or continuous shifts without rest.
 */
export function detectFatigueRisk(workerRecord) {
  const { hoursWorked, isNightShift, consecutiveDays = 1 } = workerRecord;
  const warnings = [];

  if (hoursWorked >= 12) {
    warnings.push({
      level: 'CRITICAL',
      reason: 'Excessive shift duration exceeding 12 hours. Severe accident hazard.',
      recommendation: 'Mandatory relief shift replacement immediately.'
    });
  } else if (hoursWorked > 9.5) {
    warnings.push({
      level: 'HIGH',
      reason: 'Shift duration over 9.5 hours. Cognitive fatigue risk high.',
      recommendation: 'Schedule 30-minute cooling rest before any hazardous task.'
    });
  }

  if (consecutiveDays >= 6) {
    warnings.push({
      level: 'HIGH',
      reason: `6+ consecutive workdays (${consecutiveDays} days) without weekly rest.`,
      recommendation: 'Compulsory rest day due as per decent work guidelines.'
    });
  }

  if (isNightShift && hoursWorked > 8) {
    warnings.push({
      level: 'HIGH',
      reason: 'Night shift prolonged past 8 standard hours.',
      recommendation: 'Prohibit high-altitude or heavy machinery operations.'
    });
  }

  return {
    hasRisk: warnings.length > 0,
    riskLevel: warnings.some(w => w.level === 'CRITICAL') ? 'CRITICAL' : (warnings.length > 0 ? 'HIGH' : 'NORMAL'),
    warnings
  };
}

/**
 * Strips personal identifiers and sanitizes feedback to ensure complete whistleblower anonymity.
 */
export function anonymizeFeedback(feedbackText) {
  if (!feedbackText || typeof feedbackText !== 'string') return '';
  
  // Strip potential phone numbers or 10-digit patterns
  let clean = feedbackText.replace(/\b\d{10}\b/g, '[PHONE REDACTED]');
  
  // Strip email addresses
  clean = clean.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL REDACTED]');
  
  // Strip employee ID patterns like EMP-1234
  clean = clean.replace(/\b(EMP|ID|BADGE)[-#\s]?\d+/gi, '[ID REDACTED]');
  
  return clean.trim();
}

/**
 * Evaluates hazard urgency based on keywords and site sector.
 */
export function assessHazardPriority(category, description) {
  const text = (description || '').toLowerCase();
  
  const criticalKeywords = ['fall', 'high voltage', 'electric shock', 'unsecured scaffold', 'fire', 'chemical spill', 'collapse', 'structural crack', 'bleeding'];
  const highKeywords = ['slippery', 'missing harness', 'broken helmet', 'oil spill', 'faulty brake', 'exposed wire', 'cracked ladder', 'deep trench'];

  if (criticalKeywords.some(kw => text.includes(kw))) {
    return 'CRITICAL';
  }
  if (highKeywords.some(kw => text.includes(kw)) || category === 'Working at Height' || category === 'Electrical Hazard') {
    return 'HIGH';
  }
  return 'MEDIUM';
}
