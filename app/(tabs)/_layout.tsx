import { HapticTab } from '@/components/haptic-tab';
import { FabMenu } from '@/components/ui/fab-menu';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/context/theme-context';

export default function TabLayout() {
  const [fabOpen, setFabOpen] = useState(false);
  const { theme, isDark } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: theme.green,
          tabBarInactiveTintColor: isDark ? '#ffffff40' : '#00000040',
          tabBarStyle: {
            backgroundColor: theme.bgDeep,
            borderTopColor: isDark ? '#ffffff10' : '#00000010',
            paddingTop: 8,
            paddingBottom: 18,
            height: 82,
            overflow: 'visible',
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'HOME',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'INSIGHTS',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="chart.bar.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="fab"
          options={{
            title: '',
            tabBarIcon: () => null,
            tabBarButton: () => (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={() => setFabOpen(true)}
                  style={{
                    width: 60, height: 60, borderRadius: 30,
                    backgroundColor: theme.green,
                    alignItems: 'center', justifyContent: 'center',
                    position: 'absolute',
                    bottom: 26,
                    shadowColor: theme.green, shadowOpacity: 0.6,
                    shadowRadius: 16, shadowOffset: { width: 0, height: -4 },
                    elevation: 10,
                  }}>
                  <IconSymbol name="arrow.left.arrow.right" size={22} color={theme.bgDeep} />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: 'BUDGET',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="chart.pie.fill" color={color} />,
          }}
        />
        <Tabs.Screen name="profile" options={{ title: 'SETTINGS', tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape.fill" color={color} /> }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="savings" options={{ href: null }} />
        <Tabs.Screen name="history" options={{ href: null }} />
        <Tabs.Screen name="wallet" options={{ href: null }} />
        <Tabs.Screen name="cards" options={{ href: null }} />
        <Tabs.Screen name="stats" options={{ href: null }} />
      </Tabs>

      <Modal visible={fabOpen} transparent animationType="slide" onRequestClose={() => setFabOpen(false)}>
        <FabMenu onClose={() => setFabOpen(false)} />
      </Modal>
    </View>
  );
}
