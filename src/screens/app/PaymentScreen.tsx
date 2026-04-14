import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { useStore } from '../../store';
import { colors, fontSizes, spacing, strings } from '../../theme';
import { Card } from '../../components/Card';
import { TextInput } from '../../components/TextInput';
import { RootStackScreenProps } from '../../navigation/types';
import { Header } from '../../components/Header';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export const PaymentScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'Payment'>) => {
  const insets = useSafeAreaInsets();
  const { clientId } = route.params || {};
  const payments = useStore(state => state.payments);
  const clients = useStore(state => state.clients);
  const addPayment = useStore(state => state.addPayment);

  const tabBarHeight = (() => {
    try {
      return useBottomTabBarHeight();
    } catch {
      return 0;
    }
  })();

  const client = clientId ? clients.find(c => c.id === clientId) : undefined;
  const clientPayments = clientId
    ? payments.filter(p => p.clientId === clientId)
    : payments;

  const totalPaid = clientPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = client ? client.totalCost - totalPaid : 0;
  const canAddPayment =
    !!client &&
    [
      'Confirmed',
      'Payment Received',
      'Booking Started',
      'Trip Confirmed',
    ].includes(client.status);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Payment received');
  const [errors, setErrors] = useState<any>({});
  const handleSubmitPayment = () => {
    const newErrors: any = {};
    const paymentAmount = Number(amount);
    if (!clientId) {
      newErrors.general = 'Select a client to add payment.';
    }
    if (!paymentAmount || paymentAmount <= 0) {
      newErrors.amount = 'Enter a valid payment amount';
    }
    if (!description.trim()) {
      newErrors.description = 'Add a description';
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    addPayment({
      id: Math.random().toString(36).substring(7),
      clientId: clientId || '',
      amount: paymentAmount,
      date: new Date().toISOString().split('T')[0],
      description,
    });
    setAmount('');
    setDescription('Payment received');
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Card style={styles.paymentCard}>
        <View style={styles.cardHeader}>
          <View style={styles.clientInfo}>
            <CreditCard color={colors.primary} size={20} />
            <Text style={styles.clientName}>
              {clients.find(c => c.id === item.clientId)?.name ||
                'Unknown Client'}
            </Text>
          </View>
          <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.row}>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={'Payments'} onBackPress={() => navigation.goBack()} />
      {client && (
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Add Payment for {client.name}</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount To Pay"
            keyboardType="number-pad"
          />
          {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Cost</Text>
              <Text style={styles.summaryValue}>₹{client.totalCost}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryValue}>₹{pendingAmount}</Text>
            </View>
          </View>

          {!canAddPayment && (
            <Text style={styles.hintText}>
              Payments can be added after the client is confirmed.
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.submitButton,
              !canAddPayment && styles.buttonDisabled,
            ]}
            onPress={handleSubmitPayment}
            disabled={!canAddPayment}
          >
            <Text style={styles.submitButtonText}>Save Payment</Text>
          </TouchableOpacity>
          {errors.general && <Text style={styles.error}>{errors.general}</Text>}
        </Card>
      )}

      <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
        <View style={styles.summaryTop}>
          <Text style={styles.summaryTitle}>Total Amount</Text>
          <Text style={styles.summaryLabel}>
            {client ? `For ${client.name}` : 'All payments'}
          </Text>
        </View>
        <Text style={[styles.amount, { color: colors.success }]}>
          ₹{totalPaid.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={clientPayments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {client
              ? `No payments found for ${client.name}`
              : 'No payments yet'}
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md16,
    paddingVertical: spacing.sm8,
  },
  summaryCard: {
    marginHorizontal: spacing.md16,
    marginBottom: spacing.md12,
    borderRadius: 18,
    padding: spacing.md16,
  },
  summaryTop: {
    marginBottom: spacing.md12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:spacing.sm10,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  formCard: {
    marginHorizontal:spacing.md16,
    padding: spacing.md16,
    borderRadius: 18,
    backgroundColor: colors.card,
    marginBottom:spacing.md12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom:spacing.sm10,
    color: colors.text,
  },
  submitButton: {
    marginTop:spacing.md12,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  submitButtonText: {
    color:colors.white,
    fontWeight: '700',
  },
  error: {
    color: colors.danger,
    marginTop:spacing.xs6,
    fontSize: 12,
  },
  hintText: {
    color: colors.textSecondary,
    marginTop:spacing.sm8,
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal:spacing.md16,
    paddingTop: spacing.sm8,
    paddingBottom: spacing.lg20,
  },
  paymentCard: {
    padding: spacing.md14,
    borderRadius: 14,
    marginBottom: spacing.md12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm10,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.xs6,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm10,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xl40,
    fontSize: fontSizes.xlarge,
  },
  list: {
    paddingHorizontal: spacing.md16,
    paddingTop: spacing.sm8,
    paddingBottom: spacing.lg20,
  },
});
