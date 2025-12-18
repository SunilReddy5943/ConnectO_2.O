import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { DUMMY_REFERRAL_HISTORY, ReferralRecord, ReferralStatus } from '../data/referralData';

type FilterType = 'ALL' | 'SUCCESSFUL' | 'PENDING' | 'FAILED';

export default function ReferralHistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filteredHistory = DUMMY_REFERRAL_HISTORY.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: ReferralStatus) => {
    switch (status) {
      case 'SUCCESSFUL':
        return COLORS.success;
      case 'PENDING':
        return COLORS.warning;
      case 'FAILED':
        return COLORS.error;
      case 'EXPIRED':
        return COLORS.textMuted;
      default:
        return COLORS.textMuted;
    }
  };

  const getStatusIcon = (status: ReferralStatus) => {
    switch (status) {
      case 'SUCCESSFUL':
        return 'checkmark-circle';
      case 'PENDING':
        return 'time';
      case 'FAILED':
        return 'close-circle';
      case 'EXPIRED':
        return 'ban';
      default:
        return 'help-circle';
    }
  };

  const getRoleIcon = (role: 'CUSTOMER' | 'WORKER') => {
    return role === 'WORKER' ? 'construct' : 'person';
  };

  const renderFilterButton = (label: string, value: FilterType) => (
    <TouchableOpacity
      key={value}
      style={[styles.filterChip, filter === value && styles.filterChipActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderReferralItem = ({ item }: { item: ReferralRecord }) => (
    <View style={styles.referralCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.referredUserName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.referredUserName}</Text>
            <View style={styles.roleTag}>
              <Ionicons
                name={getRoleIcon(item.referredUserRole)}
                size={12}
                color={COLORS.primary}
              />
              <Text style={styles.roleText}>{item.referredUserRole}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons
            name={getStatusIcon(item.status)}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.detailLabel}>Joined</Text>
          </View>
          <Text style={styles.detailValue}>{formatDate(item.joinedAt)}</Text>
        </View>

        {item.completedFirstJobAt && (
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="checkmark-done-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.detailLabel}>Completed</Text>
            </View>
            <Text style={styles.detailValue}>{formatDate(item.completedFirstJobAt)}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="share-social-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.detailLabel}>Shared via</Text>
          </View>
          <Text style={styles.detailValue}>{item.shareMethod}</Text>
        </View>

        {item.status === 'SUCCESSFUL' && (
          <View style={styles.rewardRow}>
            <View style={styles.rewardIcon}>
              <Ionicons name="wallet" size={20} color={COLORS.success} />
            </View>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardLabel}>Reward Earned</Text>
              <Text style={styles.rewardValue}>{formatCurrency(item.rewardAmount)}</Text>
            </View>
            {item.rewardCredited && (
              <View style={styles.creditedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                <Text style={styles.creditedText}>Credited</Text>
              </View>
            )}
          </View>
        )}

        {item.status === 'PENDING' && (
          <View style={styles.pendingNote}>
            <Ionicons name="information-circle" size={16} color={COLORS.warning} />
            <Text style={styles.pendingText}>
              Reward will be credited once {item.referredUserName.split(' ')[0]} completes first job
            </Text>
          </View>
        )}

        {item.status === 'FAILED' && item.failureReason && (
          <View style={styles.failureNote}>
            <Ionicons name="alert-circle" size={16} color={COLORS.error} />
            <Text style={styles.failureText}>{item.failureReason}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="file-tray-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No Referrals Found</Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'ALL'
          ? 'Start referring friends to see your history here'
          : `No ${filter.toLowerCase()} referrals`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referral History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {renderFilterButton('All', 'ALL')}
        {renderFilterButton('Successful', 'SUCCESSFUL')}
        {renderFilterButton('Pending', 'PENDING')}
        {renderFilterButton('Failed', 'FAILED')}
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{filteredHistory.length}</Text>
          <Text style={styles.summaryLabel}>
            {filter === 'ALL' ? 'Total' : filter}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: COLORS.success }]}>
            {formatCurrency(
              filteredHistory
                .filter((item) => item.rewardCredited)
                .reduce((sum, item) => sum + item.rewardAmount, 0)
            )}
          </Text>
          <Text style={styles.summaryLabel}>Earned</Text>
        </View>
      </View>

      {/* Referral List */}
      <FlatList
        data={filteredHistory}
        renderItem={renderReferralItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    marginRight: SPACING.sm,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.md,
  },
  listContent: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: 20,
  },
  referralCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  cardDetails: {
    gap: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.sm,
  },
  rewardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  rewardValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.success,
  },
  creditedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  creditedText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.success,
    marginLeft: 4,
  },
  pendingNote: {
    flexDirection: 'row',
    backgroundColor: COLORS.warning + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.sm,
  },
  pendingText: {
    flex: 1,
    fontSize: FONT_SIZES.xs,
    color: COLORS.warning,
    marginLeft: SPACING.sm,
    lineHeight: 18,
  },
  failureNote: {
    flexDirection: 'row',
    backgroundColor: COLORS.error + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.sm,
  },
  failureText: {
    flex: 1,
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginLeft: SPACING.sm,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
