import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
import { MainTabNavigator } from './TabNavigator';
import { ClientDetailScreen } from '../screens/app/ClientDetailScreen';
import { AddEditClientScreen } from '../screens/app/AddEditClientScreen';
import { PaymentScreen } from '../screens/app/PaymentScreen';
import { BookingScreen } from '../screens/app/BookingScreen';
import { ReminderScreen } from '../screens/app/ReminderScreen';
import { ClientListScreen } from '../screens/app/ClientListScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
      <Stack.Screen name="AddEditClient" component={AddEditClientScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Reminder" component={ReminderScreen} />
      <Stack.Screen name="ClientList" component={ClientListScreen} />
    </Stack.Navigator>
  );
};