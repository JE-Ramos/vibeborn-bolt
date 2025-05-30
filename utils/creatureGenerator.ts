import { Creature } from '@/types/creature';
import { SensorData } from '@/types/sensorData';
import { WorldState } from '@/types/vibeWorld';
import { COLORS } from '@/constants/Colors';
import { generateUniqueId } from './helpers';

// Sample images for testing
const sampleImages = {
  WhisperFog: [
    'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg',
    'https://images.pexels.com/photos/750225/pexels-photo-750225.jpeg',
    'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
  ],
  SignalStorm: [
    'https://images.pexels.com/photos/3889699/pexels-photo-3889699.jpeg',
    'https://images.pexels.com/photos/19397268/pexels-photo-19397268.jpeg',
    'https://images.pexels.com/photos/3550240/pexels-photo-3550240.jpeg',
  ],
  VoidTide: [
    'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg',
    'https://images.pexels.com/photos/957040/night-photograph-starry-sky-night-sky-957040.jpeg',
    'https://images.pexels.com/photos/4254895/pexels-photo-4254895.jpeg',
  ],
  EchoRift: [
    'https://images.pexels.com/photos/2098428/pexels-photo-2098428.jpeg',
    'https://images.pexels.com/photos/14674/pexels-photo-14674.jpeg',
    'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg',
  ],
};

// Names for each world state
const namesByWorldState = {
  WhisperFog: [
    'Mistral Wisp', 'Fogbringer', 'Veil Walker', 'Phantom Drifter', 'Shroud Weaver',
    'Echo Spirit', 'Mist Keeper', 'Veil Singer', 'Twilight Haunt', 'Whisper Strider'
  ],
  SignalStorm: [
    'Volt Harbinger', 'Static Flare', 'Surge Nexus', 'Arc Nomad', 'Pulse Weaver',
    'Storm Caller', 'Signal Wraith', 'Spark Hunter', 'Flux Guardian', 'Neon Seeker'
  ],
  VoidTide: [
    'Deep Lurker', 'Void Drifter', 'Abyss Watcher', 'Cosmic Tide', 'Star Devourer',
    'Night Caller', 'Void Dancer', 'Stellar Nomad', 'Dark Matter', 'Nebula Spirit'
  ],
  EchoRift: [
    'Chrono Shifter', 'Time Weaver', 'Echo Fragment', 'Rift Walker', 'Moment Keeper',
    'Paradox Spirit', 'Timeline Guard', 'Memory Drift', 'Temporal Shade', 'Fracture Being'
  ],
};

// Lore fragments
const loreFragments = {
  WhisperFog: [
    'Born from the ethereal mists that drift between worlds',
    'Whispers forgotten secrets to those who listen closely',
    'Can only be seen when the veil between worlds thins',
    'Feeds on echoes of memories left in abandoned places',
    'Appears most frequently during fog-shrouded dawns'
  ],
  SignalStorm: [
    'Formed from coalesced electromagnetic waves',
    'Can interfere with electronic devices when agitated',
    'Drawn to places with strong wireless signals',
    'Communicates through subtle electrical pulses',
    'Most active during thunderstorms and solar flares'
  ],
  VoidTide: [
    'A fragment of the cosmic void given form',
    'Emerged from a tear in the fabric of space',
    'Navigates using the gravitational pull of celestial bodies',
    'Most visible under starlit skies away from city lights',
    'Carries echoes of distant galaxies within its essence'
  ],
  EchoRift: [
    'Exists simultaneously across multiple timelines',
    'Can glimpse moments from both past and future',
    'Formed in places where time flows inconsistently',
    'Appears most clearly during temporal anomalies',
    'Collects fragments of history in its crystalline core'
  ],
};

// Attribute names by world state
const attributesByWorldState = {
  WhisperFog: ['Etherealness', 'Whispering', 'Concealment', 'Memory Absorption', 'Mist Control'],
  SignalStorm: ['Conductivity', 'Signal Strength', 'Disruption', 'Energy Storage', 'Frequency Control'],
  VoidTide: ['Cosmic Awareness', 'Void Manipulation', 'Gravity Distortion', 'Star Affinity', 'Space Folding'],
  EchoRift: ['Temporal Sight', 'Timeline Hopping', 'Memory Preservation', 'Paradox Resistance', 'Time Distortion'],
};

// Generate random creature based on sensor data and world state
export const generateCreature = async (
  sensorData: SensorData,
  worldState: WorldState
): Promise<Creature> => {
  // In a real app, this would call an AI service
  // For this demo, we'll generate mock data
  
  // Determine rarity based on sensor data and random chance
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  let rarityIndex = 0;
  
  // Use battery level to influence rarity (lower battery = higher chance of rarity)
  if (sensorData.batteryLevel !== null) {
    // Invert battery level (1 - level) to make lower battery = higher chance
    const batteryFactor = 1 - sensorData.batteryLevel;
    rarityIndex += Math.floor(batteryFactor * 2); // Can add up to 2 to rarity index
  }
  
  // Use light level to influence rarity (lower light = higher chance of rarity)
  if (sensorData.lightLevel !== null) {
    // Normalize and invert light level
    const normalizedLight = Math.min(sensorData.lightLevel / 1000, 1);
    const lightFactor = 1 - normalizedLight;
    rarityIndex += Math.floor(lightFactor * 1.5); // Can add up to 1.5 to rarity index
  }
  
  // Add random factor
  rarityIndex += Math.floor(Math.random() * 2);
  
  // Clamp to valid index
  rarityIndex = Math.min(rarityIndex, rarities.length - 1);
  
  const rarity = rarities[rarityIndex];
  
  // Get random name based on world state
  const names = namesByWorldState[worldState];
  const name = names[Math.floor(Math.random() * names.length)];
  
  // Generate attributes
  const attributeNames = attributesByWorldState[worldState];
  const attributes = attributeNames.map(attrName => ({
    name: attrName,
    value: Math.random() * 0.7 + 0.3, // Value between 0.3 and 1.0
  }));
  
  // Generate lore
  const loreBase = loreFragments[worldState];
  const lore = [
    loreBase[Math.floor(Math.random() * loreBase.length)],
    loreBase[Math.floor(Math.random() * loreBase.length)],
  ].join('. ') + '.';
  
  // Generate description
  const descriptions = {
    WhisperFog: `A mysterious entity that emerges from the ethereal mists. Its form shifts and changes, never quite settling on a single shape. ${name} is known to whisper forgotten secrets to those who listen closely.`,
    SignalStorm: `A being of pure energy and electromagnetic waves. ${name} pulses with vibrant light that changes frequency with its mood. It's drawn to areas with strong signal transmissions.`,
    VoidTide: `A creature from the cosmic depths, ${name} seems to contain fragments of distant stars within its form. It moves with an otherworldly grace that defies normal physics.`,
    EchoRift: `${name} exists in multiple moments simultaneously. Its form appears to glitch and shift between different states as it moves through timelines. Observers report seeing their own past or future reflected in its surface.`,
  };
  
  // Get random image from sample images
  const worldImages = sampleImages[worldState];
  const imageUrl = worldImages[Math.floor(Math.random() * worldImages.length)];
  
  // Create creature object
  const creature: Creature = {
    id: generateUniqueId(),
    name,
    description: descriptions[worldState],
    rarity,
    attributes,
    worldState,
    imageUrl,
    lore,
    summonedAt: new Date().toISOString(),
    location: sensorData.location,
  };
  
  return creature;
};