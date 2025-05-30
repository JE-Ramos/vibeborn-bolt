import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { WorldState } from '@/types/vibeWorld';
import { COLORS } from '@/constants/Colors';

interface ParticleProps {
  worldState: WorldState;
}

interface Particle {
  position: Animated.ValueXY;
  opacity: Animated.Value;
  scale: Animated.Value;
  speed: number;
  size: number;
}

const { width, height } = Dimensions.get('window');

export const ParticleBackground: React.FC<ParticleProps> = ({ worldState }) => {
  const particles = useRef<Particle[]>([]);
  const worldColors = COLORS.worldStates[worldState];
  
  // Create particles
  useEffect(() => {
    // Clear previous particles
    particles.current = [];
    
    // Create new particles
    for (let i = 0; i < 20; i++) {
      const position = new Animated.ValueXY({
        x: Math.random() * width,
        y: Math.random() * height,
      });
      
      const opacity = new Animated.Value(Math.random() * 0.5 + 0.1);
      const scale = new Animated.Value(Math.random() * 0.5 + 0.5);
      const speed = Math.random() * 100 + 50;
      const size = Math.random() * 6 + 2;
      
      particles.current.push({
        position,
        opacity,
        scale,
        speed,
        size,
      });
    }
    
    // Animate particles
    animateParticles();
    
    return () => {
      // Cleanup animations
      particles.current.forEach(particle => {
        particle.position.stopAnimation();
        particle.opacity.stopAnimation();
        particle.scale.stopAnimation();
      });
    };
  }, [worldState]);
  
  const animateParticles = () => {
    particles.current.forEach(particle => {
      // Position animation
      Animated.loop(
        Animated.timing(particle.position, {
          toValue: {
            x: Math.random() * width,
            y: Math.random() * height,
          },
          duration: 10000 / particle.speed * 100,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
      
      // Opacity animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.opacity, {
            toValue: Math.random() * 0.5 + 0.1,
            duration: Math.random() * 2000 + 1000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: Math.random() * 0.3 + 0.05,
            duration: Math.random() * 2000 + 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Scale animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: Math.random() * 0.5 + 0.5,
            duration: Math.random() * 2000 + 1000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: Math.random() * 0.3 + 0.3,
            duration: Math.random() * 2000 + 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };
  
  return (
    <View style={styles.container}>
      {particles.current.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
              backgroundColor: worldColors.accent,
              opacity: particle.opacity,
              transform: [
                { translateX: particle.position.x },
                { translateY: particle.position.y },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
  },
});