export interface Employee {
  email: string;
  fullName: string;
  password: string;
}

export interface AttendanceRow {
  date: string;
  employee1: string;
  employee2: string;
  employee3: string;
  employee4: string;
  employee5: string;
  periodId: number;
}

export interface TotalsRow {
  period: number;
  employee1Days: number;
  employee1Pay: number;
  employee2Days: number;
  employee2Pay: number;
  employee3Days: number;
  employee3Pay: number;
  employee4Days: number;
  employee4Pay: number;
  employee5Days: number;
  employee5Pay: number;
  totalSubs: number;
  subsPay: number;
  notes: string;
  grandTotal: number;
}

export interface AttendanceStats {
  workedDays: number;
  absentDays: number;
  substitutedDays: number;
  totalDays: number;
}

export interface AuthContextType {
  user: Employee | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
} 