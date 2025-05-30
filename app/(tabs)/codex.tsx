import { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Image,
  Modal,
  Dimensions
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Creature } from '@/types/creature';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVibeWorld } from '@/contexts/VibeWorldContext';
import { CreatureCard } from '@/components/codex/CreatureCard';
import { DetailView } from '@/components/codex/DetailView';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { RarityBadge } from '@/components/common/RarityBadge';

const { width } = Dimensions.get('window');

export default function CodexScreen() {
  const summons = useSelector((state: RootState) => state.summons.creatures);
  const { currentWorldState } = useVibeWorld();
  const worldColors = COLORS.worldStates[currentWorldState];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ rarity: string | null, worldState: string | null }>({
    rarity: null,
    worldState: null,
  });
  
  const filteredSummons = summons.filter(creature => {
    const matchesSearch = creature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creature.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRarity = activeFilters.rarity ? creature.rarity === activeFilters.rarity : true;
    const matchesWorld = activeFilters.worldState ? creature.worldState === activeFilters.worldState : true;
    
    return matchesSearch && matchesRarity && matchesWorld;
  });
  
  const handleCreaturePress = (creature: Creature) => {
    setSelectedCreature(creature);
  };
  
  const closeDetailView = () => {
    setSelectedCreature(null);
  };
  
  const renderCreatureCard = useCallback(({ item }: { item: Creature }) => (
    <CreatureCard 
      creature={item} 
      onPress={() => handleCreaturePress(item)} 
    />
  ), []);
  
  const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const worldStateOptions = ['WhisperFog', 'SignalStorm', 'VoidTide', 'EchoRift'];
  
  const applyFilter = (type: 'rarity' | 'worldState', value: string | null) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value === prev[type] ? null : value
    }));
  };
  
  const clearFilters = () => {
    setActiveFilters({ rarity: null, worldState: null });
    setFilterModalVisible(false);
  };
  
  return (
    <LinearGradient
      colors={[worldColors.background, worldColors.backgroundDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <BlurView intensity={30} tint="dark" style={styles.headerContainer}>
          <Text style={styles.title}>Creature Codex</Text>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search color={COLORS.text.secondary} size={20} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search creatures..."
                placeholderTextColor={COLORS.text.secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X color={COLORS.text.secondary} size={18} />
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <SlidersHorizontal color={worldColors.accent} size={24} />
            </TouchableOpacity>
          </View>
          
          {(activeFilters.rarity || activeFilters.worldState) && (
            <View style={styles.activeFiltersContainer}>
              {activeFilters.rarity && (
                <RarityBadge rarity={activeFilters.rarity} onPress={() => applyFilter('rarity', activeFilters.rarity)} />
              )}
              
              {activeFilters.worldState && (
                <TouchableOpacity 
                  style={[styles.worldStateFilter, { 
                    backgroundColor: COLORS.worldStates[activeFilters.worldState as keyof typeof COLORS.worldStates].accent + '40'
                  }]}
                  onPress={() => applyFilter('worldState', activeFilters.worldState)}
                >
                  <Text style={styles.worldStateText}>{activeFilters.worldState}</Text>
                  <X color={COLORS.text.secondary} size={14} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </BlurView>
        
        {summons.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your codex is empty</Text>
            <Text style={styles.emptySubtext}>Perform summon rituals to discover new creatures</Text>
          </View>
        ) : (
          <FlatList
            data={filteredSummons}
            renderItem={renderCreatureCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            maxToRenderPerBatch={8}
            windowSize={5}
          />
        )}
        
        <Modal
          visible={!!selectedCreature}
          animationType="slide"
          transparent={true}
          onRequestClose={closeDetailView}
        >
          {selectedCreature && <DetailView creature={selectedCreature} onClose={closeDetailView} />}
        </Modal>
        
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <BlurView intensity={90} tint="dark" style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Creatures</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <X color={COLORS.text.primary} size={24} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Rarity</Text>
                <View style={styles.filterOptions}>
                  {rarityOptions.map(rarity => (
                    <TouchableOpacity
                      key={rarity}
                      style={[
                        styles.filterOption,
                        activeFilters.rarity === rarity && styles.activeFilterOption
                      ]}
                      onPress={() => applyFilter('rarity', rarity)}
                    >
                      <Text 
                        style={[
                          styles.filterOptionText,
                          activeFilters.rarity === rarity && styles.activeFilterOptionText
                        ]}
                      >
                        {rarity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>World State</Text>
                <View style={styles.filterOptions}>
                  {worldStateOptions.map(state => (
                    <TouchableOpacity
                      key={state}
                      style={[
                        styles.filterOption,
                        activeFilters.worldState === state && styles.activeFilterOption
                      ]}
                      onPress={() => applyFilter('worldState', state)}
                    >
                      <Text 
                        style={[
                          styles.filterOptionText,
                          activeFilters.worldState === state && styles.activeFilterOptionText
                        ]}
                      >
                        {state}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterActions}>
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={clearFilters}
                >
                  <Text style={styles.clearButtonText}>Clear Filters</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.applyButton, { backgroundColor: worldColors.accent }]}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text.primary,
    fontFamily: 'CaslonAntique',
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 12,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  worldStateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  worldStateText: {
    color: COLORS.text.primary,
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'CaslonAntique',
    fontSize: 22,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  list: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: 'CaslonAntique',
    fontSize: 20,
    color: COLORS.text.primary,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontFamily: 'CaslonAntique',
    fontSize: 18,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterOptionText: {
    fontFamily: 'CaslonAntique',
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  activeFilterOptionText: {
    color: COLORS.text.primary,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  clearButtonText: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.primary,
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  applyButtonText: {
    fontFamily: 'CaslonAntique',
    fontSize: 16,
    color: COLORS.text.primary,
  },
});