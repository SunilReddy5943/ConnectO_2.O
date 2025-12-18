// Earnings & Analytics Data Models and Dummy Data

export interface EarningsOverview {
  totalLifetime: number;
  today: number;
  thisMonth: number;
  last7Days: number;
  last30Days: number;
  last90Days: number;
}

export interface MonthlyEarning {
  month: string;
  year: number;
  amount: number;
  jobs: number;
}

export interface WeeklyEarning {
  week: string;
  amount: number;
  jobs: number;
}

export interface EarningsBySkill {
  skill: string;
  amount: number;
  jobs: number;
  percentage: number;
}

export interface EarningsByCity {
  city: string;
  amount: number;
  jobs: number;
  percentage: number;
}

export interface EarningsByJobType {
  type: 'DAILY_WAGE' | 'CONTRACT' | 'HOURLY';
  amount: number;
  jobs: number;
  percentage: number;
}

export interface PerformanceMetrics {
  totalJobsCompleted: number;
  completionRate: number;
  acceptanceRate: number;
  cancellationRate: number;
  averageJobValue: number;
  averageRating: number;
  totalReviews: number;
}

export interface VisibilityMetrics {
  profileViews: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  searchAppearances: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  contactRequests: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  conversionRate: number;
}

export interface RatingTrend {
  month: string;
  rating: number;
}

export interface SmartInsight {
  id: string;
  type: 'EARNING_PATTERN' | 'SKILL_PERFORMANCE' | 'LOCATION_TREND' | 'TIP';
  icon: string;
  title: string;
  description: string;
  color: string;
}

// Dummy Data Generation
const generateMonthlyEarnings = (): MonthlyEarning[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return months.map((month, index) => {
    const isCurrentOrPastMonth = index <= currentMonth;
    const baseAmount = 15000 + Math.random() * 25000;
    
    return {
      month,
      year: currentYear,
      amount: isCurrentOrPastMonth ? Math.round(baseAmount) : 0,
      jobs: isCurrentOrPastMonth ? Math.floor(8 + Math.random() * 15) : 0,
    };
  });
};

const generateWeeklyEarnings = (): WeeklyEarning[] => {
  const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return weeks.map(week => ({
    week,
    amount: Math.round(1200 + Math.random() * 3800),
    jobs: Math.floor(1 + Math.random() * 4),
  }));
};

export const DUMMY_EARNINGS_OVERVIEW: EarningsOverview = {
  totalLifetime: 485600,
  today: 2400,
  thisMonth: 38500,
  last7Days: 15600,
  last30Days: 38500,
  last90Days: 142800,
};

export const DUMMY_MONTHLY_EARNINGS = generateMonthlyEarnings();

export const DUMMY_WEEKLY_EARNINGS = generateWeeklyEarnings();

export const DUMMY_EARNINGS_BY_SKILL: EarningsBySkill[] = [
  { skill: 'Plumbing', amount: 156000, jobs: 82, percentage: 32 },
  { skill: 'Electrical Work', amount: 124800, jobs: 65, percentage: 26 },
  { skill: 'Carpentry', amount: 98400, jobs: 48, percentage: 20 },
  { skill: 'Painting', amount: 72600, jobs: 54, percentage: 15 },
  { skill: 'AC Repair', amount: 33800, jobs: 28, percentage: 7 },
];

export const DUMMY_EARNINGS_BY_CITY: EarningsByCity[] = [
  { city: 'Mumbai', amount: 285000, jobs: 145, percentage: 59 },
  { city: 'Navi Mumbai', amount: 98400, jobs: 58, percentage: 20 },
  { city: 'Thane', amount: 72200, jobs: 42, percentage: 15 },
  { city: 'Pune', amount: 30000, jobs: 32, percentage: 6 },
];

export const DUMMY_EARNINGS_BY_JOB_TYPE: EarningsByJobType[] = [
  { type: 'DAILY_WAGE', amount: 324500, jobs: 198, percentage: 67 },
  { type: 'CONTRACT', amount: 132100, jobs: 45, percentage: 27 },
  { type: 'HOURLY', amount: 29000, jobs: 34, percentage: 6 },
];

export const DUMMY_PERFORMANCE_METRICS: PerformanceMetrics = {
  totalJobsCompleted: 277,
  completionRate: 94.2,
  acceptanceRate: 87.5,
  cancellationRate: 5.8,
  averageJobValue: 1752,
  averageRating: 4.7,
  totalReviews: 218,
};

export const DUMMY_VISIBILITY_METRICS: VisibilityMetrics = {
  profileViews: {
    today: 24,
    thisWeek: 186,
    thisMonth: 742,
  },
  searchAppearances: {
    today: 58,
    thisWeek: 412,
    thisMonth: 1684,
  },
  contactRequests: {
    today: 8,
    thisWeek: 52,
    thisMonth: 198,
  },
  conversionRate: 26.7,
};

export const DUMMY_RATING_TRENDS: RatingTrend[] = [
  { month: 'Jun', rating: 4.5 },
  { month: 'Jul', rating: 4.6 },
  { month: 'Aug', rating: 4.6 },
  { month: 'Sep', rating: 4.7 },
  { month: 'Oct', rating: 4.7 },
  { month: 'Nov', rating: 4.8 },
  { month: 'Dec', rating: 4.7 },
];

export const DUMMY_SMART_INSIGHTS: SmartInsight[] = [
  {
    id: '1',
    type: 'EARNING_PATTERN',
    icon: 'trending-up',
    title: 'Weekend Earnings Surge',
    description: 'You earn 35% more on weekends. Consider increasing availability on Sat-Sun.',
    color: '#10B981',
  },
  {
    id: '2',
    type: 'SKILL_PERFORMANCE',
    icon: 'construct',
    title: 'Plumbing Jobs Pay More',
    description: 'Plumbing jobs generate ₹1,850 average. Focus on promoting this skill.',
    color: '#3B82F6',
  },
  {
    id: '3',
    type: 'LOCATION_TREND',
    icon: 'location',
    title: 'High Demand in Mumbai',
    description: 'Jobs in Mumbai pay 20% more than other areas. Expand service area.',
    color: '#F59E0B',
  },
  {
    id: '4',
    type: 'TIP',
    icon: 'star',
    title: 'Improve Your Rating',
    description: 'Workers with 4.8+ ratings earn 28% more. Focus on quality service.',
    color: '#8B5CF6',
  },
  {
    id: '5',
    type: 'TIP',
    icon: 'camera',
    title: 'Add Portfolio Images',
    description: 'Profiles with work photos get 3x more views. Upload your best work.',
    color: '#EC4899',
  },
];
