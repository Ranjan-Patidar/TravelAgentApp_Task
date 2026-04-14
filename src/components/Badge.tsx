import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/colors';

interface BadgeProps {
  label: string;
  status?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ label, status = 'default' }) => {
  let backgroundColor = colors.border;
  let textColor = colors.textSecondary;

  switch (status) {
    case 'success':
      backgroundColor = colors.successStatusBg;
      textColor = colors.success;
      break;
    case 'warning':
      backgroundColor = colors.warningStatusBg;
      textColor = colors.warning;
      break;
    case 'danger':
      backgroundColor = colors.dangerStatusBg;
      textColor = colors.danger;
      break;
    case 'info':colors.infoStatusBg;
      textColor = colors.info;
      break;
  }

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm8,
    paddingVertical: spacing.xs6,
    borderRadius: 999, 
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});