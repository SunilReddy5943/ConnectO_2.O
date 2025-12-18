import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

interface RoleSwitcherProps {
  showLabels?: boolean;
  compact?: boolean;
}

export default function RoleSwitcher({ showLabels = true, compact = false }: RoleSwitcherProps) {
  const { user, activeRole, hasRole, switchRole } = useAuth();
  const [slideAnim] = useState(new Animated.Value(activeRole === 'CUSTOMER' ? 0 : 1));
  const [isAnimating, setIsAnimating] = useState(false);

  // Show switcher only if user has both roles
  const canSwitchRoles = hasRole('CUSTOMER') && hasRole('WORKER');
  
  if (!canSwitchRoles) {
    return null;
  }

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeRole === 'CUSTOMER' ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [activeRole]);

  const handleSwitch = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newRole = activeRole === 'CUSTOMER' ? 'WORKER' : 'CUSTOMER';
    
    Animated.spring(slideAnim, {
      toValue: newRole === 'CUSTOMER' ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();

    await switchRole(newRole);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const cardWidth = compact ? width - SPACING.base * 4 : width - SPACING.base * 2;
  const slideWidth = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, cardWidth / 2 - 4],
  });

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {showLabels && (
        <View style={styles.labelContainer}>
          <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
          <Text style={styles.label}>Switch Mode</Text>
        </View>
      )}
      
      <View style={[styles.switchCard, compact && styles.switchCardCompact, { width: cardWidth }]}>
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [{ translateX: slideWidth }],
            },
          ]}
        />
        
        <TouchableOpacity
          style={styles.option}
          onPress={handleSwitch}
          activeOpacity={0.7}
          disabled={isAnimating}
        >
          <View style={[
            styles.iconContainer,
            activeRole === 'CUSTOMER' && styles.iconContainerActive,
          ]}>
            <Ionicons
              name="person"
              size={20}
              color={activeRole === 'CUSTOMER' ? COLORS.white : COLORS.textMuted}
            />
          </View>
          <Text style={[
            styles.optionText,
            activeRole === 'CUSTOMER' && styles.optionTextActive,
          ]}>
            Customer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={handleSwitch}
          activeOpacity={0.7}
          disabled={isAnimating}
        >
          <View style={[
            styles.iconContainer,
            activeRole === 'WORKER' && styles.iconContainerActive,
          ]}>
            <Ionicons
              name="construct"
              size={20}
              color={activeRole === 'WORKER' ? COLORS.white : COLORS.textMuted}
            />
          </View>
          <Text style={[
            styles.optionText,
            activeRole === 'WORKER' && styles.optionTextActive,
          ]}>
            Worker
          </Text>
        </TouchableOpacity>
      </View>

      {showLabels && (
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            {activeRole === 'CUSTOMER' 
              ? '👤 Hiring skilled workers for your projects'
              : '🔧 Finding work and showcasing your skills'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
  },
  containerCompact: {
    marginVertical: SPACING.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  switchCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    padding: 4,
    position: 'relative',
    ...SHADOWS.sm,
  },
  switchCardCompact: {
    padding: 3,
  },
  slider: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: '50%',
    bottom: 4,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    zIndex: 1,
  },
  iconContainer: {
    marginRight: SPACING.xs,
  },
  iconContainerActive: {
    // Active state handled by icon color
  },
  optionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  optionTextActive: {
    color: COLORS.white,
  },
  description: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  descriptionText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
