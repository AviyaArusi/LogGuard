import React, { useMemo, useState } from 'react';
import { Employee } from '../types';
import { parse, parseISO, isValid, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, addMonths } from 'date-fns';

interface WorkCalendarProps {
  attendance: any[][]; // 2D array: [header, ...rows]
  employeeIndex: number;
  employee: Employee;
}

const WEEK_DAYS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

export function WorkCalendar({ attendance, employee }: WorkCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const userName = employee.fullName.trim().normalize('NFC');

  // Find all dates where the user has 'V' (robust, using header row)
  const workedDates = useMemo(() => {
    if (!attendance || attendance.length < 2) return [];
    const headers = attendance[0];
    const rows = attendance.slice(1);
    const colIndex = headers.findIndex((h: string) => h.trim().normalize('NFC') === userName);
    if (colIndex === -1) return [];
    return rows
      .filter(row => row[colIndex] && row[colIndex].trim().toUpperCase() === 'V')
      .map(row => {
        let parsed = parseISO(row[0]);
        if (!isValid(parsed)) {
          parsed = parse(row[0], 'dd/MM/yyyy', new Date());
        }
        return isValid(parsed) ? format(parsed, 'yyyy-MM-dd') : null;
      })
      .filter((d): d is string => !!d);
  }, [attendance, userName]);

  // Calendar grid logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  for (let d = calendarStart; d <= calendarEnd; d = addDays(d, 1)) {
    days.push(d);
  }

  function isWorkDay(date: Date) {
    const calDate = format(date, 'yyyy-MM-dd');
    return workedDates.includes(calDate);
  }

  function prevMonth() {
    setCurrentMonth(prev => addMonths(prev, -1));
  }
  function nextMonth() {
    setCurrentMonth(prev => addMonths(prev, 1));
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors text-xl">◀</button>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight drop-shadow text-center">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors text-xl">▶</button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {WEEK_DAYS.map((d, i) => (
          <div key={i} className="font-bold text-green-700 text-lg tracking-wide">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isWorked = isWorkDay(day);
          return (
            <div
              key={i}
              data-testid={isWorked ? 'workday' : undefined}
              className={`h-12 w-12 flex items-center justify-center rounded-full text-lg select-none transition-all duration-200
                ${isCurrentMonth ? '' : 'text-gray-300'}
                ${isWorked ? 'bg-gradient-to-br from-green-400 to-green-600 text-white font-bold border-4 border-green-700 shadow-lg scale-110' : 'hover:bg-green-100'}
                ${!isWorked && isCurrentMonth ? 'cursor-pointer' : ''}`}
              title={isWorked ? 'יום עבודה' : ''}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-gray-600 text-right">ימים מסומנים בירוק = עבדת</div>
    </div>
  );
} 