import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, User, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useThemeColors, useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, Typography, BorderRadius, Shadows } from '@/constants/Colors';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [validationState, setValidationState] = useState({
    email: null as 'valid' | 'invalid' | null,
    password: null as 'valid' | 'invalid' | null,
    name: null as 'valid' | 'invalid' | null,
  });
  const router = useRouter();
  const colors = useThemeColors();
  const colorScheme = useColorScheme();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Real-time validation
    if (field === 'email' && value.length > 0) {
      setValidationState(prev => ({ ...prev, email: validateEmail(value) ? 'valid' : 'invalid' }));
    } else if (field === 'password' && value.length > 0) {
      setValidationState(prev => ({ ...prev, password: validatePassword(value) ? 'valid' : 'invalid' }));
    } else if (field === 'name' && value.length > 0) {
      setValidationState(prev => ({ ...prev, name: value.length >= 2 ? 'valid' : 'invalid' }));
    }
  };

  const handleSubmit = () => {
    // Validate all fields
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);
    const nameValid = !isLogin ? formData.name.length >= 2 : true;

    if (emailValid && passwordValid && nameValid) {
      router.replace('/(tabs)');
    } else {
      setValidationState({
        email: emailValid ? 'valid' : 'invalid',
        password: passwordValid ? 'valid' : 'invalid',
        name: nameValid ? 'valid' : 'invalid',
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setValidationState({ email: null, password: null, name: null });
  };

  const getInputBorderColor = (field: 'email' | 'password' | 'name') => {
    const state = validationState[field];
    if (state === 'valid') return colors.success;
    if (state === 'invalid') return colors.error;
    return colors.border;
  };

  const getValidationIcon = (field: 'email' | 'password' | 'name') => {
    const state = validationState[field];
    if (state === 'valid') return <CheckCircle size={20} color={colors.success} />;
    if (state === 'invalid') return <AlertCircle size={20} color={colors.error} />;
    return null;
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary }]}>UseBy</Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>Smart expiry tracking for your household</Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface }, colorScheme === 'light' ? Shadows.light : Shadows.dark]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {isLogin ? 'Sign in to continue' : 'Join UseBy today'}
          </Text>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
              <View style={[
                styles.inputWrapper, 
                { backgroundColor: colors.background, borderColor: getInputBorderColor('name') }
              ]}>
                <User size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textMuted}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                />
                {getValidationIcon('name')}
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
            <View style={[
              styles.inputWrapper, 
              { backgroundColor: colors.background, borderColor: getInputBorderColor('email') }
            ]}>
              <Mail size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
              />
              {getValidationIcon('email')}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
            <View style={[
              styles.inputWrapper, 
              { backgroundColor: colors.background, borderColor: getInputBorderColor('password') }
            ]}>
              <Lock size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.primary} />
                ) : (
                  <Eye size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[
              styles.submitButton, 
              { backgroundColor: colors.primary },
              colorScheme === 'light' ? Shadows.light : {}
            ]} 
            onPress={handleSubmit}
          >
            <Text style={[styles.submitButtonText, { color: colorScheme === 'light' ? colors.surface : colors.background }]}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity style={[
            styles.socialButton, 
            { backgroundColor: colors.background, borderColor: colors.border },
            colorScheme === 'light' ? Shadows.light : Shadows.dark
          ]}>
            <Text style={[styles.socialButtonText, { color: colors.text }]}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[
            styles.socialButton, 
            { backgroundColor: colors.background, borderColor: colors.border },
            colorScheme === 'light' ? Shadows.light : Shadows.dark
          ]}>
            <Text style={[styles.socialButtonText, { color: colors.text }]}>Continue with Apple</Text>
          </TouchableOpacity>

          <View style={styles.switchAuth}>
            <Text style={[styles.switchAuthText, { color: colors.textMuted }]}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={[styles.switchAuthLink, { color: colors.primary }]}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  logo: {
    fontSize: 36,
    ...Typography.title,
    marginBottom: Spacing.sm,
  },
  tagline: {
    ...Typography.body,
    fontSize: 16,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.title,
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    marginBottom: Spacing.xxl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    height: 56,
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    ...Typography.body,
    fontSize: 16,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
    minHeight: 44,
    justifyContent: 'center',
  },
  forgotPasswordText: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
  },
  submitButton: {
    borderRadius: BorderRadius.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  submitButtonText: {
    ...Typography.subtitle,
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...Typography.body,
    marginHorizontal: Spacing.lg,
  },
  socialButton: {
    borderRadius: BorderRadius.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  socialButtonText: {
    ...Typography.subtitle,
  },
  switchAuth: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    minHeight: 44,
  },
  switchAuthText: {
    ...Typography.body,
  },
  switchAuthLink: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
  },
});