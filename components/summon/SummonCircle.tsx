import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { WorldState } from '@/types/vibeWorld';
import { COLORS } from '@/constants/Colors';
import Svg, { Circle, Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';

interface SummonCircleProps {
  ritualState: 'idle' | 'collecting' | 'summoning' | 'complete';
  worldState: WorldState;
}

export const SummonCircle: React.FC<SummonCircleProps> = ({ ritualState, worldState }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.95)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const worldColors = COLORS.worldStates[worldState];
  
  useEffect(() => {
    if (ritualState === 'idle') {
      // Slow rotation when idle
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 30000,
          useNativeDriver: true,
        })
      ).start();
      
      // Subtle pulse when idle
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // No glow when idle
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else if (ritualState === 'collecting') {
      // Faster rotation when collecting
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        })
      ).start();
      
      // More pronounced pulse when collecting
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.9,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Medium glow when collecting
      Animated.timing(glowAnim, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else if (ritualState === 'summoning') {
      // Very fast rotation when summoning
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        })
      ).start();
      
      // Intense pulse when summoning
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Strong glow when summoning
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else if (ritualState === 'complete') {
      // Stop rotation when complete
      rotateAnim.stopAnimation();
      
      // Stable size when complete
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Fade out glow when complete
      Animated.timing(glowAnim, {
        toValue: 0.2,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
    
    return () => {
      // Clean up animations
      rotateAnim.stopAnimation();
      pulseAnim.stopAnimation();
      glowAnim.stopAnimation();
    };
  }, [ritualState, rotateAnim, pulseAnim, glowAnim]);
  
  // Interpolate rotation for animation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const innerRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });
  
  return (
    <View style={styles.container}>
      {/* Glow effect */}
      <Animated.View 
        style={[
          styles.glowContainer, 
          { 
            opacity: glowAnim,
            transform: [{ scale: pulseAnim }] 
          }
        ]}
      >
        <View 
          style={[
            styles.glow, 
            { 
              backgroundColor: worldColors.accent,
              shadowColor: worldColors.accent,
            }
          ]} 
        />
      </Animated.View>
      
      {/* Outer circle */}
      <Animated.View 
        style={[
          styles.circleContainer, 
          { 
            transform: [
              { rotate },
              { scale: pulseAnim }
            ] 
          }
        ]}
      >
        <Svg width={300} height={300} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <Stop offset="0%" stopColor={worldColors.accent} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={worldColors.accent} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          
          {/* Background glow */}
          <Circle cx="50" cy="50" r="48" fill="url(#grad)" />
          
          {/* Outer circle */}
          <Circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke={worldColors.accent} 
            strokeWidth="0.5"
            fill="none"
          />
          
          {/* Runic symbols on outer circle */}
          <G>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const x = 50 + 45 * Math.cos(angle);
              const y = 50 + 45 * Math.sin(angle);
              
              return (
                <Circle 
                  key={`outer-dot-${i}`}
                  cx={x} 
                  cy={y} 
                  r="1" 
                  fill={worldColors.accent} 
                />
              );
            })}
          </G>
          
          {/* Runic patterns */}
          <Path 
            d="M32,32 L68,68 M32,68 L68,32 M50,25 L50,75 M25,50 L75,50" 
            stroke={worldColors.accent} 
            strokeWidth="0.5" 
            strokeOpacity="0.6"
          />
          
          <Circle 
            cx="50" 
            cy="50" 
            r="35" 
            stroke={worldColors.accent} 
            strokeWidth="0.5"
            fill="none"
          />
        </Svg>
      </Animated.View>
      
      {/* Inner circle (rotating in opposite direction) */}
      <Animated.View 
        style={[
          styles.innerCircleContainer, 
          { 
            transform: [
              { rotate: innerRotate },
              { scale: pulseAnim }
            ] 
          }
        ]}
      >
        <Svg width={200} height={200} viewBox="0 0 100 100">
          <Circle 
            cx="50" 
            cy="50" 
            r="40" 
            stroke={worldColors.accent} 
            strokeWidth="0.5"
            fill="none"
          />
          
          {/* Inner symbols */}
          <Path 
            d="M50,20 L50,80 M20,50 L80,50 M35,35 L65,65 M35,65 L65,35" 
            stroke={worldColors.accent} 
            strokeWidth="0.5"
            strokeOpacity="0.8"
          />
          
          <Circle 
            cx="50" 
            cy="50" 
            r="25" 
            stroke={worldColors.accent} 
            strokeWidth="0.5"
            fill="none"
          />
          
          <Circle 
            cx="50" 
            cy="50" 
            r="15" 
            stroke={worldColors.accent} 
            strokeWidth="0.5"
            fill={worldColors.accent}
            fillOpacity="0.2"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
  },
  glowContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 10,
  },
  circleContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircleContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});