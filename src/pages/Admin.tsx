import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { useAttendance } from '../hooks/useAttendance';
import { useTotals } from '../hooks/useTotals';
import { AttendanceTable } from '../components/AttendanceTable';
import { TotalsCard } from '../components/TotalsCard';
import { Loader } from '../components/Loader';
import { appendAttendance } from '../api/sheets';
import { getPeriodId } from '../utils/date';

export function Admin() {
  const { user, logout } = useAuth();
  const { attendance, employees, loading, error, refetch } = useAttendance();
  const { totals, loading: totalsLoading, recalculateTotals } = useTotals(attendance, employees);
  
  const [newAttendance, setNewAttendance] = useState({
    date: '',
    employee1: '',
    employee2: '',
    employee3: '',
    employee4: '',
    employee5: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const attendanceData = {
        ...newAttendance,
        periodId: getPeriodId(newAttendance.date)
      };

      const success = await appendAttendance(attendanceData);
      if (success) {
        setNewAttendance({
          date: '',
          employee1: '',
          employee2: '',
          employee3: '',
          employee4: '',
          employee5: ''
        });
        refetch();
        recalculateTotals();
      }
    } catch (error) {
      console.error('Error adding attendance:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">LG - ניהול מערכת</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">מנהל: {user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                התנתק
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-right">הוספת נוכחות חדשה</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right">תאריך</label>
                    <input
                      type="date"
                      required
                      value={newAttendance.date}
                      onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {employees.map((employee, index) => (
                    <div key={employee.email}>
                      <label className="block text-sm font-medium text-gray-700 text-right">
                        {employee.fullName}
                      </label>
                      <select
                        required
                        value={newAttendance[`employee${index + 1}` as keyof typeof newAttendance]}
                        onChange={(e) => setNewAttendance({ 
                          ...newAttendance, 
                          [`employee${index + 1}` as keyof typeof newAttendance]: e.target.value 
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">בחר סטטוס</option>
                        <option value="V">עבד</option>
                        <option value="X">לא הגיע</option>
                        <option value="מחליף">מחליף</option>
                      </select>
                    </div>
                  ))}
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? <Loader size="sm" /> : 'הוסף נוכחות'}
                  </button>
                </form>
              </div>

              {employees.map((employee, index) => (
                <AttendanceTable
                  key={employee.email}
                  attendance={attendance}
                  employeeIndex={index}
                  employeeName={employee.fullName}
                />
              ))}
            </div>
            
            <div className="space-y-6">
              {totalsLoading ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <Loader />
                </div>
              ) : (
                <TotalsCard totals={totals} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 