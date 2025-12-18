// Referral System Data Models and Dummy Data

export type ReferralStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'EXPIRED';
export type RewardType = 'FIXED' | 'PERCENTAGE';
export type ShareMethod = 'WHATSAPP' | 'SMS' | 'COPY_LINK' | 'CONTACTS' | 'OTHER';

export interface UserReferralProfile {
  userId: string;
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  failedReferrals: number;
  totalEarnings: number;
  walletBalance: number;
  createdAt: Date;
}

export interface ReferralReward {
  id: string;
  referrerRole: 'CUSTOMER' | 'WORKER';
  referredRole: 'CUSTOMER' | 'WORKER';
  rewardType: RewardType;
  amount: number; // Fixed amount in ₹ or percentage value
  description: string;
  isActive: boolean;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerRole: 'CUSTOMER' | 'WORKER';
  referredUserId: string;
  referredUserName: string;
  referredUserPhone: string;
  referredUserRole: 'CUSTOMER' | 'WORKER';
  status: ReferralStatus;
  shareMethod: ShareMethod;
  rewardAmount: number;
  rewardCredited: boolean;
  rewardCreditedAt?: Date;
  joinedAt: Date;
  completedFirstJobAt?: Date;
  failureReason?: string;
}

export interface ReferralStats {
  daily: {
    referrals: number;
    successful: number;
    earnings: number;
  };
  weekly: {
    referrals: number;
    successful: number;
    earnings: number;
  };
  monthly: {
    referrals: number;
    successful: number;
    earnings: number;
  };
  conversionRate: number; // Percentage
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userRole: 'CUSTOMER' | 'WORKER';
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  profilePhoto?: string;
}

export interface ReferralTrendData {
  month: string;
  referrals: number;
  successful: number;
  earnings: number;
}

// Referral Code Generator
export const generateReferralCode = (userId: string, name: string): string => {
  const namePrefix = name.substring(0, 3).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${namePrefix}${randomSuffix}`;
};

// Generate Referral Link
export const generateReferralLink = (referralCode: string): string => {
  return `https://connecto.app/invite?ref=${referralCode}`;
};

// Reward Configuration (Admin-controlled in production)
export const REFERRAL_REWARDS: ReferralReward[] = [
  {
    id: 'reward-1',
    referrerRole: 'CUSTOMER',
    referredRole: 'CUSTOMER',
    rewardType: 'FIXED',
    amount: 100,
    description: 'Customer refers Customer',
    isActive: true,
  },
  {
    id: 'reward-2',
    referrerRole: 'WORKER',
    referredRole: 'WORKER',
    rewardType: 'FIXED',
    amount: 200,
    description: 'Worker refers Worker',
    isActive: true,
  },
  {
    id: 'reward-3',
    referrerRole: 'CUSTOMER',
    referredRole: 'WORKER',
    rewardType: 'FIXED',
    amount: 150,
    description: 'Customer refers Worker',
    isActive: true,
  },
  {
    id: 'reward-4',
    referrerRole: 'WORKER',
    referredRole: 'CUSTOMER',
    rewardType: 'FIXED',
    amount: 75,
    description: 'Worker refers Customer',
    isActive: true,
  },
];

// Get Reward for Referral Type
export const getReferralReward = (
  referrerRole: 'CUSTOMER' | 'WORKER',
  referredRole: 'CUSTOMER' | 'WORKER'
): number => {
  const reward = REFERRAL_REWARDS.find(
    (r) => r.referrerRole === referrerRole && r.referredRole === referredRole && r.isActive
  );
  return reward?.amount || 0;
};

// Dummy Data - User's Referral Profile
export const DUMMY_USER_REFERRAL_PROFILE: UserReferralProfile = {
  userId: 'demo-user-1',
  referralCode: 'DEM8X2K9',
  referralLink: 'https://connecto.app/invite?ref=DEM8X2K9',
  totalReferrals: 24,
  successfulReferrals: 18,
  pendingReferrals: 4,
  failedReferrals: 2,
  totalEarnings: 2850,
  walletBalance: 2850,
  createdAt: new Date('2024-06-15'),
};

// Dummy Data - Referral History
export const DUMMY_REFERRAL_HISTORY: ReferralRecord[] = [
  {
    id: 'ref-001',
    referrerId: 'demo-user-1',
    referrerName: 'Demo User',
    referrerRole: 'WORKER',
    referredUserId: 'user-101',
    referredUserName: 'Rajesh Kumar',
    referredUserPhone: '+919876543210',
    referredUserRole: 'WORKER',
    status: 'SUCCESSFUL',
    shareMethod: 'WHATSAPP',
    rewardAmount: 200,
    rewardCredited: true,
    rewardCreditedAt: new Date('2024-12-10'),
    joinedAt: new Date('2024-12-05'),
    completedFirstJobAt: new Date('2024-12-09'),
  },
  {
    id: 'ref-002',
    referrerId: 'demo-user-1',
    referrerName: 'Demo User',
    referrerRole: 'WORKER',
    referredUserId: 'user-102',
    referredUserName: 'Priya Sharma',
    referredUserPhone: '+919876543211',
    referredUserRole: 'CUSTOMER',
    status: 'SUCCESSFUL',
    shareMethod: 'SMS',
    rewardAmount: 75,
    rewardCredited: true,
    rewardCreditedAt: new Date('2024-12-12'),
    joinedAt: new Date('2024-12-08'),
    completedFirstJobAt: new Date('2024-12-11'),
  },
  {
    id: 'ref-003',
    referrerId: 'demo-user-1',
    referrerName: 'Demo User',
    referrerRole: 'WORKER',
    referredUserId: 'user-103',
    referredUserName: 'Amit Patel',
    referredUserPhone: '+919876543212',
    referredUserRole: 'WORKER',
    status: 'PENDING',
    shareMethod: 'WHATSAPP',
    rewardAmount: 200,
    rewardCredited: false,
    joinedAt: new Date('2024-12-15'),
  },
  {
    id: 'ref-004',
    referrerId: 'demo-user-1',
    referrerName: 'Demo User',
    referrerRole: 'WORKER',
    referredUserId: 'user-104',
    referredUserName: 'Sneha Reddy',
    referredUserPhone: '+919876543213',
    referredUserRole: 'CUSTOMER',
    status: 'PENDING',
    shareMethod: 'COPY_LINK',
    rewardAmount: 75,
    rewardCredited: false,
    joinedAt: new Date('2024-12-16'),
  },
  {
    id: 'ref-005',
    referrerId: 'demo-user-1',
    referrerName: 'Demo User',
    referrerRole: 'WORKER',
    referredUserId: 'user-105',
    referredUserName: 'Vikram Singh',
    referredUserPhone: '+919876543214',
    referredUserRole: 'WORKER',
    status: 'SUCCESSFUL',
    shareMethod: 'WHATSAPP',
    rewardAmount: 200,
    rewardCredited: true,
    rewardCreditedAt: new Date('2024-12-08'),
    joinedAt: new Date('2024-12-01'),
    completedFirstJobAt: new Date('2024-12-07'),
  },
  {
    id: 'ref-006',
    referrerId: 'demo-user-1',
    referrerName: 'Demo User',
    referrerRole: 'WORKER',
    referredUserId: 'user-106',
    referredUserName: 'Anjali Gupta',
    referredUserPhone: '+919876543215',
    referredUserRole: 'CUSTOMER',
    status: 'SUCCESSFUL',
    shareMethod: 'WHATSAPP',
    rewardAmount: 75,
    rewardCredited: true,
    rewardCreditedAt: new Date('2024-12-14'),
    joinedAt: new Date('2024-12-10'),
    completedFirstJobAt: new Date('2024-12-13'),
  },
  {
    id: 'ref-007',
    referrerId: 'demo-user-1',
    referrerName: 'Demo User',
    referrerRole: 'WORKER',
    referredUserId: 'user-107',
    referredUserName: 'Karan Mehta',
    referredUserPhone: '+919876543216',
    referredUserRole: 'WORKER',
    status: 'PENDING',
    shareMethod: 'SMS',
    rewardAmount: 200,
    rewardCredited: false,
    joinedAt: new Date('2024-12-17'),
  },
  {
    id: 'ref-008',
    referrerId: 'demo-user-1',
    referrerName: 'Demo User',
    referrerRole: 'WORKER',
    referredUserId: 'user-108',
    referredUserName: 'Deepak Joshi',
    referredUserPhone: '+919876543217',
    referredUserRole: 'WORKER',
    status: 'FAILED',
    shareMethod: 'WHATSAPP',
    rewardAmount: 0,
    rewardCredited: false,
    joinedAt: new Date('2024-11-20'),
    failureReason: 'Did not complete first job within 30 days',
  },
];

// Dummy Data - Referral Stats
export const DUMMY_REFERRAL_STATS: ReferralStats = {
  daily: {
    referrals: 2,
    successful: 1,
    earnings: 75,
  },
  weekly: {
    referrals: 8,
    successful: 5,
    earnings: 625,
  },
  monthly: {
    referrals: 24,
    successful: 18,
    earnings: 2850,
  },
  conversionRate: 75.0,
};

// Dummy Data - Leaderboard
export const DUMMY_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-501',
    userName: 'Ramesh Iyer',
    userRole: 'WORKER',
    totalReferrals: 47,
    successfulReferrals: 42,
    totalEarnings: 7800,
  },
  {
    rank: 2,
    userId: 'user-502',
    userName: 'Sanjay Kapoor',
    userRole: 'WORKER',
    totalReferrals: 38,
    successfulReferrals: 34,
    totalEarnings: 6200,
  },
  {
    rank: 3,
    userId: 'demo-user-1',
    userName: 'Demo User',
    userRole: 'WORKER',
    totalReferrals: 24,
    successfulReferrals: 18,
    totalEarnings: 2850,
  },
  {
    rank: 4,
    userId: 'user-503',
    userName: 'Meera Nair',
    userRole: 'CUSTOMER',
    totalReferrals: 22,
    successfulReferrals: 19,
    totalEarnings: 2100,
  },
  {
    rank: 5,
    userId: 'user-504',
    userName: 'Arjun Desai',
    userRole: 'WORKER',
    totalReferrals: 19,
    successfulReferrals: 15,
    totalEarnings: 2650,
  },
];

// Dummy Data - Referral Trends (Last 6 months)
export const DUMMY_REFERRAL_TRENDS: ReferralTrendData[] = [
  { month: 'Jul', referrals: 3, successful: 2, earnings: 350 },
  { month: 'Aug', referrals: 5, successful: 4, earnings: 575 },
  { month: 'Sep', referrals: 4, successful: 3, earnings: 450 },
  { month: 'Oct', referrals: 6, successful: 5, earnings: 850 },
  { month: 'Nov', referrals: 8, successful: 6, earnings: 1050 },
  { month: 'Dec', referrals: 10, successful: 8, earnings: 1425 },
];

// Referral Terms & Conditions
export const REFERRAL_TERMS = {
  title: 'Referral Program Terms & Conditions',
  lastUpdated: '2024-12-01',
  terms: [
    {
      title: 'Eligibility',
      points: [
        'All registered users can participate in the referral program',
        'Both referrer and referred user must complete profile verification',
        'Referral rewards apply only to new users who have never registered before',
      ],
    },
    {
      title: 'Reward Structure',
      points: [
        'Customer referring Customer: ₹100',
        'Worker referring Worker: ₹200',
        'Customer referring Worker: ₹150',
        'Worker referring Customer: ₹75',
        'Rewards are credited only after the referred user completes their first job',
      ],
    },
    {
      title: 'Reward Conditions',
      points: [
        'Referred user must complete first job within 30 days of signup',
        'Referral reward is credited within 24 hours of completion',
        'One referral reward per unique phone number',
        'Self-referrals and duplicate accounts are strictly prohibited',
      ],
    },
    {
      title: 'Fraud Prevention',
      points: [
        'ConnectO reserves the right to investigate suspicious referral activities',
        'Rewards can be revoked if fraud is detected',
        'Duplicate device IDs, IP addresses, or payment methods may flag accounts',
        'Users found violating terms may be banned from the platform',
      ],
    },
    {
      title: 'General Terms',
      points: [
        'ConnectO can modify or terminate the referral program at any time',
        'Rewards are non-transferable and cannot be exchanged for cash',
        'Referral wallet balance can be used for platform services or withdrawn',
        'All disputes are subject to ConnectO\'s final decision',
      ],
    },
  ],
};
