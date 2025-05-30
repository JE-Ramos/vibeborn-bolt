import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View, 
  Image, 
  Dimensions 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Creature } from '@/types/creature';
import { COLORS } from '@/constants/Colors';
import { RarityBadge } from '@/components/common/RarityBadge';
import { LinearGradient } from 'expo-linear-gradient';

interface CreatureCardProps {
  creature: Creature;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 32) / 2;

export const CreatureCard: React.FC<CreatureCardProps> = ({ creature, onPress }) => {
  const worldColors = COLORS.worldStates[creature.worldState as keyof typeof COLORS.worldStates];
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: creature.imageUrl }}
        style={styles.image}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      
      <View style={styles.contentContainer}>
        <RarityBadge rarity={creature.rarity} />
        
        <BlurView intensity={60} tint="dark" style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {creature.name}
          </Text>
          
          <View 
            style={[
              styles.worldStateIndicator, 
              { backgroundColor: worldColors.accent + '80' }
            ]}
          />
        </BlurView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: cardWidth * 1.4,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.background.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
    justifyContent: 'space-between',
  },
  infoContainer: {
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    color: COLORS.text.primary,
    flex: 1,
  },
  worldStateIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
});