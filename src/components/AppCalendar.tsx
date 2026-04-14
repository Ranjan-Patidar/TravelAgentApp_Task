import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors, spacing } from '../theme/colors';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Button } from './Button';

type Props = {
  visible: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
};

export const AppCalendar = ({
  visible,
  selectedDate,
  onClose,
  onSelect,
}: Props) => {
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const today = formatDate(new Date());
  const selected = formatDate(selectedDate);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Calendar
            minDate={today}
            onDayPress={(day) => onSelect(new Date(day.dateString))}
            renderArrow={(direction) => (
              <View style={styles.arrow}>
                {direction === 'left' ? (
                  <ChevronLeft size={16} color={colors.primary} />
                ) : (
                  <ChevronRight size={16} color={colors.primary} />
                )}
              </View>
            )}
            markedDates={{
              [today]: {
                customStyles: {
                  container: {
                    backgroundColor: colors.todayDate,
                    borderRadius: 8,
                  },
                  text: { color: colors.black, fontWeight: '600' },
                },
              },
              [selected]: {
                customStyles: {
                  container: {
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                  },
                  text: { color: colors.white, fontWeight: '700' },
                },
              },
            }}
            markingType="custom"
            theme={{
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              textMonthFontWeight: '700',
              textDayFontWeight: '500',
              textDayHeaderFontWeight: '600',
              textSectionTitleColor: colors.textSecondary,
              textDisabledColor: colors.dateDisableGray,
            }}
            style={{ borderRadius: 12 }}
          />
          <View style={styles.buttonWrapper}>
            <Button title="Close" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg20,
  },
  arrow: {
    height: 32,
    width: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBlueBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    marginTop: spacing.md16,
    width: '50%',
    alignSelf: 'center',
  },
});