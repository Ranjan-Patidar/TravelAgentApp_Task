import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import { useStore, ClientStatus } from '../../store';
import { colors, spacing } from '../../theme/colors';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { RootStackScreenProps } from '../../navigation/types';
import { AppCalendar } from '../../components/AppCalendar';
import { Header } from '../../components/Header';
import {
  validateClientForm,
  ClientFormData,
  ValidationErrors,
} from '../../utils/validation';

export const AddEditClientScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'AddEditClient'>) => {
  const { clientId } = route.params;
  const isEditing = !!clientId;
  const existingClient = useStore(state =>
    isEditing ? state.clients.find(c => c.id === clientId) : null,
  );
  const addClient = useStore(state => state.addClient);
  const updateClient = useStore(state => state.updateClient);
  const [name, setName] = useState(existingClient?.name || '');
  const [contact, setContact] = useState(existingClient?.contact || '');
  const [destination, setDestination] = useState(
    existingClient?.destination || '',
  );
  const [travelDates, setTravelDates] = useState(
    existingClient?.travelDates || '',
  );
  const [travelersCount, setTravelersCount] = useState(
    existingClient?.travelersCount?.toString() || '',
  );
  const [leadSource, setLeadSource] = useState(
    existingClient?.leadSource || '',
  );
  const [assignedAgent, setAssignedAgent] = useState(
    existingClient?.assignedAgent || '',
  );
  const [totalCost, setTotalCost] = useState(
    existingClient?.totalCost?.toString() || '',
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [activeField, setActiveField] = useState<'start' | 'end'>('start');
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const formatDate = (date: Date) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };
  const updateTravelDatesString = (start: Date, end: Date) => {
    setTravelDates(`${formatDate(start)} - ${formatDate(end)}`);
  };

  useEffect(() => {
    updateTravelDatesString(startDate, endDate);
  }, [startDate, endDate]);

  const validateForm = () => {
    const formData: ClientFormData = {
      name,
      contact,
      destination,
      travelDates,
      travelersCount,
      leadSource,
      assignedAgent,
      totalCost,
    };
    const newErrors = validateClientForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    const isValid = validateForm();
    if (!isValid) return;
    const payload = {
      id:
        isEditing && existingClient
          ? existingClient.id
          : Math.random().toString(36).substring(7),
      name,
      contact,
      destination,
      travelDates,
      travelersCount: parseInt(travelersCount, 10) || 1,
      leadSource,
      assignedAgent,
      status: existingClient?.status || 'Lead',
      statusHistory: existingClient?.statusHistory || [
        { status: 'Lead', date: new Date().toISOString().split('T')[0] },
      ],
      totalCost: Number(totalCost),
    };
    if (isEditing) updateClient(payload);
    else addClient(payload);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header
          title={isEditing ? 'Edit Client' : 'Add Client'}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full Name *"
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <TextInput
            value={contact}
            onChangeText={setContact}
            placeholder="Phone Number *"
            keyboardType="number-pad"
            maxLength={10}
          />
          {errors.contact && <Text style={styles.error}>{errors.contact}</Text>}

          <TextInput
            value={destination}
            onChangeText={setDestination}
            placeholder="Destination"
          />
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Travel Details</Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateCard}
              onPress={() => {
                setActiveField('start');
                setCalendarVisible(true);
              }}
            >
              <View style={styles.dateRow}>
                <View>
                  <Text style={styles.dateLabel}>From *</Text>
                  <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
                </View>
                <Calendar size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateCard}
              onPress={() => {
                setActiveField('end');
                setCalendarVisible(true);
              }}
            >
              <View style={styles.dateRow}>
                <View>
                  <Text style={styles.dateLabel}>To *</Text>
                  <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
                </View>
                <Calendar size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>

          {errors.travelDates && (
            <Text style={styles.error}>{errors.travelDates}</Text>
          )}

          <View style={styles.row}>
            <View style={styles.flex}>
              <TextInput
                value={travelersCount}
                onChangeText={setTravelersCount}
                placeholder="Travelers count *"
                keyboardType="number-pad"
              />
              {errors.travelersCount && (
                <Text style={styles.error}>{errors.travelersCount}</Text>
              )}
            </View>
            <View style={styles.flex}>
              <TextInput
                value={leadSource}
                onChangeText={setLeadSource}
                placeholder="Lead Source *"
              />
              {errors.leadSource && (
                <Text style={styles.error}>{errors.leadSource}</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Assignment</Text>
          <TextInput
            value={assignedAgent}
            onChangeText={setAssignedAgent}
            placeholder="Assigned Agent *"
          />
          {errors.assignedAgent && (
            <Text style={styles.error}>{errors.assignedAgent}</Text>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <TextInput
            value={totalCost}
            onChangeText={setTotalCost}
            placeholder="Total Cost *"
            keyboardType="number-pad"
          />
          {errors.totalCost && (
            <Text style={styles.error}>{errors.totalCost}</Text>
          )}
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title={isEditing ? 'Update Client' : 'Create Client'}
            onPress={handleSave}
          />
        </View>
      </ScrollView>

      <AppCalendar
        visible={calendarVisible}
        selectedDate={activeField === 'start' ? startDate : endDate}
        onClose={() => setCalendarVisible(false)}
        onSelect={date => {
          if (activeField === 'start') {
            if (date > endDate) {
              setStartDate(date);
              setEndDate(date);
              updateTravelDatesString(date, date);
            } else {
              setStartDate(date);
              updateTravelDatesString(date, endDate);
            }
          } else {
            if (date < startDate) {
              Alert.alert(
                'Invalid Date',
                'End date cannot be before start date',
              );
              return;
            }
            setEndDate(date);
            updateTravelDatesString(startDate, date);
          }
          setCalendarVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl40,
    paddingHorizontal:spacing.md16,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: spacing.md16,
    marginBottom: spacing.md16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm8,
    color: colors.textSecondary,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: spacing.xs4,
    marginBottom:spacing.xs6,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm8,
  },
  flex: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: spacing.sm8,
    paddingVertical: spacing.md16,
  },
  dateCard: {
    flex: 1,
    padding:spacing.md16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: spacing.xs4,
  },
  buttonWrapper: {
    marginTop:spacing.md16,
  },
});
