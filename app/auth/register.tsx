import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

type UserRole = 'CUSTOMER' | 'WORKER';

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!city.trim()) {
      newErrors.city = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (step === 2 && validateStep2()) {
      setIsLoading(true);
      // Simulate registration
      setTimeout(() => {
        setIsLoading(false);
        router.push({
          pathname: '/auth/otp',
          params: { 
            phone: phone.replace(/\D/g, ''), 
            isRegistration: 'true',
            role: role,
            name: name,
            city: city,
          },
        });
      }, 1000);
    }
  };

  const renderRoleSelection = () => (
    <View style={styles.roleContainer}>
      <Text style={styles.roleTitle}>I want to...</Text>
      
      <TouchableOpacity
        style={[styles.roleCard, role === 'CUSTOMER' && styles.roleCardSelected]}
        onPress={() => handleRoleSelect('CUSTOMER')}
        activeOpacity={0.8}
      >
        <View style={[styles.roleIcon, { backgroundColor: COLORS.primary + '15' }]}>
          <Ionicons name="search" size={32} color={COLORS.primary} />
        </View>
        <View style={styles.roleInfo}>
          <Text style={styles.roleCardTitle}>Hire Workers</Text>
          <Text style={styles.roleCardSubtitle}>
            Find skilled professionals for your projects
          </Text>
        </View>
        <Ionicons
          name={role === 'CUSTOMER' ? 'checkmark-circle' : 'chevron-forward'}
          size={24}
          color={role === 'CUSTOMER' ? COLORS.primary : COLORS.textMuted}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleCard, role === 'WORKER' && styles.roleCardSelected]}
        onPress={() => handleRoleSelect('WORKER')}
        activeOpacity={0.8}
      >
        <View style={[styles.roleIcon, { backgroundColor: COLORS.secondary + '15' }]}>
          <Ionicons name="construct" size={32} color={COLORS.secondary} />
        </View>
        <View style={styles.roleInfo}>
          <Text style={styles.roleCardTitle}>Find Work</Text>
          <Text style={styles.roleCardSubtitle}>
            Showcase your skills and get hired
          </Text>
        </View>
        <Ionicons
          name={role === 'WORKER' ? 'checkmark-circle' : 'chevron-forward'}
          size={24}
          color={role === 'WORKER' ? COLORS.secondary : COLORS.textMuted}
        />
      </TouchableOpacity>
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.formContainer}>
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        leftIcon="person-outline"
        error={errors.name}
        autoCapitalize="words"
      />

      <View style={styles.phoneInputContainer}>
        <Text style={styles.inputLabel}>Phone Number</Text>
        <View style={styles.phoneRow}>
          <View style={styles.countryCode}>
            <Text style={styles.flag}>🇮🇳</Text>
            <Text style={styles.code}>+91</Text>
          </View>
          <View style={styles.phoneInput}>
            <Input
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.phone}
              style={{ marginBottom: 0 }}
            />
          </View>
        </View>
      </View>

      <Input
        label="City"
        placeholder="Enter your city"
        value={city}
        onChangeText={setCity}
        leftIcon="location-outline"
        error={errors.city}
      />

      <Button
        title="Continue"
        onPress={handleContinue}
        loading={isLoading}
        fullWidth
        size="lg"
        style={styles.continueButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
              <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
              <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>
              {step === 1 ? 'Create Account' : 'Basic Information'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? 'Choose how you want to use ConnectO'
                : 'Tell us a bit about yourself'}
            </Text>

            {step === 1 ? renderRoleSelection() : renderBasicInfo()}
          </View>

          <View style={styles.footer}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink} onPress={() => router.push('/auth/login')}>
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 40,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  progressLineActive: {
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  roleContainer: {
    gap: SPACING.md,
  },
  roleTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '05',
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  roleCardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  roleCardSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  formContainer: {
    gap: SPACING.sm,
  },
  phoneInputContainer: {
    marginBottom: SPACING.base,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
  },
  flag: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  code: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  phoneInput: {
    flex: 1,
  },
  continueButton: {
    marginTop: SPACING.lg,
  },
  footer: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  loginText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
