import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Linking,
  Platform,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import {
  DUMMY_USER_REFERRAL_PROFILE,
  DUMMY_REFERRAL_STATS,
  getReferralReward,
} from '../data/referralData';

export default function ReferralScreen() {
  const router = useRouter();
  const { user, activeRole } = useAuth();
  const [copied, setCopied] = useState(false);

  const profile = DUMMY_USER_REFERRAL_PROFILE;
  const stats = DUMMY_REFERRAL_STATS;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const handleCopyCode = async () => {
    Clipboard.setString(profile.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const handleCopyLink = async () => {
    Clipboard.setString(profile.referralLink);
    Alert.alert('Copied!', 'Referral link copied to clipboard');
  };

  const handleShareWhatsApp = async () => {
    const message = `Join ConnectO to find trusted workers or earn by offering services.

Use my referral code ${profile.referralCode} and earn ₹100!

${profile.referralLink}`;
    
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open WhatsApp');
    }
  };

  const handleShareSMS = async () => {
    const message = `Hey! Join ConnectO using my code ${profile.referralCode} or visit ${profile.referralLink}`;
    const smsUrl = Platform.OS === 'ios' 
      ? `sms:&body=${encodeURIComponent(message)}`
      : `sms:?body=${encodeURIComponent(message)}`;
    
    try {
      await Linking.openURL(smsUrl);
    } catch (error) {
      Alert.alert('Error', 'Could not open SMS');
    }
  };

  const handleShareOther = async () => {
    try {
      await Share.share({
        message: `Join ConnectO using my referral code: ${profile.referralCode}\n\n${profile.referralLink}`,
        title: 'Invite to ConnectO',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share');
    }
  };

  const getRewardForRole = () => {
    if (!activeRole) return 0;
    
    // Show reward for referring someone of the same role
    return getReferralReward(activeRole, activeRole);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refer & Earn</Text>
          <TouchableOpacity onPress={() => router.push('/referral/history')}>
            <Ionicons name="time-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="gift" size={32} color={COLORS.white} />
          </View>
          <Text style={styles.heroTitle}>Invite Friends & Earn!</Text>
          <Text style={styles.heroSubtitle}>
            Share ConnectO with friends and earn {formatCurrency(getRewardForRole())} for every successful referral
          </Text>
        </View>

        {/* Referral Code Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.codeCard}>
            <View style={styles.codeContent}>
              <Text style={styles.codeLabel}>Referral Code</Text>
              <Text style={styles.codeValue}>{profile.referralCode}</Text>
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <Ionicons 
                name={copied ? 'checkmark-circle' : 'copy-outline'} 
                size={24} 
                color={copied ? COLORS.success : COLORS.primary} 
              />
              <Text style={[styles.copyText, copied && { color: COLORS.success }]}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Referral Link */}
          <TouchableOpacity style={styles.linkCard} onPress={handleCopyLink}>
            <Ionicons name="link" size={20} color={COLORS.primary} />
            <Text style={styles.linkText} numberOfLines={1}>
              {profile.referralLink}
            </Text>
            <Ionicons name="copy-outline" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Share Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share via</Text>
          <View style={styles.shareGrid}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShareWhatsApp}>
              <View style={[styles.shareIcon, { backgroundColor: '#25D366' }]}>
                <Ionicons name="logo-whatsapp" size={28} color={COLORS.white} />
              </View>
              <Text style={styles.shareLabel}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShareSMS}>
              <View style={[styles.shareIcon, { backgroundColor: COLORS.info }]}>
                <Ionicons name="chatbox" size={28} color={COLORS.white} />
              </View>
              <Text style={styles.shareLabel}>SMS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleCopyLink}>
              <View style={[styles.shareIcon, { backgroundColor: COLORS.secondary }]}>
                <Ionicons name="link" size={28} color={COLORS.white} />
              </View>
              <Text style={styles.shareLabel}>Copy Link</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShareOther}>
              <View style={[styles.shareIcon, { backgroundColor: COLORS.primary }]}>
                <Ionicons name="share-social" size={28} color={COLORS.white} />
              </View>
              <Text style={styles.shareLabel}>More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Referral Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <Ionicons name="people" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{profile.totalReferrals}</Text>
              <Text style={styles.statLabel}>Total Referrals</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.success + '20' }]}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.statValue}>{profile.successfulReferrals}</Text>
              <Text style={styles.statLabel}>Successful</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.warning + '20' }]}>
                <Ionicons name="time" size={24} color={COLORS.warning} />
              </View>
              <Text style={styles.statValue}>{profile.pendingReferrals}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.secondary + '20' }]}>
                <Ionicons name="wallet" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.statValue}>{formatCurrency(profile.totalEarnings)}</Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
          </View>
        </View>

        {/* Wallet Balance */}
        <View style={styles.section}>
          <View style={styles.walletCard}>
            <View style={styles.walletLeft}>
              <Ionicons name="wallet" size={28} color={COLORS.white} />
              <View style={styles.walletInfo}>
                <Text style={styles.walletLabel}>Referral Wallet</Text>
                <Text style={styles.walletValue}>{formatCurrency(profile.walletBalance)}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawText}>Withdraw</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Month</Text>
            <TouchableOpacity onPress={() => router.push('/referral/analytics')}>
              <Text style={styles.viewAllText}>View Analytics</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.performanceCard}>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Referrals</Text>
              <Text style={styles.performanceValue}>{stats.monthly.referrals}</Text>
            </View>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Successful</Text>
              <Text style={[styles.performanceValue, { color: COLORS.success }]}>
                {stats.monthly.successful}
              </Text>
            </View>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Earnings</Text>
              <Text style={[styles.performanceValue, { color: COLORS.secondary }]}>
                {formatCurrency(stats.monthly.earnings)}
              </Text>
            </View>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Conversion Rate</Text>
              <Text style={[styles.performanceValue, { color: COLORS.primary }]}>
                {stats.conversionRate}%
              </Text>
            </View>
          </View>
        </View>

        {/* How it Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Your Code</Text>
                <Text style={styles.stepDescription}>
                  Share your unique referral code with friends via WhatsApp, SMS, or social media
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Friend Joins</Text>
                <Text style={styles.stepDescription}>
                  Your friend downloads ConnectO and signs up using your referral code
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Complete First Job</Text>
                <Text style={styles.stepDescription}>
                  Your friend completes their first job on ConnectO within 30 days
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get Rewarded!</Text>
                <Text style={styles.stepDescription}>
                  You both get rewarded! Money is credited to your referral wallet
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/referral/history')}
          >
            <Ionicons name="list" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>View Referral History</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/referral/terms')}
          >
            <Ionicons name="document-text" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
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
  heroCard: {
    backgroundColor: COLORS.primary,
    margin: SPACING.base,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  viewAllText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  codeCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  codeContent: {
    flex: 1,
  },
  codeLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  copyText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  linkText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.sm,
  },
  shareGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButton: {
    alignItems: 'center',
    width: '23%',
  },
  shareIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  shareLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  statCard: {
    width: '48%',
    minWidth: '48%',
    maxWidth: '48%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    margin: SPACING.xs,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  walletCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  walletInfo: {
    marginLeft: SPACING.md,
  },
  walletLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
  },
  walletValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 4,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  withdrawText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  performanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  performanceLabel: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
  },
  performanceValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  stepsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  step: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  actionButtonText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  bottomSpace: {
    height: 20,
  },
});
