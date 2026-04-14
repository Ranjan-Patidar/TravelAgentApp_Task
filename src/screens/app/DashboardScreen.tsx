import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Users,
  CreditCard,
  CalendarDays,
  PlusCircle,
  Bell,
} from 'lucide-react-native';
import { useStore } from '../../store';
import { colors, spacing } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { TabScreenProps } from '../../navigation/types';
import { getStatusType } from '../../utils/statusHelper';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export const DashboardScreen = ({
  navigation,
}: TabScreenProps<'Dashboard'>) => {
  const clients = useStore(state => state.clients);
  const payments = useStore(state => state.payments);
  const user = useStore(state => state.user);

  const tabBarHeight = (() => {
    try {
      return useBottomTabBarHeight();
    } catch {
      return 0;
    }
  })();

  const totalLeads = clients.filter(c => c.status === 'Lead').length;
  const activeDiscussions = clients.filter(
    c => c.status === 'In Discussion',
  ).length;
  const confirmedTrips = clients.filter(c => c.status === 'Confirmed').length;
  const pendingPayments = clients.filter(client => {
    const paid = payments
      .filter(p => p.clientId === client.id)
      .reduce((sum, p) => sum + p.amount, 0);
    return client.totalCost > paid;
  }).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name || 'Agent'} 👋</Text>
            <Text style={styles.subtitle}>Manage your travel business</Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate('Reminder')}
          >
            <Bell color={colors.primary} size={22} />
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          {[
            {
              label: 'Total Leads',
              value: totalLeads,
              icon: <Users size={22} color={colors.info} />,
            },
            {
              label: 'In Discussion',
              value: activeDiscussions,
              icon: <CalendarDays size={22} color={colors.warning} />,
            },
            {
              label: 'Lead Confirmed',
              value: confirmedTrips,
              icon: <CreditCard size={22} color={colors.success} />,
            },
            {
              label: 'Pending',
              value: pendingPayments,
              icon: <Bell size={22} color={colors.danger} />,
            },
          ].map((item, index) => (
            <Card key={index} style={styles.statCard}>
              {item.icon}
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </Card>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsContainer}>
          <ActionBtn
            label="Add Client"
            icon={<PlusCircle size={20} color={colors.primary} />}
            onPress={() => navigation.navigate('AddEditClient', {})}
          />
          <ActionBtn
            label="Clients"
            icon={<Users size={20} color={colors.primary} />}
            onPress={() => navigation.navigate('ClientList')}
          />
          <ActionBtn
            label="Payments"
            icon={<CreditCard size={20} color={colors.primary} />}
            onPress={() => navigation.navigate('Payment', {})}
          />
          <ActionBtn
            label="Bookings"
            icon={<CalendarDays size={20} color={colors.primary} />}
            onPress={() => navigation.navigate('Booking', {})}
          />
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Recent Clients</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ClientList')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {clients.slice().map(client => (
          <TouchableOpacity
            key={client.id}
            onPress={() =>
              navigation.navigate('ClientDetail', { clientId: client.id })
            }
          >
            <Card style={styles.clientCard}>
              <View>
                <Text style={styles.clientName}>{client.name || 'N/A'}</Text>
                <Text style={styles.clientDest}>
                  {client.destination || 'N/A'}
                </Text>
              </View>

              <Badge
                label={client.status}
                status={getStatusType(client.status || 'N/A')}
              />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
const ActionBtn = ({ label, icon, onPress }: any) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    {icon}
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg18,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs4,
  },
  bellBtn: {
    padding: spacing.sm10,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg20,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.md16,
    borderRadius: 14,
    marginBottom: spacing.md12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop:spacing.xs6,
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm10,
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom:spacing.md16,
  },
  actionBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md14,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm10,
  },
  actionText: {
    marginLeft: spacing.sm8,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  clientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md14,
    borderRadius: 12,
    marginTop: spacing.sm8,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  clientDest: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop:spacing.xs2,
  },
});
