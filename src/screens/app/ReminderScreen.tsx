import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Bell, AlertTriangle } from 'lucide-react-native';
import { colors, fontSizes, spacing, strings } from '../../theme';
import { Card } from '../../components/Card';
import { useStore } from '../../store';
import { Header } from '../../components/Header';
import { AppStackScreenProps } from '../../navigation/types';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export const ReminderScreen = ({
  navigation,
}: AppStackScreenProps<'Reminder'>) => {
  const clients = useStore(state => state.clients);
  const payments = useStore(state => state.payments);
  const tabBarHeight = (() => {
    try {
      return useBottomTabBarHeight();
    } catch {
      return 0;
    }
  })();

  const reminders = clients
    .map(client => {
      const totalPaid = payments
        .filter(p => p.clientId === client.id)
        .reduce((sum, p) => sum + p.amount, 0);
      const pending = client.totalCost - totalPaid;
      if (pending > 0) {
        return {
          id: client.id,
          title: `Pending Payment for ${client.name}`,
          description: `Outstanding amount: ₹${pending} for ${client.destination} trip.`,
          type: 'payment',
          date: 'Payment Due',
        };
      }
      return null;
    })
    .filter(Boolean) as any[];

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <View style={styles.iconContainer}>
        {item.type === 'payment' || item.type === 'hotel' ? (
          <AlertTriangle color={colors.warning} size={24} />
        ) : (
          <Bell color={colors.info} size={24} />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={'Reminders & Notifications'}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={reminders}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal:spacing.md16,
    paddingVertical:spacing.md12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs4,
  },
  listContent: {
    paddingHorizontal:spacing.md16,
    paddingTop:spacing.sm8,
  },
  card: {
    flexDirection: 'row',
    padding: spacing.md14,
    borderRadius: 14,
    marginBottom: spacing.sm10,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: spacing.sm10,
    marginTop:spacing.xs2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight:spacing.sm8,
  },
  date: {
    fontSize: 11,
    color: colors.danger,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
