import React from 'react';
import { TotalsRow } from '../types';
import { getPeriodStartDate, getPeriodEndDate } from '../utils/date';
import { format } from 'date-fns';

interface TotalsCardProps {
  totals: TotalsRow[];
  employeeIndex: number;
  employeeName: string;
}

export function TotalsCard({ totals, employeeIndex, employeeName }: TotalsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  // Map employee index to column keys
  const dayKey = `employee${employeeIndex + 1}Days` as keyof TotalsRow;
  const payKey = `employee${employeeIndex + 1}Pay` as keyof TotalsRow;

  const formatRange = (period: number) => {
    const start = getPeriodStartDate(period);
    const end = getPeriodEndDate(period);
    return `${format(new Date(start), 'dd/MM/yyyy')} - ${format(new Date(end), 'dd/MM/yyyy')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-right">סיכום תקופות - {employeeName}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-right border-b">תקופה</th>
              <th className="px-4 py-2 text-right border-b">טווח תאריכים</th>
              <th className="px-4 py-2 text-right border-b">ימים</th>
              <th className="px-4 py-2 text-right border-b">שכר</th>
            </tr>
          </thead>
          <tbody>
            {totals.map((row) => (
              <tr key={row.period} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-right border-b font-medium">{row.period}</td>
                <td className="px-4 py-2 text-right border-b">{formatRange(row.period)}</td>
                <td className="px-4 py-2 text-right border-b">{row[dayKey]}</td>
                <td className="px-4 py-2 text-right border-b">{formatCurrency(row[payKey] as number)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 