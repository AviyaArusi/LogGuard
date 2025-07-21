import { useState, useEffect } from 'react';
import { TotalsRow, AttendanceRow, Employee } from '../types';
import { getTotals, calcTotalsLocally } from '../api/sheets';

export function useTotals(attendance: AttendanceRow[], employees: Employee[]) {
  const [totals, setTotals] = useState<TotalsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        setLoading(true);
        const totalsData = await getTotals();
        setTotals(totalsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching totals from API, calculating locally:', err);
        // Fallback to local calculation
        const localTotals = calcTotalsLocally(attendance, employees);
        setTotals(localTotals);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    if (attendance.length > 0 && employees.length > 0) {
      fetchTotals();
    }
  }, [attendance, employees]);

  const recalculateTotals = () => {
    const localTotals = calcTotalsLocally(attendance, employees);
    setTotals(localTotals);
  };

  return {
    totals,
    loading,
    error,
    recalculateTotals
  };
} 