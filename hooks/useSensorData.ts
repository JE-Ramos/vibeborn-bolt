import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import { Accelerometer, LightSensor } from 'expo-sensors';
import { useColorScheme } from 'react-native';
import { SensorData } from '@/types/sensorData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    location: null,
    batteryLevel: null,
    lightLevel: null,
    accelerometer: null,
    colorScheme: null,
    timestamp: null,
    timezone: null,
  });
  
  const [isCollecting, setIsCollecting] = useState(false);
  const dataCollectionSettings = useSelector((state: RootState) => state.settings.dataCollection);
  const colorScheme = useColorScheme();
  
  // Start collecting sensor data
  const startCollecting = async () => {
    setIsCollecting(true);
    
    // Get location if enabled
    if (dataCollectionSettings.location) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          updateSensorData('location', {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error) {
        console.log('Error getting location:', error);
      }
    }
    
    // Get battery level if enabled
    if (dataCollectionSettings.batteryLevel) {
      try {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        updateSensorData('batteryLevel', batteryLevel);
      } catch (error) {
        console.log('Error getting battery level:', error);
      }
    }
    
    // Start light sensor if available and enabled
    if (dataCollectionSettings.lightSensor && LightSensor.isAvailableAsync()) {
      LightSensor.addListener(({ illuminance }) => {
        updateSensorData('lightLevel', illuminance);
      });
      LightSensor.setUpdateInterval(1000);
    }
    
    // Start accelerometer if enabled
    if (dataCollectionSettings.motionData) {
      Accelerometer.addListener(accelerometerData => {
        updateSensorData('accelerometer', accelerometerData);
      });
      Accelerometer.setUpdateInterval(500);
    }
    
    // Get color scheme
    updateSensorData('colorScheme', colorScheme);
    
    // Get timestamp and timezone
    const now = new Date();
    updateSensorData('timestamp', now.toISOString());
    updateSensorData('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
  };
  
  // Stop collecting sensor data
  const stopCollecting = () => {
    setIsCollecting(false);
    LightSensor.removeAllListeners();
    Accelerometer.removeAllListeners();
  };
  
  // Update a specific sensor data value
  const updateSensorData = (key: keyof SensorData, value: any) => {
    setSensorData(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  // Clean up listeners when component unmounts
  useEffect(() => {
    return () => {
      if (isCollecting) {
        stopCollecting();
      }
    };
  }, [isCollecting]);
  
  return {
    sensorData,
    startCollecting,
    stopCollecting,
    isCollecting,
  };
};