import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

type BusyReason = 'VACATION' | 'BUSY' | 'PERSONAL' | 'OTHER';

interface VacationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason?: BusyReason, busyUntil?: Date) => void;
}

function VacationModal({ visible, onClose, onConfirm }: VacationModalProps) {
  const [reason, setReason] = useState<BusyReason | undefined>(undefined);
  const [days, setDays] = useState('');

  const reasons: { label: string; value: BusyReason }[] = [
    { label: '🏖️ Vacation', value: 'VACATION' },
    { label: '⏰ Busy', value: 'BUSY' },
    { label: '👤 Personal', value: 'PERSONAL' },
    { label: '📝 Other', value: 'OTHER' },
  ];

  const handleConfirm = () => {
    let busyUntil: Date | undefined;
    
    if (days && parseInt(days) > 0) {
      busyUntil = new Date();
      busyUntil.setDate(busyUntil.getDate() + parseInt(days));
    }

    onConfirm(reason, busyUntil);
    onClose();
    setReason(undefined);
    setDays('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Set Busy Mode</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Reason (Optional)</Text>
            <View style={styles.reasonGrid}>
              {reasons.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.reasonChip,
                    reason === item.value && styles.reasonChipActive,
                  ]}
                  onPress={() => setReason(item.value)}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      reason === item.value && styles.reasonTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Auto-enable after (Optional)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Number of days"
                keyboardType="number-pad"
                value={days}
                onChangeText={setDays}
                maxLength={3}
              />
              <Text style={styles.inputSuffix}>days</Text>
            </View>

            {days && parseInt(days) > 0 && (
              <Text style={styles.helperText}>
                You'll be available again on{' '}
                {new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Set Busy</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

interface BusyModeToggleProps {
  compact?: boolean;
}

export default function BusyModeToggle({ compact = false }: BusyModeToggleProps) {
  const { isWorkerAvailable, setWorkerAvailability, toggleWorkerAvailability, activeRole } = useAuth();
  const [showModal, setShowModal] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(isWorkerAvailable ? 0 : 1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide animation
    Animated.spring(slideAnim, {
      toValue: isWorkerAvailable ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();

    // Glow animation when available
    if (isWorkerAvailable) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [isWorkerAvailable]);

  if (activeRole !== 'WORKER') return null;

  const handleToggle = () => {
    if (isWorkerAvailable) {
      // Turning ON Busy Mode - show modal
      setShowModal(true);
    } else {
      // Turning OFF Busy Mode - direct toggle
      toggleWorkerAvailability();
      Alert.alert(
        '✅ Available',
        'You are now available for new jobs',
        [{ text: 'OK' }]
      );
    }
  };

  const handleConfirmBusy = (reason?: BusyReason, busyUntil?: Date) => {
    setWorkerAvailability('BUSY', reason, busyUntil);
    
    let message = 'You will not receive new job requests';
    if (busyUntil) {
      message += ` until ${busyUntil.toLocaleDateString()}`;
    }
    
    Alert.alert(
      '🏖️ Busy Mode Active',
      message,
      [{ text: 'OK' }]
    );
  };

  const backgroundColor = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.success, COLORS.textMuted],
  });

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  if (compact) {
    // Compact version for header
    return (
      <>
        <TouchableOpacity
          style={styles.compactToggle}
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.compactTrack,
              { backgroundColor },
              isWorkerAvailable && {
                shadowColor: COLORS.success,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: glowOpacity,
                shadowRadius: 8,
                elevation: 4,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.compactThumb,
                { transform: [{ translateX }] },
              ]}
            >
              <Ionicons
                name={isWorkerAvailable ? 'checkmark' : 'close'}
                size={12}
                color={isWorkerAvailable ? COLORS.success : COLORS.error}
              />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>

        <VacationModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmBusy}
        />
      </>
    );
  }

  // Full version with label
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.toggleContainer}
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          <View style={styles.statusInfo}>
            <Ionicons
              name={isWorkerAvailable ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={isWorkerAvailable ? COLORS.success : COLORS.error}
            />
            <Text style={styles.statusText}>
              {isWorkerAvailable ? 'Available' : 'Busy'}
            </Text>
          </View>

          <Animated.View
            style={[
              styles.track,
              { backgroundColor },
            ]}
          >
            <Animated.View
              style={[
                styles.thumb,
                { transform: [{ translateX }] },
              ]}
            >
              <Ionicons
                name={isWorkerAvailable ? 'checkmark' : 'close'}
                size={16}
                color={isWorkerAvailable ? COLORS.success : COLORS.error}
              />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <VacationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmBusy}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    position: 'relative',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  compactToggle: {
    marginRight: SPACING.md,
  },
  compactTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  compactThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '85%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  reasonChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    margin: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  reasonChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reasonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
  reasonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
  },
  inputSuffix: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
  helperText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.warning,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
