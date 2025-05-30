import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Creature } from '@/types/creature';
import { COLORS } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { RarityBadge } from '@/components/common/RarityBadge';
import { X, CalendarClock, MapPin } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DetailViewProps {
  creature: Creature;
  onClose: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ creature, onClose }) => {
  const worldColors = COLORS.worldStates[creature.worldState as keyof typeof COLORS.worldStates];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[worldColors.background, worldColors.backgroundDark]}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={COLORS.text.primary} size={24} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: creature.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            
            <LinearGradient
              colors={['transparent', worldColors.background]}
              style={styles.imageGradient}
            />
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{creature.name}</Text>
              <RarityBadge rarity={creature.rarity} />
            </View>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <CalendarClock size={16} color={worldColors.accent} style={styles.metaIcon} />
                <Text style={styles.metaText}>{formatDate(creature.summonedAt)}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <View 
                  style={[
                    styles.worldStateIndicator,
                    { backgroundColor: worldColors.accent }
                  ]}
                />
                <Text style={styles.metaText}>{creature.worldState}</Text>
              </View>
            </View>
            
            <BlurView intensity={20} tint="dark" style={styles.descriptionContainer}>
              <Text style={styles.description}>{creature.description}</Text>
            </BlurView>
            
            <View style={styles.attributesContainer}>
              <Text style={styles.sectionTitle}>Attributes</Text>
              
              <View style={styles.attributesGrid}>
                {creature.attributes.map((attribute, index) => (
                  <View key={index} style={styles.attributeItem}>
                    <Text style={styles.attributeName}>{attribute.name}</Text>
                    <View style={styles.attributeValueContainer}>
                      <View 
                        style={[
                          styles.attributeValueBar, 
                          { 
                            width: `${attribute.value * 100}%`,
                            backgroundColor: worldColors.accent
                          }
                        ]}
                      />
                      <Text style={styles.attributeValueText}>
                        {Math.round(attribute.value * 100)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            
            {creature.location && (
              <View style={styles.locationContainer}>
                <Text style={styles.sectionTitle}>Discovery Location</Text>
                
                <BlurView intensity={20} tint="dark" style={styles.locationContent}>
                  <MapPin size={16} color={worldColors.accent} style={styles.locationIcon} />
                  <Text style={styles.locationText}>
                    {creature.location.latitude.toFixed(4)}, {creature.location.longitude.toFixed(4)}
                  </Text>
                </BlurView>
              </View>
            )}
            
            <View style={styles.loreContainer}>
              <Text style={styles.sectionTitle}>Lore</Text>
              <BlurView intensity={20} tint="dark" style={styles.loreContent}>
                <Text style={styles.loreText}>{creature.lore}</Text>
              </BlurView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  detailsContainer: {
    padding: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  name: {
    fontFamily: 'Supernatural',
    fontSize: 28,
    color: COLORS.text.primary,
    flex: 1,
    marginRight: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaIcon: {
    marginRight: 6,
  },
  metaText: {
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  worldStateIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  descriptionContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  description: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  attributesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'CaslonAntique',
    fontSize: 18,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  attributesGrid: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  attributeItem: {
    marginBottom: 12,
  },
  attributeName: {
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  attributeValueContainer: {
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 9,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  attributeValueBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  attributeValueText: {
    fontFamily: 'CaslonAntique',
    fontSize: 12,
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    color: COLORS.text.primary,
  },
  loreContainer: {
    marginBottom: 40,
  },
  loreContent: {
    padding: 16,
    borderRadius: 12,
  },
  loreText: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});