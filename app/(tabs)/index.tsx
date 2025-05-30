import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { addSummon } from '@/store/slices/summonSlice';
import { useSensorData } from '@/hooks/useSensorData';
import { SummonCircle } from '@/components/summon/SummonCircle';
import { SensorDisplay } from '@/components/summon/SensorDisplay';
import { ParticleBackground } from '@/components/common/ParticleBackground';
import { generateCreature } from '@/utils/creatureGenerator';
import { useVibeWorld } from '@/contexts/VibeWorldContext';
import { COLORS } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SummonScreen() {
  const dispatch = useDispatch();
  const [ritualState, setRitualState] = useState<'idle' | 'collecting' | 'summoning' | 'complete'>('idle');
  const { sensorData, startCollecting, stopCollecting } = useSensorData();
  const { currentWorldState, worldStateInfo } = useVibeWorld();
  const worldColors = COLORS.worldStates[currentWorldState];
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const handleStartRitual = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRitualState('collecting');
    startCollecting();
    
    // Animate the circle
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // After 5 seconds, move to summoning state
    setTimeout(() => {
      setRitualState('summoning');
      stopCollecting();
      
      // Mock summoning process
      setTimeout(async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Generate creature based on sensor data
        const creature = await generateCreature(sensorData, currentWorldState);
        
        // Add to redux store
        dispatch(addSummon(creature));
        
        setRitualState('complete');
      }, 3000);
    }, 5000);
  };
  
  const resetRitual = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRitualState('idle');
  };
  
  return (
    <LinearGradient
      colors={[worldColors.background, worldColors.backgroundDark]}
      style={styles.container}
    >
      <ParticleBackground worldState={currentWorldState} />
      
      <SafeAreaView style={styles.content}>
        <Animated.View 
          style={[
            styles.headerContainer, 
            { opacity: fadeAnim }
          ]}
        >
          <BlurView intensity={30} tint="dark" style={styles.headerBlur}>
            <Text style={styles.title}>VibeBorn</Text>
            <Text style={styles.subtitle}>
              Current Vibe: <Text style={[styles.worldState, { color: worldColors.accent }]}>
                {worldStateInfo.name}
              </Text>
            </Text>
          </BlurView>
        </Animated.View>
        
        <View style={styles.circleContainer}>
          <Animated.View style={[
            styles.animatedCircle,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }
          ]}>
            <SummonCircle 
              ritualState={ritualState} 
              worldState={currentWorldState}
            />
          </Animated.View>
          
          {ritualState === 'collecting' && (
            <SensorDisplay sensorData={sensorData} />
          )}
          
          {ritualState === 'summoning' && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={worldColors.accent} />
              <Text style={styles.loadingText}>Forming sigil...</Text>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          {ritualState === 'idle' && (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: worldColors.accent }]}
              onPress={handleStartRitual}
            >
              <Text style={styles.buttonText}>Begin Ritual</Text>
            </TouchableOpacity>
          )}
          
          {ritualState === 'complete' && (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: worldColors.accent }]}
              onPress={resetRitual}
            >
              <Text style={styles.buttonText}>New Ritual</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerBlur: {
    padding: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Supernatural',
    fontSize: 36,
    color: COLORS.text.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  worldState: {
    fontWeight: 'bold',
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  animatedCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.primary,
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'CaslonAntique',
    fontSize: 18,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
});