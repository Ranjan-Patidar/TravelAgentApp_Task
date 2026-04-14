import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {
  validateBookingForm,
  BookingFormData,
  BookingValidationErrors,
  validateCancellation,
  CancellationData,
  CancellationErrors,
} from '../../utils/validation';
import { colors, fontSizes, spacing, strings } from '../../theme';
import { TextInput } from '../../components/TextInput';
import { Bus, X } from 'lucide-react-native';
import { Card } from '../../components/Card';
import { RootStackScreenProps } from '../../navigation/types';
import { useStore } from '../../store';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';

export const BookingScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'Booking'>) => {
  const { clientId } = route.params || {};
  let bookings = useStore(state => state.bookings);
  const clients = useStore(state => state.clients);
  const allPayments = useStore(state => state.payments);
  const addBooking = useStore(state => state.addBooking);
  const cancelBooking = useStore(state => state.cancelBooking);
  const [bookingType, setBookingType] = useState<'Bus'>('Bus');
  const [bookingName, setBookingName] = useState('');
  const [bookingRoutes, setBookingRoutes] = useState('');
  const [bookingCost, setBookingCost] = useState('');
  const [errors, setErrors] = useState<BookingValidationErrors>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] =
    useState<any>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [cancellationErrors, setCancellationErrors] =
    useState<CancellationErrors>({});
  const client = clientId ? clients.find(c => c.id === clientId) : undefined;
  const clientPayments = clientId
    ? allPayments.filter(p => p.clientId === clientId)
    : [];
  const totalPaid = clientPayments.reduce((sum, p) => sum + p.amount, 0);
  const canBook =
    !!client &&
    totalPaid >= client.totalCost &&
    ['Payment Received', 'Booking Started', 'Trip Confirmed'].includes(
      client.status,
    );

  if (clientId) {
    bookings = bookings.filter(b => b.clientId === clientId);
  }

  const filteredBookings = bookings;
  const totalBookings = bookings.length;

  const getClientName = (id: string) => {
    return clients.find(c => c.id === id)?.name || 'Unknown Client';
  };

  const handleAddBooking = () => {
    if (!client || totalPaid < client.totalCost) {
      Alert.alert(strings.paymentRequiredTitle, strings.paymentRequiredMessage);
      return;
    }
    const formData: BookingFormData = {
      clientId: clientId || '',
      bookingName,
      bookingRoutes,
      bookingCost,
    };
    const newErrors = validateBookingForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const cost = Number(bookingCost);
      addBooking({
        id: Math.random().toString(36).substring(7),
        clientId: clientId || '',
        type: bookingType,
        name: bookingName,
        details: bookingRoutes,
        cost,
        status: 'Pending',
      });
      setBookingName('');
      setBookingRoutes('');
      setBookingCost('');
      setErrors({});
    }
  };

  const handleCancelBooking = () => {
    if (!selectedBookingForCancel) return;
    const cancellationData: CancellationData = {
      reason: cancellationReason,
      refundAmount,
    };
    const newErrors = validateCancellation(
      cancellationData,
      selectedBookingForCancel.cost,
    );
    setCancellationErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const refund = Number(refundAmount);
      cancelBooking(selectedBookingForCancel.id, cancellationReason, refund);
      Alert.alert('Success', 'Booking cancelled successfully');
      setShowCancelModal(false);
      setCancellationReason('');
      setRefundAmount('');
      setCancellationErrors({});
      setSelectedBookingForCancel(null);
    }
  };

  const openCancelModal = (booking: any) => {
    setSelectedBookingForCancel(booking);
    setRefundAmount(booking.cost.toString());
    setShowCancelModal(true);
  };

  const renderBookingItem = (item: any) => (
    <Card key={item.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Bus color="#fff" size={18} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.clientName}>{getClientName(item.clientId)}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <Text style={styles.routeText}>{item.details}</Text>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.costLabel}>Total Cost</Text>
          <Text style={styles.cost}>₹{item.cost}</Text>
        </View>
        {!clientId && item.status !== 'Cancelled' && (
          <Button
            title="Cancel booking"
            onPress={() => openCancelModal(item)}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        )}
      </View>

      {item.status === 'Cancelled' && item.cancellationReason && (
        <View style={styles.cancelBox}>
          <Text style={styles.cancelTitle}>Cancelled</Text>
          <Text style={styles.cancellationReason}>
            {item.cancellationReason}
          </Text>
          <Text style={styles.refundAmount}>
            Amount Refund: ₹{item.refundAmount || 0}
          </Text>
        </View>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title={strings.bookings} onBackPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryTitle}>{strings.bookingSummary}</Text>
            <Text style={styles.summaryLabel}>{strings.totalBookings}</Text>
          </View>
          <Text style={styles.summaryValue}>{totalBookings}</Text>
        </View>

        {client && (
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>
              {strings.newBookingFor} {client.name}
            </Text>
            <TextInput
              value={bookingName}
              onChangeText={setBookingName}
              placeholder={strings.busName}
            />
            {errors.bookingName && (
              <Text style={styles.error}>{errors.bookingName}</Text>
            )}

            <TextInput
              value={bookingRoutes}
              onChangeText={setBookingRoutes}
              placeholder={strings.bookingRoutes}
            />
            {errors.bookingRoutes && (
              <Text style={styles.error}>{errors.bookingRoutes}</Text>
            )}

            <TextInput
              value={bookingCost}
              onChangeText={setBookingCost}
              placeholder="Cost"
              keyboardType="number-pad"
            />
            {errors.bookingCost && (
              <Text style={styles.error}>{errors.bookingCost}</Text>
            )}

            {!canBook && (
              <Text style={styles.hintText}>
                Booking is locked until the client has paid an advance or full
                payment.
              </Text>
            )}

            <TouchableOpacity
              style={[styles.submitButton, !canBook && styles.buttonDisabled]}
              disabled={!canBook}
              onPress={handleAddBooking}
            >
              <Text style={styles.submitButtonText}>{strings.addBooking}</Text>
            </TouchableOpacity>
            {errors.general && (
              <Text style={styles.error}>{errors.general}</Text>
            )}
          </Card>
        )}

        {filteredBookings.length > 0 ? (
          filteredBookings.map(item => renderBookingItem(item))
        ) : (
          <Text style={styles.emptyText}>{strings.noBookingsFound}</Text>
        )}
      </ScrollView>
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowCancelModal(false);
          setCancellationReason('');
          setRefundAmount('');
          setCancellationErrors({});
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Booking</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCancelModal(false);
                  setCancellationReason('');
                  setRefundAmount('');
                  setCancellationErrors({});
                }}
              >
                <X color={colors.text} size={22} />
              </TouchableOpacity>
            </View>

            {selectedBookingForCancel && (
              <View style={styles.bookingInfoBox}>
                <View style={styles.cancelInfoContainer}>
                  <Text style={styles.modalBookingDetails}>Bus: </Text>
                  <Text style={styles.modalBookingDetails}>
                    {selectedBookingForCancel.name}
                  </Text>
                </View>
                <View style={styles.cancelInfoContainer}>
                  <Text style={styles.modalBookingDetails}>Route: </Text>
                  <Text style={styles.modalBookingDetails}>
                    {selectedBookingForCancel.details}
                  </Text>
                </View>
                <View style={styles.cancelInfoContainer}>
                  <Text style={styles.modalBookingDetails}>Amount Paid:</Text>
                  <Text style={styles.modalBookingDetails}>
                    ₹{selectedBookingForCancel.cost}
                  </Text>
                </View>
              </View>
            )}
            <TextInput
              value={cancellationReason}
              onChangeText={setCancellationReason}
              placeholder={strings.ReasonCancellation}
              multiline
            />
            {cancellationErrors.reason && (
              <Text style={styles.error}>{cancellationErrors.reason}</Text>
            )}

            <TextInput
              value={refundAmount}
              onChangeText={setRefundAmount}
              placeholder={strings.RefundAmount}
              keyboardType="number-pad"
            />
            {cancellationErrors.refundAmount && (
              <Text style={styles.error}>
                {cancellationErrors.refundAmount}
              </Text>
            )}

            <View style={styles.modalButtonRow}>
              <Button
                title="Cancel Booking"
                onPress={handleCancelBooking}
                style={{ width: '100%' }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md16,
    paddingBottom: 100,
  },
  summaryCard: {
    marginBottom: spacing.md12,
    borderRadius: 18,
    paddingHorizontal: spacing.md16,
  },
  summaryTop: {
    marginBottom: spacing.sm10,
  },
  summaryTitle: {
    fontSize: fontSizes.large,
    fontWeight: '800',
    color: colors.text,
  },
  summaryLabel: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    marginTop: spacing.xs4,
  },
  summaryValue: {
    fontSize: fontSizes.xlarge,
    fontWeight: '800',
    color: colors.primary,
  },
  formCard: {
    marginBottom: spacing.md12,
    borderRadius: 18,
    padding: spacing.md16,
    backgroundColor: colors.card,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm10,
    color: colors.text,
  },
  submitButton: {
    marginTop: spacing.md14,
    paddingVertical: spacing.md14,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
  error: {
    color: colors.danger,
    marginTop: spacing.xs6,
    fontSize: fontSizes.small,
  },
  hintText: {
    marginTop: spacing.sm8,
    color: colors.textSecondary,
    fontSize: fontSizes.small,
  },
  card: {
    marginBottom: spacing.md14,
    borderRadius: 18,
    padding: spacing.md14,
    backgroundColor: colors.card,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md12,
  },
  iconContainer: {
    height: 36,
    width: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm10,
  },
  title: {
    fontSize: fontSizes.large,
    fontWeight: '700',
    color: colors.text,
  },
  clientName: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    marginTop: spacing.xs2,
  },
  routeContainer: {
    backgroundColor: colors.grayOverlay,
    padding: spacing.sm10,
    borderRadius: 10,
    marginBottom: spacing.md12,
  },
  routeText: {
    fontSize: fontSizes.medium,
    color: colors.text,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
  },
  cost: {
    fontSize: fontSizes.large,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.xs2,
  },
  cancelButton: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.sm8,
    paddingHorizontal: spacing.md14,
  },
  cancelButtonText: {
    fontSize: fontSizes.small,
  },
  cancelBox: {
    marginTop: spacing.md12,
    padding: spacing.sm10,
    borderRadius: 10,
    backgroundColor: colors.cancelBoxOverlay,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  cancelTitle: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: spacing.xs4,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xl32,
    fontSize: fontSizes.xlarge,
  },
  cancellationReason: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs4,
  },
  refundAmount: {
    fontSize: fontSizes.medium,
    color: colors.success,
    marginBottom: spacing.xs6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md16,
  },
  bookingInfoBox: {
    backgroundColor: colors.grayOverlay,
    padding: spacing.md12,
    borderRadius: 12,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%', 
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.lg18,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  modalButtonRow: {
    marginTop:spacing.md16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md14,
  },
  modalTitle: {
    fontSize: fontSizes.large,
    fontWeight: '700',
    color: colors.text,
  },
  modalBookingDetails: {
    fontSize: fontSizes.medium,
    fontWeight: '700',
    color: colors.text,
  },
  cancelInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs6,
  },
});
