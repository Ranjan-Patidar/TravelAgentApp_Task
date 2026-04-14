import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { colors, spacing } from '../../theme/colors';
import { RootStackScreenProps } from '../../navigation/types';
import { getValidationError } from '../../utils/validation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../../store';

export const LoginScreen = ({ navigation }: RootStackScreenProps<'Login'>) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>(
    {},
  );
  const setUser = useStore((state) => state.setUser);
  const handleLogin = async () => {
    const nameError = getValidationError('name', name);
    const emailError = getValidationError('email', email);
    const passwordError = getValidationError('password', password);

    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const user = { name, email };
      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/loginBg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
          >
            <View style={styles.centerWrapper}>
              <View style={styles.header}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Login to track leads, bookings, and client journeys.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.formTitle}>Login Here !</Text>
                <TextInput
                  placeholder="Full Name"
                  value={name}
                  onChangeText={text => {
                    setName(text);
                    if (errors.name)
                      setErrors({ ...errors, name: undefined });
                  }}
                  autoCapitalize="words"
                  error={errors.name}
                />

                <TextInput
                  placeholder="Email Address"
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />

                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  secureTextEntry
                  error={errors.password}
                />

                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  style={styles.loginButton}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayDark,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg24,
  },
  centerWrapper: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.sm8,
  },
  subtitle: {
    fontSize: 14,
    color:colors.white,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: '85%',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.md16,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.loginCardGrayOverlay,
    borderRadius: 24,
    padding: spacing.lg24,
    borderWidth: 1,
    borderColor: colors.loginCardBorderGray,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  loginButton: {
    marginTop: spacing.md16,
  },
});