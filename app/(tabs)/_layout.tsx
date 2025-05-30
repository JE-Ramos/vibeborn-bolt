import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { useVibeWorld } from '@/contexts/VibeWorldContext';
import { COLORS } from '@/constants/Colors';
import { 
  Sparkles, 
  Book, 
  ShoppingBag
} from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { currentWorldState } = useVibeWorld();
  
  const worldColors = COLORS.worldStates[currentWorldState];
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView 
            intensity={80} 
            tint="dark" 
            style={StyleSheet.absoluteFill} 
          />
        ),
        tabBarActiveTintColor: worldColors.accent,
        tabBarInactiveTintColor: COLORS.text.secondary,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Summon',
          tabBarIcon: ({ color, size }) => (
            <Sparkles size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="codex"
        options={{
          title: 'Codex',
          tabBarIcon: ({ color, size }) => (
            <Book size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    backgroundColor: 'transparent',
  },
  tabBarLabel: {
    fontFamily: 'CaslonAntique',
    fontSize: 12,
  },
});