import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  highlightedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}
const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  highlightedDates = [],
  minDate,
  maxDate,
  className = ''
}) => {
  // If no value is provided, default to current date
  const [currentDate, setCurrentDate] = useState<Date>(value || new Date());
  // Get current month and year
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  // Get first day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Get days from previous month to fill the first week
  const daysFromPrevMonth = startDayOfWeek;
  // Get days for next month to fill the last week
  const totalCells = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;
  const daysFromNextMonth = totalCells - (daysInMonth + daysFromPrevMonth);
  // Get previous month days
  const prevMonthDays = new Date(year, month, 0).getDate();
  // Format month name
  const monthName = new Intl.DateTimeFormat('en-US', {
    month: 'long'
  }).format(new Date(year, month));
  // Days of week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  // Check if a date is highlighted
  const isHighlighted = (date: Date) => {
    return highlightedDates.some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());
  };
  // Check if a date is the selected date
  const isSelected = (date: Date) => {
    return value && date.getDate() === value.getDate() && date.getMonth() === value.getMonth() && date.getFullYear() === value.getFullYear();
  };
  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };
  // Check if a date is disabled
  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };
  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return;
    if (onChange) {
      onChange(date);
    }
  };
  // Generate calendar grid
  const generateCalendarGrid = () => {
    const calendarCells = [];
    // Previous month days
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      const date = new Date(year, month - 1, i);
      calendarCells.push({
        date,
        dayNumber: i,
        isCurrentMonth: false
      });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      calendarCells.push({
        date,
        dayNumber: i,
        isCurrentMonth: true
      });
    }
    // Next month days
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      calendarCells.push({
        date,
        dayNumber: i,
        isCurrentMonth: false
      });
    }
    return calendarCells;
  };
  const calendarGrid = generateCalendarGrid();
  return <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {monthName} {year}
          </h2>
          <div className="flex space-x-1">
            <button onClick={goToPreviousMonth} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors" aria-label="Previous month">
              <ChevronLeftIcon size={16} />
            </button>
            <button onClick={goToNextMonth} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors" aria-label="Next month">
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {daysOfWeek.map(day => <div key={day} className="text-center text-sm font-medium text-gray-700 py-2">
              {day}
            </div>)}
          {/* Calendar cells */}
          {calendarGrid.map((cell, index) => {
          const isDateHighlighted = isHighlighted(cell.date);
          const isDateSelected = isSelected(cell.date);
          const isDateToday = isToday(cell.date);
          const isDateDisabled = isDisabled(cell.date);
          return <button key={index} onClick={() => handleDateClick(cell.date)} disabled={isDateDisabled} className={`
                  h-10 w-full flex items-center justify-center rounded-md text-sm font-medium
                  ${!cell.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                  ${isDateToday && !isDateSelected ? 'border border-teal-500' : ''}
                  ${isDateSelected ? 'bg-teal-600 text-white hover:bg-teal-700' : 'hover:bg-gray-100'}
                  ${isDateHighlighted && !isDateSelected ? 'bg-teal-100 text-teal-800' : ''}
                  ${isDateDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  transition-colors
                `}>
                {cell.dayNumber}
              </button>;
        })}
        </div>
      </div>
    </div>;
};
export default Calendar;