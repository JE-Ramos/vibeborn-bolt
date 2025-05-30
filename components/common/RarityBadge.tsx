import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface RarityBadgeProps {
  rarity: string;
  onPress?: () => void;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({ rarity, onPress }) => {
  const rarityColor = COLORS.rarity[rarity as keyof typeof COLORS.rarity];
  
  const renderBadge = () => (
    <View 
      style={[
        styles.container, 
        { backgroundColor: rarityColor + '80' }
      ]}
    >
      <Text style={styles.text}>{rarity}</Text>
      {onPress && <View style={styles.closeIcon}>×</View>}
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {renderBadge()}
      </TouchableOpacity>
    );
  }
  
  return renderBadge();
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'CaslonAntique',
    fontSize: 12,
    color: COLORS.text.primary,
  },
  closeIcon: {
    marginLeft: 4,
    fontSize: 16,
    color: COLORS.text.primary,
  },
});