/**
 * Possible world states
 */
export type WorldState = 'WhisperFog' | 'SignalStorm' | 'VoidTide' | 'EchoRift';

/**
 * Information about a world state
 */
export interface WorldStateInfo {
  name: string;
  description: string;
  rarity: Record<string, number>; // Rarity distribution
  affinity: string[]; // Keywords associated with this world state
}