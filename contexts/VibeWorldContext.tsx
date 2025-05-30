import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WorldState, WorldStateInfo } from '@/types/vibeWorld';

// Define context value type
interface VibeWorldContextType {
  currentWorldState: WorldState;
  worldStateInfo: WorldStateInfo;
  changeWorldState: (state: WorldState) => void;
}

// World state information
const worldStateInfoMap: Record<WorldState, WorldStateInfo> = {
  WhisperFog: {
    name: 'Whisper Fog',
    description: 'The veil between worlds is thin, spectral energies drift through the mundane.',
    rarity: {
      Common: 0.5,
      Uncommon: 0.3,
      Rare: 0.15,
      Epic: 0.04,
      Legendary: 0.01,
    },
    affinity: ['ethereal', 'spectral', 'mist'],
  },
  SignalStorm: {
    name: 'Signal Storm',
    description: 'Digital energies surge through reality, creating fluctuations in electromagnetic fields.',
    rarity: {
      Common: 0.35,
      Uncommon: 0.35,
      Rare: 0.2,
      Epic: 0.08,
      Legendary: 0.02,
    },
    affinity: ['electric', 'technological', 'storm'],
  },
  VoidTide: {
    name: 'Void Tide',
    description: 'The cosmic depths rise, stars flicker as ancient entities drift closer to our realm.',
    rarity: {
      Common: 0.25,
      Uncommon: 0.3,
      Rare: 0.25,
      Epic: 0.15,
      Legendary: 0.05,
    },
    affinity: ['cosmic', 'void', 'deep'],
  },
  EchoRift: {
    name: 'Echo Rift',
    description: 'Time fractures, allowing echoes from past and future to bleed into the present.',
    rarity: {
      Common: 0.2,
      Uncommon: 0.25,
      Rare: 0.3,
      Epic: 0.18,
      Legendary: 0.07,
    },
    affinity: ['time', 'distortion', 'echo'],
  },
};

// Create the context
const VibeWorldContext = createContext<VibeWorldContextType | undefined>(undefined);

// Provider component
export const VibeWorldProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentWorldState, setCurrentWorldState] = useState<WorldState>('WhisperFog');
  
  // Get world state info
  const worldStateInfo = worldStateInfoMap[currentWorldState];
  
  // Function to change world state
  const changeWorldState = (state: WorldState) => {
    setCurrentWorldState(state);
  };
  
  // Auto-change world state based on time of day (for demonstration)
  useEffect(() => {
    // Change world state every 6 hours based on time of day
    const determineWorldState = (): WorldState => {
      const hour = new Date().getHours();
      
      if (hour >= 0 && hour < 6) {
        return 'EchoRift';
      } else if (hour >= 6 && hour < 12) {
        return 'WhisperFog';
      } else if (hour >= 12 && hour < 18) {
        return 'SignalStorm';
      } else {
        return 'VoidTide';
      }
    };
    
    const initialState = determineWorldState();
    setCurrentWorldState(initialState);
    
    // Check for world state changes every hour
    const interval = setInterval(() => {
      const newState = determineWorldState();
      if (newState !== currentWorldState) {
        setCurrentWorldState(newState);
      }
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <VibeWorldContext.Provider value={{ currentWorldState, worldStateInfo, changeWorldState }}>
      {children}
    </VibeWorldContext.Provider>
  );
};

// Hook for using the VibeWorld context
export const useVibeWorld = (): VibeWorldContextType => {
  const context = useContext(VibeWorldContext);
  if (context === undefined) {
    throw new Error('useVibeWorld must be used within a VibeWorldProvider');
  }
  return context;
};