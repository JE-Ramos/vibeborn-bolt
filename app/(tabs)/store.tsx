import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVibeWorld } from '@/contexts/VibeWorldContext';
import { Sparkles, Crown, Gem, X, Info } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { purchaseItem } from '@/store/slices/storeSlice';
import * as Haptics from 'expo-haptics';

// Store item types
type StoreItemType = 'ritual' | 'subscription' | 'cosmetic';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: StoreItemType;
  image: string;
  isPremium: boolean;
}

const storeItems: StoreItem[] = [
  {
    id: 'ritual-boost',
    name: 'Ritual Amplifier',
    description: 'Increases the chance of finding rare creatures by 25% for the next 5 summons.',
    price: 250,
    type: 'ritual',
    image: 'https://images.pexels.com/photos/33041/antelope-canyon-lower-canyon-arizona.jpg',
    isPremium: false,
  },
  {
    id: 'ritual-sigil',
    name: 'Ancient Sigil',
    description: 'Guarantees at least an Epic creature on your next summon.',
    price: 500,
    type: 'ritual',
    image: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg',
    isPremium: false,
  },
  {
    id: 'subscription-monthly',
    name: 'Vibe Seeker (Monthly)',
    description: 'Monthly subscription. Get 500 Vibe Essence daily, exclusive summon effects, and 2 guaranteed Legendary creatures per month.',
    price: 999,
    type: 'subscription',
    image: 'https://images.pexels.com/photos/1054222/pexels-photo-1054222.jpeg',
    isPremium: true,
  },
  {
    id: 'cosmetic-particles',
    name: 'Ethereal Particles',
    description: 'Special particle effects for your summon ritual.',
    price: 350,
    type: 'cosmetic',
    image: 'https://images.pexels.com/photos/3648850/pexels-photo-3648850.jpeg',
    isPremium: false,
  },
  {
    id: 'cosmetic-aura',
    name: 'Mystic Aura',
    description: 'Adds a mystical aura around your summoned creatures in the Codex.',
    price: 450,
    type: 'cosmetic',
    image: 'https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg',
    isPremium: false,
  },
];

export default function StoreScreen() {
  const { currentWorldState } = useVibeWorld();
  const worldColors = COLORS.worldStates[currentWorldState];
  const currency = useSelector((state: RootState) => state.store.currency);
  const inventory = useSelector((state: RootState) => state.store.purchasedItems);
  const dispatch = useDispatch();
  
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [showCurrencyInfo, setShowCurrencyInfo] = useState(false);
  
  const handleItemPress = (item: StoreItem) => {
    setSelectedItem(item);
  };
  
  const handlePurchase = (item: StoreItem) => {
    if (currency >= item.price) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch(purchaseItem(item.id));
      setSelectedItem(null);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };
  
  const renderStoreItem = ({ item }: { item: StoreItem }) => {
    const isOwned = inventory.includes(item.id);
    
    return (
      <TouchableOpacity 
        style={styles.itemCard}
        onPress={() => handleItemPress(item)}
        disabled={isOwned}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.itemImage}
        />
        
        <BlurView intensity={60} tint="dark" style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.isPremium && <Crown size={16} color="#FFD700" />}
          </View>
          
          <View style={styles.priceContainer}>
            <Gem size={14} color="#7986CB" />
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
          
          {isOwned && (
            <View style={styles.ownedBadge}>
              <Text style={styles.ownedText}>Owned</Text>
            </View>
          )}
        </BlurView>
      </TouchableOpacity>
    );
  };
  
  return (
    <LinearGradient
      colors={[worldColors.background, worldColors.backgroundDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <BlurView intensity={30} tint="dark" style={styles.headerContainer}>
          <Text style={styles.title}>Mystical Shop</Text>
          
          <TouchableOpacity 
            style={styles.currencyContainer} 
            onPress={() => setShowCurrencyInfo(true)}
          >
            <Gem size={18} color="#7986CB" />
            <Text style={styles.currencyText}>{currency}</Text>
            <Info size={16} color={COLORS.text.secondary} style={styles.infoIcon} />
          </TouchableOpacity>
        </BlurView>
        
        <FlatList
          data={storeItems}
          renderItem={renderStoreItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
        
        <Modal
          visible={!!selectedItem}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedItem(null)}
        >
          {selectedItem && (
            <View style={styles.modalContainer}>
              <BlurView intensity={90} tint="dark" style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                    {selectedItem.isPremium && <Crown size={18} color="#FFD700" />}
                  </View>
                  <TouchableOpacity onPress={() => setSelectedItem(null)}>
                    <X color={COLORS.text.primary} size={24} />
                  </TouchableOpacity>
                </View>
                
                <Image 
                  source={{ uri: selectedItem.image }} 
                  style={styles.modalImage}
                />
                
                <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                
                <View style={styles.tagContainer}>
                  <View style={[styles.tag, { backgroundColor: getTagColor(selectedItem.type) }]}>
                    <Text style={styles.tagText}>{getTagLabel(selectedItem.type)}</Text>
                  </View>
                </View>
                
                <View style={styles.purchaseContainer}>
                  <View style={styles.priceSection}>
                    <Gem size={18} color="#7986CB" />
                    <Text style={styles.modalPrice}>{selectedItem.price}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.purchaseButton, 
                      { 
                        backgroundColor: currency >= selectedItem.price ? worldColors.accent : 'rgba(255, 255, 255, 0.1)',
                        opacity: currency >= selectedItem.price ? 1 : 0.7
                      }
                    ]}
                    onPress={() => handlePurchase(selectedItem)}
                    disabled={currency < selectedItem.price}
                  >
                    <Text style={styles.purchaseText}>Purchase</Text>
                  </TouchableOpacity>
                </View>
                
                {currency < selectedItem.price && (
                  <Text style={styles.insufficientText}>Insufficient Vibe Essence</Text>
                )}
              </BlurView>
            </View>
          )}
        </Modal>
        
        <Modal
          visible={showCurrencyInfo}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowCurrencyInfo(false)}
        >
          <View style={styles.currencyModalContainer}>
            <BlurView intensity={90} tint="dark" style={styles.currencyModalContent}>
              <View style={styles.currencyModalHeader}>
                <Text style={styles.currencyModalTitle}>Vibe Essence</Text>
                <TouchableOpacity onPress={() => setShowCurrencyInfo(false)}>
                  <X color={COLORS.text.primary} size={24} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.currencyInfoContainer}>
                <Gem size={40} color="#7986CB" />
                <Text style={styles.currencyAmount}>{currency}</Text>
              </View>
              
              <Text style={styles.currencyDescription}>
                Vibe Essence is earned by summoning creatures and completing daily rituals. 
                Use it to purchase special items, rituals, and cosmetic upgrades.
              </Text>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>How to earn more:</Text>
                <View style={styles.infoItem}>
                  <Sparkles size={16} color={worldColors.accent} />
                  <Text style={styles.infoText}>Complete daily summon ritual: +50</Text>
                </View>
                <View style={styles.infoItem}>
                  <Sparkles size={16} color={worldColors.accent} />
                  <Text style={styles.infoText}>Discover a new creature: +25-100</Text>
                </View>
                <View style={styles.infoItem}>
                  <Sparkles size={16} color={worldColors.accent} />
                  <Text style={styles.infoText}>Subscribe for daily bonuses: +500/day</Text>
                </View>
              </View>
            </BlurView>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const getTagColor = (type: StoreItemType): string => {
  switch(type) {
    case 'ritual': return 'rgba(156, 39, 176, 0.7)';
    case 'subscription': return 'rgba(33, 150, 243, 0.7)';
    case 'cosmetic': return 'rgba(76, 175, 80, 0.7)';
    default: return 'rgba(255, 255, 255, 0.2)';
  }
};

const getTagLabel = (type: StoreItemType): string => {
  switch(type) {
    case 'ritual': return 'Ritual Enhancement';
    case 'subscription': return 'Subscription';
    case 'cosmetic': return 'Cosmetic';
    default: return type;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  title: {
    fontFamily: 'Supernatural',
    fontSize: 28,
    color: COLORS.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  currencyText: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.primary,
    marginLeft: 6,
  },
  infoIcon: {
    marginLeft: 6,
  },
  list: {
    padding: 8,
  },
  itemCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  itemContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    color: COLORS.text.primary,
    flex: 1,
    marginRight: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    color: COLORS.text.primary,
    marginLeft: 4,
  },
  ownedBadge: {
    position: 'absolute',
    top: -80,
    right: -30,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 16,
    transform: [{ rotate: '45deg' }],
    width: 120,
    alignItems: 'center',
  },
  ownedText: {
    fontFamily: 'CaslonAntique',
    fontSize: 12,
    color: COLORS.text.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'CaslonAntique',
    fontSize: 20,
    color: COLORS.text.primary,
    marginRight: 8,
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalDescription: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  tagText: {
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    color: COLORS.text.primary,
  },
  purchaseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalPrice: {
    fontFamily: 'CaslonAntique',
    fontSize: 22,
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  purchaseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  purchaseText: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.primary,
  },
  insufficientText: {
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    color: '#FF5252',
    marginTop: 12,
    textAlign: 'center',
  },
  currencyModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  currencyModalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    maxWidth: 400,
  },
  currencyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  currencyModalTitle: {
    fontFamily: 'CaslonAntique',
    fontSize: 22,
    color: COLORS.text.primary,
  },
  currencyInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  currencyAmount: {
    fontFamily: 'CaslonAntique',
    fontSize: 32,
    color: COLORS.text.primary,
    marginLeft: 12,
  },
  currencyDescription: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 20,
    lineHeight: 24,
  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontFamily: 'CaslonAntique',
    fontSize: 18,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: 8,
  },
});