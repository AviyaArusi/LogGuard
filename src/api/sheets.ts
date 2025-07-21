import { Employee, AttendanceRow, TotalsRow } from '../types';
import { DAILY_RATE, GOOGLE_SHEETS_API_KEY, SPREADSHEET_ID, EMPLOYEES_SHEET_NAME, ATTENDANCE_SHEET_NAME, TOTALS_SHEET_NAME } from '../constants';
import bcrypt from 'bcryptjs/dist/bcrypt';

// Extract only the spreadsheet ID if a full URL is provided
const SHEET_ID = SPREADSHEET_ID.includes('/d/')
  ? SPREADSHEET_ID.split('/d/')[1].split('/')[0]
  : SPREADSHEET_ID;

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export async function getEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/${SHEET_ID}/values/${EMPLOYEES_SHEET_NAME}!A:C?key=${GOOGLE_SHEETS_API_KEY}`
    );
    const data = await response.json();
    
    if (!data.values) return [];
    
    return data.values.slice(1).map((row: string[]) => ({
      email: row[0] || '',
      fullName: row[1] || '',
      password: row[2] || ''
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

// Attendance as array of objects by header name
export async function getAttendance(range?: string): Promise<any[][]> {
  try {
    const sheetRange = range || `${ATTENDANCE_SHEET_NAME}!A:Z`;
    const response = await fetch(
      `${BASE_URL}/${SHEET_ID}/values/${sheetRange}?key=${GOOGLE_SHEETS_API_KEY}`
    );
    const data = await response.json();
    if (!data.values) return [];
    return data.values; // 2D array: [header, ...rows]
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
}

export async function appendAttendance(attendance: AttendanceRow): Promise<boolean> {
  try {
    const values = [
      attendance.date,
      attendance.employee1,
      attendance.employee2,
      attendance.employee3,
      attendance.employee4,
      attendance.employee5,
      attendance.periodId.toString()
    ];

    const response = await fetch(
      `${BASE_URL}/${SHEET_ID}/values/${ATTENDANCE_SHEET_NAME}!A:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [values]
        })
      }
    );
    
    return response.ok;
  } catch (error) {
    console.error('Error appending attendance:', error);
    return false;
  }
}

export async function getTotals(): Promise<TotalsRow[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/${SHEET_ID}/values/${TOTALS_SHEET_NAME}!A:O?key=${GOOGLE_SHEETS_API_KEY}`
    );
    const data = await response.json();
    
    if (!data.values) return [];
    
    return data.values.slice(1).map((row: string[]) => ({
      period: parseInt(row[0]) || 0,
      employee1Days: parseInt(row[1]) || 0,
      employee1Pay: parseInt(row[2]) || 0,
      employee2Days: parseInt(row[3]) || 0,
      employee2Pay: parseInt(row[4]) || 0,
      employee3Days: parseInt(row[5]) || 0,
      employee3Pay: parseInt(row[6]) || 0,
      employee4Days: parseInt(row[7]) || 0,
      employee4Pay: parseInt(row[8]) || 0,
      employee5Days: parseInt(row[9]) || 0,
      employee5Pay: parseInt(row[10]) || 0,
      totalSubs: parseInt(row[11]) || 0,
      subsPay: parseInt(row[12]) || 0,
      notes: row[13] || '',
      grandTotal: parseInt(row[14]) || 0
    }));
  } catch (error) {
    console.error('Error fetching totals:', error);
    return [];
  }
}

export function calcTotalsLocally(attendance: AttendanceRow[], employees: Employee[]): TotalsRow[] {
  const periodMap = new Map<number, AttendanceRow[]>();
  
  // Group attendance by period
  attendance.forEach(row => {
    if (!periodMap.has(row.periodId)) {
      periodMap.set(row.periodId, []);
    }
    periodMap.get(row.periodId)!.push(row);
  });
  
  const totals: TotalsRow[] = [];
  
  periodMap.forEach((periodAttendance, periodId) => {
    const employeeStats = employees.map((_, index) => {
      const employeeKey = `employee${index + 1}` as keyof AttendanceRow;
      const workedDays = periodAttendance.filter(row => row[employeeKey] === 'V').length;
      const absentDays = periodAttendance.filter(row => row[employeeKey] === 'X').length;
      const substitutedDays = periodAttendance.filter(row => 
        row[employeeKey] !== 'V' && row[employeeKey] !== 'X' && row[employeeKey] !== ''
      ).length;
      
      return {
        workedDays,
        absentDays,
        substitutedDays,
        totalDays: workedDays + absentDays + substitutedDays
      };
    });
    
    const totalSubs = employeeStats.reduce((sum, stats) => sum + stats.substitutedDays, 0);
    const subsPay = totalSubs * DAILY_RATE;
    
    const totalPay = employeeStats.reduce((sum, stats) => sum + (stats.workedDays * DAILY_RATE), 0);
    const grandTotal = totalPay + subsPay;
    
    totals.push({
      period: periodId,
      employee1Days: employeeStats[0]?.workedDays || 0,
      employee1Pay: (employeeStats[0]?.workedDays || 0) * DAILY_RATE,
      employee2Days: employeeStats[1]?.workedDays || 0,
      employee2Pay: (employeeStats[1]?.workedDays || 0) * DAILY_RATE,
      employee3Days: employeeStats[2]?.workedDays || 0,
      employee3Pay: (employeeStats[2]?.workedDays || 0) * DAILY_RATE,
      employee4Days: employeeStats[3]?.workedDays || 0,
      employee4Pay: (employeeStats[3]?.workedDays || 0) * DAILY_RATE,
      employee5Days: employeeStats[4]?.workedDays || 0,
      employee5Pay: (employeeStats[4]?.workedDays || 0) * DAILY_RATE,
      totalSubs,
      subsPay,
      notes: '',
      grandTotal
    });
  });
  
  return totals.sort((a, b) => a.period - b.period);
}

export async function authenticateEmployee(email: string, password: string): Promise<Employee | null> {
  const employees = await getEmployees();
  const employee = employees.find(emp => emp.email === email);
  
  if (!employee) return null;
  
  const isValid = await bcrypt.compare(password, employee.password);
  return isValid ? employee : null;
} 