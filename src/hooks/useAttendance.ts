import { useState, useEffect } from 'react';
import { AttendanceRow, Employee } from '../types';
import { getAttendance, getEmployees } from '../api/sheets';

export function useAttendance() {
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [attendanceData, employeesData] = await Promise.all([
          getAttendance(),
          getEmployees()
        ]);
        setAttendance(attendanceData);
        setEmployees(employeesData);
        setError(null);
      } catch (err) {
        setError('שגיאה בטעינת הנתונים');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    attendance,
    employees,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      const fetchData = async () => {
        try {
          const [attendanceData, employeesData] = await Promise.all([
            getAttendance(),
            getEmployees()
          ]);
          setAttendance(attendanceData);
          setEmployees(employeesData);
          setError(null);
        } catch (err) {
          setError('שגיאה בטעינת הנתונים');
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };
} 