import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CheckSquare, BarChart3, Sliders, Heart } from 'lucide-react-native';

import { GlowUpProvider } from './src/context/GlowUpContext';
import { TodayScreen } from './src/screens/TodayScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { ManageScreen } from './src/screens/ManageScreen';
import { MotivationScreen } from './src/screens/MotivationScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GlowUpProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#090D16',
              borderTopColor: '#1E293B',
              borderTopWidth: 1,
              height: 78,
              paddingBottom: 12,
              paddingTop: 8,
            },
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: '#64748B',
            tabBarItemStyle: {
              justifyContent: 'center',
              alignItems: 'center',
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.5,
              marginTop: 2,
            },
          }}
        >
          <Tab.Screen
            name="Today"
            component={TodayScreen}
            options={{
              tabBarLabel: 'Hari Ini',
              tabBarIcon: ({ color, size }) => (
                <CheckSquare size={size - 2} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Stats"
            component={StatsScreen}
            options={{
              tabBarLabel: 'Progress',
              tabBarIcon: ({ color, size }) => (
                <BarChart3 size={size - 2} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Manage"
            component={ManageScreen}
            options={{
              tabBarLabel: 'Setup',
              tabBarIcon: ({ color, size }) => (
                <Sliders size={size - 2} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Motivation"
            component={MotivationScreen}
            options={{
              tabBarLabel: 'Vision',
              tabBarIcon: ({ color, size }) => (
                <Heart size={size - 2} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GlowUpProvider>
  );
}
