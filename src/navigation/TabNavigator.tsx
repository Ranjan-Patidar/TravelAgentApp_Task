import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { TabParamList } from './types';
import { colors, spacing, strings } from '../theme';
import { Home, Users, CreditCard, Calendar, User, Bus } from 'lucide-react-native';
import { DashboardScreen } from '../screens/app/DashboardScreen';
import { ClientListScreen } from '../screens/app/ClientListScreen';
import { PaymentScreen } from '../screens/app/PaymentScreen';
import { BookingScreen } from '../screens/app/BookingScreen';
import { ProfileScreen } from '../screens/app/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.tabActiveColor,
        tabBarInactiveTintColor: colors.surface,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: strings.home,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Home size={22} color={focused ? colors.white : color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Clients"
        component={ClientListScreen}
        options={{
          tabBarLabel: strings.clients,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Users size={22} color={focused ? colors.white : color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Payments"
        component={PaymentScreen as React.ComponentType<any>}
        options={{
          tabBarLabel: strings.payments,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <CreditCard size={22} color={focused ? colors.white : color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Bookings"
        component={BookingScreen as React.ComponentType<any>}
        options={{
          tabBarLabel: strings.bookings,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Bus size={22} color={focused ? colors.white : color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: strings.profile,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <User size={22} color={focused ? colors.white : color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 5,
    left: 16,
    right: 16,
    height: 70,
    borderRadius: 60,
    backgroundColor: colors.black,
    borderTopWidth: 0,
    margin:spacing.md14,
    shadowColor:  colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tabItem: {
    paddingVertical:spacing.xs6,
  },
  iconWrapper: {
    width: 35,
    height: 35,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
     marginBottom: spacing.xs2,
  },
  iconWrapperActive: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: spacing.xs4,
    marginTop:spacing.xs2,
  },
});