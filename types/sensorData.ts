/**
 * Sensor data collected during summon ritual
 */
export interface SensorData {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  batteryLevel: number | null;
  lightLevel: number | null;
  accelerometer: {
    x: number;
    y: number;
    z: number;
  } | null;
  colorScheme: string | null;
  timestamp: string | null;
  timezone: string | null;
}