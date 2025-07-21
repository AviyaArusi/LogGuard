import React from 'react';
import { AttendanceRow, AttendanceStats, Employee } from '../types';
import { formatDate } from '../utils/date';

interface AttendanceTableProps {
  attendance: AttendanceRow[];
  employee: Employee;
  employeeIndex: number;
}

export function AttendanceTable({ attendance, employee, employeeIndex }: AttendanceTableProps) {
  const employeeKey = `employee${employeeIndex + 1}` as keyof AttendanceRow;

  // Filter only rows where this employee has a value (worked, absent, substitute)
  const filteredAttendance = attendance.filter(row => row[employeeKey]);

  const stats: AttendanceStats = filteredAttendance.reduce((acc, row) => {
    const value = row[employeeKey];
    if (value === 'V') acc.workedDays++;
    else if (value === 'X') acc.absentDays++;
    else if (value && value !== '') acc.substitutedDays++;
    return acc;
  }, { workedDays: 0, absentDays: 0, substitutedDays: 0, totalDays: 0 });

  stats.totalDays = stats.workedDays + stats.absentDays + stats.substitutedDays;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'V': return 'bg-green-100 text-green-800';
      case 'X': return 'bg-red-100 text-red-800';
      default: return status ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'V': return 'עבד';
      case 'X': return 'לא הגיע';
      default: return status || 'לא רשום';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-right">נוכחות - {employee.fullName}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.workedDays}</div>
          <div className="text-sm text-green-700">ימי עבודה</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{stats.absentDays}</div>
          <div className="text-sm text-red-700">ימי היעדרות</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.substitutedDays}</div>
          <div className="text-sm text-blue-700">ימי מחליף</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.totalDays}</div>
          <div className="text-sm text-gray-700">סה"כ ימים</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-right border-b">תאריך</th>
              <th className="px-4 py-2 text-right border-b">סטטוס</th>
              <th className="px-4 py-2 text-right border-b">תקופה</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-right border-b">{formatDate(row.date)}</td>
                <td className="px-4 py-2 text-right border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row[employeeKey])}`}>
                    {getStatusText(row[employeeKey])}
                  </span>
                </td>
                <td className="px-4 py-2 text-right border-b">{row.periodId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 