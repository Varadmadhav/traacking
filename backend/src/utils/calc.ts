export function calculateSleepMinutes(sleptAt: string, wokeUpAt: string): number {
  if (!sleptAt || !wokeUpAt) return 0;

  const parseTime = (str: string): number => {
    // str can be "23:45" or "11:45 PM" or "12:07 AM"
    const cleaned = str.trim().toUpperCase();
    const isPM = cleaned.includes('PM');
    const isAM = cleaned.includes('AM');
    const timeOnly = cleaned.replace(/[AP]M/, '').trim();
    const parts = timeOnly.split(':');
    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const sleepMin = parseTime(sleptAt);
  const wakeMin = parseTime(wokeUpAt);

  if (wakeMin >= sleepMin) {
    return wakeMin - sleepMin;
  } else {
    // Crossed midnight
    return (1440 - sleepMin) + wakeMin;
  }
}

export function formatMinutesToHoursMins(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
