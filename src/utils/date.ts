import { format, parseISO, startOfWeek, addWeeks, isValid, addDays } from 'date-fns';

const PERIOD_START_DATE = '2025-03-02'; // First day is 02/03/2025

export function formatDate(date: string): string {
  if (!date) return '-';
  try {
    const parsed = parseISO(date);
    if (!isValid(parsed) || isNaN(parsed.getTime())) return '-';
    return format(parsed, 'yyyy-MM-dd');
  } catch {
    return '-';
  }
}

export function getPeriodId(date: string): number {
  const startDate = new Date(PERIOD_START_DATE);
  const currentDate = parseISO(date);
  const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  return Math.floor(daysDiff / 14) + 1; // 14 days per period
}

export function getPeriodStartDate(periodId: number): string {
  const startDate = new Date(PERIOD_START_DATE);
  const periodStart = addDays(startDate, (periodId - 1) * 14);
  return format(periodStart, 'yyyy-MM-dd');
}

export function getPeriodEndDate(periodId: number): string {
  const startDate = new Date(PERIOD_START_DATE);
  const periodStart = addDays(startDate, (periodId - 1) * 14);
  const periodEnd = addDays(periodStart, 13); // 14 days total
  return format(periodEnd, 'yyyy-MM-dd');
} 