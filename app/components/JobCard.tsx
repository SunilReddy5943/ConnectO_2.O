import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { DummyJob, getTimeAgo } from '../data/dummyJobs';

interface JobCardProps {
  job: DummyJob;
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/job/${job.id}`);
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'NEW':
        return COLORS.primary;
      case 'ONGOING':
        return COLORS.warning;
      case 'COMPLETED':
        return COLORS.success;
      case 'CANCELLED':
        return COLORS.danger;
      default:
        return COLORS.textMuted;
    }
  };

  const getUrgencyBadge = () => {
    if (job.urgency === 'HIGH') {
      return (
        <View style={styles.urgentBadge}>
          <Ionicons name="flash" size={12} color={COLORS.white} />
          <Text style={styles.urgentText}>URGENT</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {job.title}
          </Text>
          {getUrgencyBadge()}
        </View>
        <Text style={styles.budget}>₹{job.budget_min}-{job.budget_max}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="person-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{job.customer_name}</Text>
          {job.is_verified_customer && (
            <Ionicons name="checkmark-circle" size={14} color={COLORS.verified} style={{ marginLeft: 4 }} />
          )}
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{job.distance_km} km away</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{job.category}</Text>
        </View>
        <View style={styles.footerRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {job.status}
            </Text>
          </View>
          <Text style={styles.timeText}>{getTimeAgo(job.posted_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: 4,
    alignSelf: 'flex-start',
    gap: 2,
  },
  urgentText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.white,
  },
  budget: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.primary,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  timeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
});
