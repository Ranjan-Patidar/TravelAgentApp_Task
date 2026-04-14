import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Mail, Calendar, MapPin, Plane, User } from 'lucide-react-native';
import { useStore } from '../../store';
import { colors, fontSizes, spacing, strings } from '../../theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { RootStackScreenProps } from '../../navigation/types';
import { Header } from '../../components/Header';
import { getStatusType } from '../../utils/statusHelper';

export const ClientDetailScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'ClientDetail'>) => {
  const { clientId } = route.params || {};
  const clients = useStore(state => state.clients);
  const allPayments = useStore(state => state.payments);
  const allBookings = useStore(state => state.bookings);
  const updateClientStatus = useStore(state => state.updateClientStatus);
  const confirmTrip = useStore(state => state.confirmTrip);
  const client = clients.find(c => c.id === clientId);
  const payments = allPayments.filter(p => p.clientId === clientId);
  const bookings = allBookings.filter(b => b.clientId === clientId);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Lifecycle'>(
    'Overview',
  );

  if (!client) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Client not found</Text>
      </View>
    );
  }

  const workflowStages = [
    { status: 'Lead', label: 'Lead Created' },
    { status: 'Assigned', label: 'Agent Assigned' },
    { status: 'In Discussion', label: 'Discussion Started' },
    { status: 'Confirmed', label: 'Client Confirmed' },
    { status: 'Payment Received', label: 'Payment Received' },
    { status: 'Booking Started', label: 'Booking Started' },
    { status: 'Trip Confirmed', label: 'Trip Confirmed' },
  ] as const;

  const currentStageIndex = workflowStages.findIndex(
    stage => stage.status === client.status,
  );
  const getStageDate = (status: string) =>
    client.statusHistory.find(entry => entry.status === status)?.date;
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = (client.totalCost || 0) - totalPaid;
  const isOverpaid = pendingAmount < 0;

  const nextAction = (() => {
    switch (client.status) {
      case 'Lead':
        return {
          label: 'Assign Agent',
          enabled: !!client.assignedAgent,
          note: client.assignedAgent
            ? 'Move this lead into discussion after assigning the agent.'
            : 'Assign an agent in edit before moving to discussion.',
          action: () => updateClientStatus(client.id, 'Assigned'),
        };
      case 'Assigned':
        return {
          label: 'Start Discussion',
          enabled: true,
          note: 'Begin the sales conversation and add quotation details.',
          action: () => updateClientStatus(client.id, 'In Discussion'),
        };
      case 'In Discussion':
        return {
          label: 'Confirm Client',
          enabled: true,
          note: 'Mark the client as confirmed before payment.',
          action: () => updateClientStatus(client.id, 'Confirmed'),
        };
      case 'Confirmed':
        return {
          label: 'Mark Payment Received',
          enabled: totalPaid > 0,
          note:
            totalPaid > 0
              ? 'Payment received. Move forward to booking.'
              : 'Add payment to unlock booking.',
          action: () => updateClientStatus(client.id, 'Payment Received'),
        };
      case 'Payment Received':
        return {
          label: 'Start Booking',
          enabled: totalPaid > 0,
          note: 'Begin hotel or travel booking now that payment is tracked.',
          action: () => updateClientStatus(client.id, 'Booking Started'),
        };
      case 'Booking Started':
        return {
          label: 'Confirm Trip',
          enabled: totalPaid >= client.totalCost && bookings.length > 0,
          note:
            totalPaid >= client.totalCost
              ? bookings.length > 0
                ? 'All bookings are in place. Confirm the trip.'
                : 'Add at least one booking before confirming the trip.'
              : 'Full payment is required to confirm the trip.',
          action: () => {
            if (totalPaid < client.totalCost) {
              Alert.alert(
                strings.paymentRequiredTitle,
                strings.paymentRequiredMessage,
              );
              return;
            }
            confirmTrip(client.id);
          },
        };
      default:
        return null;
    }
  })();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Client Details" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {client.name?.charAt(0) || 'U'}
              </Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.clientName}>{client.name || 'N/A'}</Text>
              <Text style={styles.agentInfo}>
                Agent Name: {client.assignedAgent || 'No Agent Assigned'}
              </Text>
            </View>
            <Badge
              label={client.status}
              status={getStatusType(client.status)}
            />
          </View>
          <InfoItem
            icon={<MapPin size={16} color={colors.primary} />}
            title="Destination:"
            text={client.destination || 'N/A'}
          />
          <InfoItem
            icon={<Calendar size={16} color={colors.primary} />}
            title="Dates:"
            text={client.travelDates || 'N/A'}
          />
          <InfoItem
            icon={<User size={16} color={colors.primary} />}
            title="Travelers count:"
            text={`${client.travelersCount || 0}`}
          />
          <InfoItem
            icon={<Mail size={16} color={colors.primary} />}
            title="Phone Number:"
            text={client.contact || 'N/A'}
          />

          <View style={styles.costBox}>
            <Text style={styles.costLabel}>Total Cost</Text>
            <Text style={styles.costValue}>₹{client.totalCost ?? 0}</Text>
          </View>
        </Card>
        <View style={styles.tabsContainer}>
          {['Overview', 'Lifecycle'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {nextAction && (
          <Card style={styles.actionCard}>
            <Text style={styles.actionTitle}>{nextAction.label}</Text>
            <Text style={styles.actionNote}>{nextAction.note}</Text>
            <TouchableOpacity
              style={[
                styles.actionButton,
                !nextAction.enabled && styles.actionButtonDisabled,
              ]}
              onPress={nextAction.action}
              disabled={!nextAction.enabled}
            >
              <Text style={styles.actionButtonText}>{nextAction.label}</Text>
            </TouchableOpacity>
          </Card>
        )}
        {activeTab === 'Overview' && (
          <>
            <SectionHeader
              title={`Payments`}
              subtitle={
                isOverpaid
                  ? `Overpaid ₹${Math.abs(pendingAmount)}`
                  : `Pending ₹${pendingAmount}`
              }
              onPress={() => navigation.navigate('Payment', { clientId })}
            />

            {payments.length === 0 ? (
              <Text style={styles.emptyText}>No payments yet</Text>
            ) : (
              payments.map(p => (
                <Card key={p.id} style={styles.rowCard}>
                  <View>
                    <Text style={styles.itemTitle}>Amount Received</Text>
                    <Text style={styles.itemSubtitle}>{p.date}</Text>
                  </View>
                  <Text style={styles.amount}>₹{p.amount}</Text>
                </Card>
              ))
            )}

            <View style={{ marginTop: 30 }}>
              <SectionHeader
                title="Bookings"
                onPress={() => navigation.navigate('Booking', { clientId })}
              />
              {bookings.length === 0 ? (
                <Text style={styles.emptyText}>No bookings yet</Text>
              ) : (
                bookings.map(b => (
                  <Card key={b.id} style={styles.rowCard}>
                    <View>
                      <Text style={styles.itemTitle}>{b.name}</Text>
                      <Text style={styles.itemSubtitle}>{b.details}</Text>
                    </View>
                  </Card>
                ))
              )}
            </View>
          </>
        )}

        {activeTab === 'Lifecycle' && (
          <View style={styles.timeline}>
            {workflowStages.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const stageDate = getStageDate(stage.status);

              return (
                <View key={stage.status} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[styles.dot, isCompleted && styles.dotActive]}
                    />
                    {index !== workflowStages.length - 1 && (
                      <View
                        style={[styles.line, isCompleted && styles.lineActive]}
                      />
                    )}
                  </View>

                  <View style={styles.timelineRight}>
                    <Text
                      style={[
                        styles.stageText,
                        isCurrent && styles.currentStage,
                      ]}
                    >
                      {stage.label}
                    </Text>
                    {stageDate && (
                      <Text style={styles.stageDate}>{stageDate}</Text>
                    )}
                    {isCurrent && (
                      <Text style={styles.currentLabel}>Current Stage</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoItem = ({ icon, text, title }: any) => (
  <View style={styles.infoItem}>
    {icon}
    <Text style={styles.infoText}>{title}</Text>
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const SectionHeader = ({ title, subtitle, onPress }: any) => (
  <View style={styles.sectionHeader}>
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSub}>{subtitle}</Text>}
    </View>
    {onPress && (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.manage}>Manage</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md16,
    paddingBottom: spacing.xl40,
  },
  profileCard: {
    padding:spacing.lg18,
    borderRadius: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:spacing.md16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  agentInfo: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs2,
  },
  infoItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm10,
  },
  infoText: {
    marginLeft:spacing.xs6,
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  costBox: {
    backgroundColor: colors.primary + '15',
    padding: spacing.md12,
    borderRadius: 12,
    marginTop:spacing.sm10,
  },
  costLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  costValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: 12,
    padding: spacing.xs4,
    marginVertical:spacing.md16,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.card,
    borderRadius: 10,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  manage: {
    color: colors.primary,
    fontWeight: '600',
  },
  actionCard: {
    marginBottom: spacing.md14,
    padding: spacing.md16,
    borderRadius: 18,
    backgroundColor: colors.card,
  },
  actionTitle: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '700',
    marginBottom:spacing.xs6,
  },
  actionNote: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.md12,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical:spacing.md12,
    borderRadius: 14,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: colors.border,
  },
  actionButtonText: {
    color:colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  rowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md14,
    borderRadius: 12,
    marginBottom: spacing.sm8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.success,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSizes.large,
  },
  timeline: {
    marginTop: spacing.sm8,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.success,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
  },
  lineActive: {
    backgroundColor: colors.success,
  },
  timelineRight: {
    flex: 1,
    paddingBottom:spacing.md16,
  },
  stageText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  stageDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs2,
  },
  currentStage: {
    color: colors.success,
    fontWeight: '700',
  },
  currentLabel: {
    fontSize: 11,
    color: colors.info,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
