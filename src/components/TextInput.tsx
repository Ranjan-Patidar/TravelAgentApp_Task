import React from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet, View, Text } from 'react-native';
import { colors, spacing } from '../theme/colors';

interface TextInputProps extends RNTextInputProps {
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ error, ...props }) => {
  return (
    <View>
      <RNTextInput
        style={[styles.input, error && styles.inputError, props.style]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md16,
    paddingVertical: spacing.md16,
    fontSize: 15,
    color: colors.text,
    marginTop:spacing.md14,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginLeft: spacing.xs4,
  },
});