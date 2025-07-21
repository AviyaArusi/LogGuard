import React from 'react';
import { useAuth } from '../auth/useAuth';
import { useAttendance } from '../hooks/useAttendance';
import { useTotals } from '../hooks/useTotals';
import { TotalsCard } from '../components/TotalsCard';
import { Loader } from '../components/Loader';
import { WorkCalendar } from '../components/WorkCalendar';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { attendance, employees, loading, error } = useAttendance();
  const { totals, loading: totalsLoading } = useTotals(attendance, employees);

  const handleLogout = () => {
    logout();
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

  const employeeIndex = employees.findIndex(emp => emp.email === user?.email);
  const currentEmployee = employees[employeeIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">LG - מערכת ניהול עובדים</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">שלום, {user?.fullName}</span>
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
            {currentEmployee && (
              <WorkCalendar
                attendance={attendance}
                employee={currentEmployee}
                employeeIndex={employeeIndex}
              />
            )}
            <div className="space-y-6">
              {totalsLoading ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <Loader />
                </div>
              ) : (
                <TotalsCard totals={totals} employeeIndex={employeeIndex} employeeName={currentEmployee.fullName} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 