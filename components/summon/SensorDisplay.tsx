import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SensorData } from '@/types/sensorData';
import { COLORS } from '@/constants/Colors';
import { MapPin, Battery, Sun, Compass, Clock } from 'lucide-react-native';

interface SensorDisplayProps {
  sensorData: SensorData;
}

export const SensorDisplay: React.FC<SensorDisplayProps> = ({ sensorData }) => {
  const formatCoordinate = (coord: number | undefined) => {
    if (coord === undefined) return 'N/A';
    return coord.toFixed(4);
  };
  
  const formatBattery = (level: number | null) => {
    if (level === null) return 'N/A';
    return `${Math.round(level * 100)}%`;
  };
  
  const formatLightLevel = (level: number | null) => {
    if (level === null) return 'N/A';
    return level.toFixed(1);
  };
  
  const formatMotion = (data: { x: number; y: number; z: number } | null) => {
    if (!data) return 'N/A';
    return `x:${data.x.toFixed(1)} y:${data.y.toFixed(1)} z:${data.z.toFixed(1)}`;
  };
  
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.sensorItem}>
          <MapPin size={16} color={COLORS.text.secondary} />
          <Text style={styles.sensorLabel}>Location</Text>
          <Text style={styles.sensorValue}>
            {sensorData.location 
              ? `${formatCoordinate(sensorData.location.latitude)}, ${formatCoordinate(sensorData.location.longitude)}`
              : 'Collecting...'}
          </Text>
        </View>
        
        <View style={styles.sensorItem}>
          <Battery size={16} color={COLORS.text.secondary} />
          <Text style={styles.sensorLabel}>Battery</Text>
          <Text style={styles.sensorValue}>
            {formatBattery(sensorData.batteryLevel)}
          </Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.sensorItem}>
          <Sun size={16} color={COLORS.text.secondary} />
          <Text style={styles.sensorLabel}>Light</Text>
          <Text style={styles.sensorValue}>
            {formatLightLevel(sensorData.lightLevel)}
          </Text>
        </View>
        
        <View style={styles.sensorItem}>
          <Compass size={16} color={COLORS.text.secondary} />
          <Text style={styles.sensorLabel}>Motion</Text>
          <Text style={styles.sensorValue}>
            {formatMotion(sensorData.accelerometer)}
          </Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.sensorItem}>
          <Clock size={16} color={COLORS.text.secondary} />
          <Text style={styles.sensorLabel}>Time</Text>
          <Text style={styles.sensorValue}>
            {formatTimestamp(sensorData.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -120,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sensorItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginHorizontal: 4,
  },
  sensorLabel: {
    fontFamily: 'CaslonAntique',
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  sensorValue: {
    fontFamily: 'CaslonAntique',
    fontSize: 12,
    color: COLORS.text.primary,
  },
});