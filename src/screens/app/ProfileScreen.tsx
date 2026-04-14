import React from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, spacing } from '../../theme/colors';
import { strings } from '../../theme/strings';
import { TabScreenProps } from '../../navigation/types';
import { useStore } from '../../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export const ProfileScreen = ({ navigation }: TabScreenProps<'Profile'>) => {
  const user = useStore(state => state.user);
  const clients = useStore(state => state.clients);
  const bookings = useStore(state => state.bookings);
  const payments = useStore(state => state.payments);

  const setUser = useStore(state => state.setUser);
  const insets = useSafeAreaInsets();

  const tabBarHeight = (() => {
    try {
      return useBottomTabBarHeight();
    } catch {
      return 0;
    }
  })();

  const totalClients = clients.length;
  const totalBookings = bookings.length;
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleLogout = () => {
    Alert.alert(strings.logoutConfirmTitle, strings.logoutConfirmMessage, [
      { text: strings.cancel, style: 'cancel' },
      {
        text: strings.logout,
        style: 'destructive',
        onPress: async () => {
          setUser(null);
          await AsyncStorage.removeItem('user');
          navigation.getParent()?.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/images/profileLogo.png')}
              style={styles.avatar}
            />
          </View>

          <Text style={styles.name}>
            {user?.name || strings.defaultUserName}
          </Text>
          <Text style={styles.email}>
            {user?.email || strings.defaultEmail}
          </Text>
          <Text style={styles.roleBadge}>Travel Manager ✈️</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Clients" value={totalClients} />
          <StatCard label="Bookings" value={totalBookings} />
          <StatCard label="Revenue" value={`₹${totalRevenue}`} />
        </View>

        <View style={styles.performanceCard}>
          <Text style={styles.cardTitle}>Performance</Text>
          <View style={styles.performanceRow}>
            <Text style={styles.performanceLabel}>This Month</Text>
            <Text style={styles.performanceValue}>₹{totalRevenue}</Text>
          </View>
          <View style={styles.performanceRow}>
            <Text style={styles.performanceLabel}>Target</Text>
            <Text style={styles.performanceValue}>₹1,00,000</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Agent Details</Text>
          <InfoRow label="Role" value="Manager" />
          <InfoRow label="Status" value="Active" highlight />
          <InfoRow label="Experience" value="3+ Years" />
        </View>

        <View
          style={[styles.bottomContainer, { paddingBottom: tabBarHeight + 20 }]}
        >
          <Button
            title={strings.logout}
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ label, value }: any) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const InfoRow = ({ label, value, highlight }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, highlight && { color: colors.success }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.md16,
  },
  avatarWrapper: {
    backgroundColor: colors.card,
    padding:spacing.xs6,
    borderRadius: 60,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: spacing.sm10,
    color: colors.text,
  },
  email: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs4,
  },
  roleBadge: {
    marginTop: spacing.xs6,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    marginHorizontal:spacing.xs4,
    borderRadius: 14,
    padding: spacing.md14,
    alignItems: 'center',
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop:spacing.xs4,
  },
  performanceCard: {
    backgroundColor: colors.card,
    margin: spacing.lg24,
    borderRadius: 16,
    padding:spacing.md16,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:spacing.sm10,
  },
  performanceLabel: {
    color: colors.textSecondary,
  },
  performanceValue: {
    fontWeight: '700',
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg24,
    borderRadius: 16,
    padding: spacing.md16,
    marginTop: spacing.xs6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom:spacing.sm10,
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  bottomContainer: {
    marginHorizontal: spacing.lg24,
    marginTop: spacing.lg24,
  },
  logoutButton: {
    borderRadius: 14,
  },
});
