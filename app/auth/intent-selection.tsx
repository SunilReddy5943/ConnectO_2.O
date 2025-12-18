import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

type Intent = 'CUSTOMER' | 'WORKER';

export default function IntentSelectionScreen() {
  const router = useRouter();
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const customerScale = useRef(new Animated.Value(1)).current;
  const workerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();
  }, []);

  const handleSelectIntent = (intent: Intent) => {
    setSelectedIntent(intent);
    
    // Animate selection
    const scaleAnim = intent === 'CUSTOMER' ? customerScale : workerScale;
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 5,
      }),
    ]).start();
  };

  const handleContinue = (intent: Intent) => {
    handleSelectIntent(intent);
    
    // Navigate to login with intent
    setTimeout(() => {
      router.push({
        pathname: '/auth/login',
        params: { intent },
      });
    }, 300);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="construct" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>How do you want to use ConnectO?</Text>
          <Text style={styles.subtitle}>
            Choose your primary way of using the app. You can always switch later.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* Customer Card */}
          <Animated.View style={{ transform: [{ scale: customerScale }] }}>
            <TouchableOpacity
              style={[
                styles.card,
                selectedIntent === 'CUSTOMER' && styles.cardSelected,
              ]}
              onPress={() => handleContinue('CUSTOMER')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={selectedIntent === 'CUSTOMER' ? ['#3B82F6', '#2563EB'] : ['#F8FAFC', '#F1F5F9']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardIcon}>
                  <Ionicons 
                    name="person" 
                    size={36} 
                    color={selectedIntent === 'CUSTOMER' ? COLORS.white : COLORS.primary} 
                  />
                </View>
                
                <Text style={[
                  styles.cardTitle,
                  selectedIntent === 'CUSTOMER' && styles.cardTitleSelected,
                ]}>
                  I'm looking for workers
                </Text>
                
                <Text style={[
                  styles.cardSubtitle,
                  selectedIntent === 'CUSTOMER' && styles.cardSubtitleSelected,
                ]}>
                  Hire plumbers, electricians, carpenters & more
                </Text>

                <View style={[
                  styles.cardButton,
                  selectedIntent === 'CUSTOMER' && styles.cardButtonSelected,
                ]}>
                  <Text style={[
                    styles.cardButtonText,
                    selectedIntent === 'CUSTOMER' && styles.cardButtonTextSelected,
                  ]}>
                    Continue as Customer
                  </Text>
                  <Ionicons 
                    name="arrow-forward" 
                    size={18} 
                    color={selectedIntent === 'CUSTOMER' ? COLORS.white : COLORS.primary}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Worker Card */}
          <Animated.View style={{ transform: [{ scale: workerScale }] }}>
            <TouchableOpacity
              style={[
                styles.card,
                selectedIntent === 'WORKER' && styles.cardSelected,
              ]}
              onPress={() => handleContinue('WORKER')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={selectedIntent === 'WORKER' ? ['#F97316', '#EA580C'] : ['#F8FAFC', '#F1F5F9']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardIcon}>
                  <Ionicons 
                    name="construct" 
                    size={36} 
                    color={selectedIntent === 'WORKER' ? COLORS.white : COLORS.secondary} 
                  />
                </View>
                
                <Text style={[
                  styles.cardTitle,
                  selectedIntent === 'WORKER' && styles.cardTitleSelected,
                ]}>
                  I'm a worker
                </Text>
                
                <Text style={[
                  styles.cardSubtitle,
                  selectedIntent === 'WORKER' && styles.cardSubtitleSelected,
                ]}>
                  Get jobs, earn money, grow your business
                </Text>

                <View style={[
                  styles.cardButton,
                  selectedIntent === 'WORKER' && styles.cardButtonSelected,
                ]}>
                  <Text style={[
                    styles.cardButtonText,
                    selectedIntent === 'WORKER' && styles.cardButtonTextSelected,
                  ]}>
                    Continue as Worker
                  </Text>
                  <Ionicons 
                    name="arrow-forward" 
                    size={18} 
                    color={selectedIntent === 'WORKER' ? COLORS.white : COLORS.secondary}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.textMuted} />
          <Text style={styles.footerText}>
            You can switch between modes anytime from your profile
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SPACING.base,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
  },
  cardsContainer: {
    flex: 1,
    gap: SPACING.md,
  },
  card: {
    borderRadius: BORDER_RADIUS['2xl'],
    overflow: 'hidden',
    ...SHADOWS.lg,
    height: 200, // Fixed height for each card
  },
  cardSelected: {
    ...SHADOWS.xl,
  },
  cardGradient: {
    padding: SPACING.lg,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardTitleSelected: {
    color: COLORS.white,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  cardSubtitleSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.xs,
  },
  cardButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cardButtonTextSelected: {
    color: COLORS.white,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
});
