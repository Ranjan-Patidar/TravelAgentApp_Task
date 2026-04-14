import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { TextInput } from './TextInput';
import { colors, spacing, strings } from '../theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = strings.searchClients,
}) => {
  return (
    <View style={styles.container}>
      <Search size={18} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText('')}
        >
          <X size={12} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:spacing.md16,
    marginTop: spacing.md12,
    height: 48,
    paddingHorizontal: spacing.md12,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: colors.text,
    marginLeft: spacing.sm8,
    paddingVertical: 0,
    paddingRight: spacing.xl32,
    textAlignVertical: 'center', 
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%', 
    transform: [{ translateY: -10 }], 
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
