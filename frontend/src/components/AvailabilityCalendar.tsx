import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Availability } from '../type';

interface AvailabilityCalendarProps {
  availabilities: Availability[];
  onUpdateAvailability: (availability: Availability) => void;
  readonly?: boolean;
}

const availabilityStates = {
  'available': { label: 'Disponible', color: 'bg-green-50 border-green-200 text-green-700' },
  'busy': { label: 'Un peu occupé', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  'unavailable': { label: 'Pas disponible', color: 'bg-red-50 border-red-200 text-red-700' }
};

type AvailabilityStatus = keyof typeof availabilityStates;

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  availabilities,
  onUpdateAvailability,
  readonly = false,
}) => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  const getNextSixMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() + i + 1);
      months.push(month.toISOString().substring(0, 7));
    }
    return months;
  };

  const getWeeksInMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01');
    const weeks = [];
    const month = date.getMonth();
    
    date.setDate(1);
    while (date.getMonth() === month) {
      weeks.push(new Date(date));
      date.setDate(date.getDate() + 7);
    }
    
    return weeks;
  };

  const getAvailabilityForMonth = (month: string): Availability | undefined => {
    return availabilities.find(a => a.month === month);
  };

  const handleMonthAvailabilityChange = (month: string, status: AvailabilityStatus) => {
    const weeksCount = getWeeksInMonth(month).length;
    onUpdateAvailability({
      id: month,
      month,
      status,
      weeks: Array(weeksCount).fill(status)
    });
  };

  const handleWeekAvailabilityChange = (month: string, weekIndex: number, status: AvailabilityStatus) => {
    const currentAvailability = getAvailabilityForMonth(month);
    const weeks = [...(currentAvailability?.weeks || Array(getWeeksInMonth(month).length).fill('available'))];
    weeks[weekIndex] = status;

    onUpdateAvailability({
      id: month,
      month,
      status: currentAvailability?.status || 'available',
      weeks
    });
  };

  return (
    <div className="space-y-4">
      {getNextSixMonths().map((month) => {
        const monthAvailability = getAvailabilityForMonth(month);
        const monthStatus = monthAvailability?.status || 'available';

        return (
          <div key={month} className="border rounded-lg overflow-hidden">
            <div 
              className={`p-4 ${availabilityStates[monthStatus].color} cursor-pointer`}
              onClick={() => !readonly && setExpandedMonth(expandedMonth === month ? null : month)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span className="font-medium">
                    {new Date(month).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {!readonly && (
                  <div className="flex items-center gap-2">
                    <select
                      value={monthStatus}
                      onChange={(e) => handleMonthAvailabilityChange(month, e.target.value as AvailabilityStatus)}
                      className="rounded border px-2 py-1 text-sm bg-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.entries(availabilityStates).map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {expandedMonth === month ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                )}
              </div>
            </div>

            {expandedMonth === month && (
              <div className="p-4 bg-white space-y-2">
                {getWeeksInMonth(month).map((weekStart, index) => {
                  const weekStatus = monthAvailability?.weeks?.[index] || monthStatus;
                  return (
                    <div key={index} className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm">
                        Semaine {index + 1} ({weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })})
                      </span>
                      {!readonly && (
                        <select
                          value={weekStatus}
                          onChange={(e) => handleWeekAvailabilityChange(month, index, e.target.value as AvailabilityStatus)}
                          className={`rounded px-2 py-1 text-sm ${availabilityStates[weekStatus].color}`}
                        >
                          {Object.entries(availabilityStates).map(([value, { label }]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};