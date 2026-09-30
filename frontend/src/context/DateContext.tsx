import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, addDays, subDays, parseISO, differenceInCalendarDays } from 'date-fns';
import { useAuth } from './AuthContext';

interface DateContextType {
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  formattedDisplayDate: string; // e.g. "01 October 2026"
  dayName: string; // e.g. "Thursday"
  arcDayNumber: number; // 1 to 99
  totalArcDays: number;
  daysLeftToGate: number;
  isToday: boolean;
  goToToday: () => void;
  goToNextDay: () => void;
  goToPrevDay: () => void;
  jumpToArcDay: (dayNum: number) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const startDateStr = user?.startDate || '2026-10-01';
  const examDateStr = user?.examDate || '2027-02-06';

  // Default initial date to start date or today
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    // If today is within or near arc, use today, otherwise default to '2026-10-01'
    return today >= '2026-10-01' && today <= '2027-02-15' ? today : '2026-10-01';
  });

  const currentDateObj = parseISO(selectedDate);
  const startObj = parseISO(startDateStr);
  const examObj = parseISO(examDateStr);

  const arcDayNumber = Math.max(1, differenceInCalendarDays(currentDateObj, startObj) + 1);
  const totalArcDays = 99;
  const daysLeftToGate = Math.max(0, differenceInCalendarDays(examObj, currentDateObj));

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isToday = selectedDate === todayStr;

  const formattedDisplayDate = format(currentDateObj, 'dd MMMM yyyy');
  const dayName = format(currentDateObj, 'EEEE');

  const goToToday = () => {
    setSelectedDate(todayStr >= '2026-10-01' && todayStr <= '2027-02-15' ? todayStr : '2026-10-01');
  };

  const goToNextDay = () => {
    const next = addDays(parseISO(selectedDate), 1);
    setSelectedDate(format(next, 'yyyy-MM-dd'));
  };

  const goToPrevDay = () => {
    const prev = subDays(parseISO(selectedDate), 1);
    setSelectedDate(format(prev, 'yyyy-MM-dd'));
  };

  const jumpToArcDay = (dayNum: number) => {
    const target = addDays(parseISO(startDateStr), dayNum - 1);
    setSelectedDate(format(target, 'yyyy-MM-dd'));
  };

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        formattedDisplayDate,
        dayName,
        arcDayNumber,
        totalArcDays,
        daysLeftToGate,
        isToday,
        goToToday,
        goToNextDay,
        goToPrevDay,
        jumpToArcDay,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useArcDate = () => {
  const context = useContext(DateContext);
  if (!context) throw new Error('useArcDate must be used within a DateProvider');
  return context;
};
