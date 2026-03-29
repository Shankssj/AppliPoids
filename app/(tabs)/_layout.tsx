import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from '../../src/components/ui';
import { colors, typography, shadows } from '../../src/theme/tokens';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? colors.primary[400] : colors.neutral[400] },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Accueil" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⚔️" label="Quêtes" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🧝" label="Héros" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📋" label="Journal" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pet"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🐣" label="Familier" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 85 : 65,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 0,
    paddingTop: 8,
    ...shadows.md,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
  },
});
