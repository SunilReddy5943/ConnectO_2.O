import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../constants/theme';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onVoicePress?: () => void;
  showVoice?: boolean;
  autoFocus?: boolean;
  editable?: boolean;
  onPress?: () => void;
  isLoading?: boolean;
}

export default function SearchBar({
  placeholder = 'Search plumbers, electricians...',
  value,
  onChangeText,
  onSubmit,
  onVoicePress,
  showVoice = true,
  autoFocus = false,
  editable = true,
  onPress,
  isLoading = false,
}: SearchBarProps) {
  const router = useRouter();
  const [localValue, setLocalValue] = useState(value || '');

  const handleChangeText = (text: string) => {
    setLocalValue(text);
    onChangeText?.(text);
  };

  const handleSubmit = () => {
    if (localValue.trim()) {
      onSubmit?.(localValue.trim());
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (!editable) {
      router.push('/search');
    }
  };

  if (!editable) {
    return (
      <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.searchIcon}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          editable={false}
          pointerEvents="none"
        />
        {showVoice && (
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={(e) => {
              e.stopPropagation();
              onVoicePress?.();
            }}
          >
            <Ionicons name="mic" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
        )}
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={localValue}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {localValue.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => handleChangeText('')}
        >
          <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
      {showVoice && (
        <TouchableOpacity style={styles.voiceButton} onPress={onVoicePress}>
          <View style={styles.voiceIconContainer}>
            <Ionicons name="mic" size={18} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    height: 52,
    ...SHADOWS.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  voiceButton: {
    marginLeft: SPACING.sm,
  },
  voiceIconContainer: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
