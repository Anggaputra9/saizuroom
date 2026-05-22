/**
 * Utility functions untuk konversi dan validasi waktu
 */

/**
 * Convert HH:mm format to minutes from midnight
 * @param time Time in HH:mm format
 * @returns Minutes from midnight
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes from midnight to HH:mm format
 * @param minutes Minutes from midnight
 * @returns Time in HH:mm format
 */
export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * Validate if time is within range
 * @param time Time to check in HH:mm format
 * @param minTime Minimum time in HH:mm format
 * @param maxTime Maximum time in HH:mm format
 * @returns True if time is within range
 */
export const isTimeInRange = (time: string, minTime: string, maxTime: string): boolean => {
  const timeMinutes = timeToMinutes(time);
  const minMinutes = timeToMinutes(minTime);
  const maxMinutes = timeToMinutes(maxTime);
  return timeMinutes >= minMinutes && timeMinutes <= maxMinutes;
};

/**
 * Validate if time range is valid (start < end)
 * @param startTime Start time in HH:mm format
 * @param endTime End time in HH:mm format
 * @returns True if start time is before end time
 */
export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  return timeToMinutes(startTime) < timeToMinutes(endTime);
};

/**
 * Check if two time ranges overlap
 * @param start1 Start time of first range
 * @param end1 End time of first range
 * @param start2 Start time of second range
 * @param end2 End time of second range
 * @returns True if ranges overlap
 */
export const doTimeRangesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  
  return s1 < e2 && e1 > s2;
};
