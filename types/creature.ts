/**
 * Creature type definition
 */
export interface Creature {
  id: string;
  name: string;
  description: string;
  rarity: string;
  attributes: Array<{
    name: string;
    value: number; // Between 0 and 1
  }>;
  worldState: string;
  imageUrl: string;
  lore: string;
  summonedAt: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}