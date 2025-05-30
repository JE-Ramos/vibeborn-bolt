/**
 * Generate a unique ID string
 */
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Get timestamp in a human-readable format
 */
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

/**
 * Format coordinates to a readable string
 */
export const formatCoordinates = (
  latitude: number | undefined,
  longitude: number | undefined
): string => {
  if (latitude === undefined || longitude === undefined) {
    return 'Unknown location';
  }
  
  return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
};

/**
 * Delay execution for a specified time
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Get a color with specified opacity
 */
export const colorWithOpacity = (hexColor: string, opacity: number): string => {
  // Convert hex to rgb
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};