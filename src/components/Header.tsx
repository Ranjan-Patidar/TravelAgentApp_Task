import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { colors, spacing } from '../theme/colors';

type Props = {
  title: string;
  onBackPress?: () => void;
  rightIcon?: React.ReactNode;
};

export const Header = ({ title, onBackPress, rightIcon }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBackPress ? (
          <TouchableOpacity onPress={onBackPress} style={styles.iconBtn}>
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.side}>
        {rightIcon ? rightIcon : <View style={styles.placeholder} />}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md16,
    paddingVertical: spacing.md12,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  side: {
    width: 40,
    alignItems: 'center',
  },
  placeholder: {
    width: 24,
  },
  iconBtn: {
    padding:spacing.xs6,
    borderRadius: 10,
    backgroundColor: colors.cardBlueBg,
  },
});