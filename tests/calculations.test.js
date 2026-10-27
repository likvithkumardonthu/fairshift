import { describe, it, expect } from 'vitest';
import { calculatePay, detectFatigueRisk, anonymizeFeedback, assessHazardPriority } from '../src/utils/calculations.js';

describe('FairShift Core Algorithms - UN SDG 8 Compliance', () => {
  describe('Wage & Overtime Calculation', () => {
    it('calculates standard shift without overtime correctly', () => {
      const pay = calculatePay(8, 100, 1.5, 0.10);
      expect(pay.standardHours).toBe(8);
      expect(pay.overtimeHours).toBe(0);
      expect(pay.standardPay).toBe(800);
      expect(pay.overtimePay).toBe(0);
      expect(pay.grossPay).toBe(800);
      expect(pay.deductions).toBe(80);
      expect(pay.netPay).toBe(720);
    });

    it('applies 1.5x overtime multiplier for hours exceeding 8', () => {
      const pay = calculatePay(10, 100, 1.5, 0.10);
      expect(pay.standardHours).toBe(8);
      expect(pay.overtimeHours).toBe(2);
      expect(pay.standardPay).toBe(800);
      expect(pay.overtimePay).toBe(300); // 2 * 100 * 1.5
      expect(pay.grossPay).toBe(1100);
      expect(pay.deductions).toBe(110);
      expect(pay.netPay).toBe(990);
    });

    it('safely handles zero or negative values', () => {
      const pay = calculatePay(0, 100);
      expect(pay.netPay).toBe(0);
      expect(pay.grossPay).toBe(0);
    });
  });

  describe('Fatigue Risk & Safety Breach Detection', () => {
    it('flags CRITICAL risk for shifts >= 12 hours', () => {
      const result = detectFatigueRisk({ hoursWorked: 12.5, isNightShift: false, consecutiveDays: 3 });
      expect(result.hasRisk).toBe(true);
      expect(result.riskLevel).toBe('CRITICAL');
      expect(result.warnings[0].reason).toContain('exceeding 12 hours');
    });

    it('flags HIGH risk for consecutive workdays >= 6 without weekly rest', () => {
      const result = detectFatigueRisk({ hoursWorked: 7, isNightShift: false, consecutiveDays: 7 });
      expect(result.hasRisk).toBe(true);
      expect(result.riskLevel).toBe('HIGH');
    });

    it('returns NORMAL for standard safe shift', () => {
      const result = detectFatigueRisk({ hoursWorked: 7.5, isNightShift: false, consecutiveDays: 2 });
      expect(result.hasRisk).toBe(false);
      expect(result.riskLevel).toBe('NORMAL');
    });
  });

  describe('Whistleblower Anonymization', () => {
    it('redacts phone numbers, emails, and employee IDs', () => {
      const raw = 'Supervisor on Site B ignored my report. Call me at 9876543210 or email test@example.com, my badge is EMP-4092.';
      const anonymized = anonymizeFeedback(raw);
      expect(anonymized).not.toContain('9876543210');
      expect(anonymized).not.toContain('test@example.com');
      expect(anonymized).not.toContain('EMP-4092');
      expect(anonymized).toContain('[PHONE REDACTED]');
      expect(anonymized).toContain('[EMAIL REDACTED]');
      expect(anonymized).toContain('[ID REDACTED]');
    });
  });

  describe('Hazard Severity Priority Assessment', () => {
    it('marks high voltage and scaffold falls as CRITICAL', () => {
      const priority = assessHazardPriority('Physical', 'Danger of scaffold fall due to missing railing');
      expect(priority).toBe('CRITICAL');
    });

    it('marks slippery ramps as HIGH', () => {
      const priority = assessHazardPriority('Physical', 'Wet slippery ramp near warehouse entrance');
      expect(priority).toBe('HIGH');
    });

    it('defaults to MEDIUM for standard issues', () => {
      const priority = assessHazardPriority('Lighting', 'Dim bulb near corridor');
      expect(priority).toBe('MEDIUM');
    });
  });
});
