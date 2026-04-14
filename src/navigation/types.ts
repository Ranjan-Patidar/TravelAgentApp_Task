import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  ClientDetail: { clientId: string };
  AddEditClient: { clientId?: string };
  Payment: { clientId?: string };
  Booking: { clientId?: string };
  GroupManagement: undefined;
  Reminder: undefined;
  ClientList: undefined;
};

export type MainStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
};

export type RootStackParamList = AuthStackParamList & AppStackParamList & MainStackParamList;

export type TabParamList = {
  Dashboard: undefined;
  Clients: undefined;
  Payments: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppStackScreenProps<T extends keyof AppStackParamList> = 
  NativeStackScreenProps<AppStackParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = 
  NativeStackScreenProps<MainStackParamList, T>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;
