import { CATEGORIES, INDIAN_CITIES } from '../constants/theme';

const jobTitles: { [key: string]: string[] } = {
  'Plumber': [
    'Bathroom Leak Repair',
    'Kitchen Sink Installation',
    'Water Tank Cleaning',
    'Pipe Replacement',
    'Drain Cleaning Service',
    'Water Heater Installation',
    'Bathroom Renovation Plumbing',
    'Kitchen Plumbing Setup',
  ],
  'Electrician': [
    'Home Wiring Work',
    'Fan Installation',
    'Light Fixture Replacement',
    'Switchboard Repair',
    'Generator Installation',
    'Inverter Setup',
    'MCB Replacement',
    'Complete Rewiring',
  ],
  'Carpenter': [
    'Modular Kitchen Installation',
    'Wardrobe Making',
    'Door Repair',
    'Furniture Assembly',
    'False Ceiling Work',
    'Wood Polishing',
    'Custom Shelf Making',
    'Window Fitting',
  ],
  'Painter': [
    'Interior Painting - 2BHK',
    'Exterior Wall Painting',
    'Texture Painting Work',
    'Waterproofing + Painting',
    'Wood Furniture Painting',
    'Metal Gate Painting',
    'Full House Repainting',
    'Single Room Painting',
  ],
  'Mason': [
    'Bathroom Tile Fixing',
    'Kitchen Flooring',
    'Wall Plastering',
    'Concrete Slab Work',
    'Brick Wall Construction',
    'Balcony Waterproofing',
    'Floor Leveling',
    'Marble Flooring Installation',
  ],
};

const customerNames = [
  'Priya Sharma', 'Rajesh Kumar', 'Amit Patel', 'Sneha Desai', 'Vikram Singh',
  'Anjali Gupta', 'Rahul Verma', 'Pooja Shah', 'Sanjay Reddy', 'Neha Kapoor',
  'Arjun Nair', 'Kavita Iyer', 'Deepak Joshi', 'Ritu Agarwal', 'Varun Mehta',
  'Simran Kaur', 'Karthik Pillai', 'Megha Das', 'Nikhil Bose', 'Swati Sen',
];

const jobDescriptions = [
  'Need immediate help. Quality work required.',
  'Urgent requirement. Please contact ASAP.',
  'Looking for experienced professional.',
  'Need work to be completed by this weekend.',
  'Serious enquiry. Budget negotiable.',
  'Looking for reliable worker for regular work.',
  'Quality and timeliness are important.',
  'Need skilled professional. Ready to pay good rates.',
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getHoursAgo(hours: number): Date {
  const now = new Date();
  now.setHours(now.getHours() - hours);
  return now;
}

export type JobStatus = 'NEW' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface DummyJob {
  id: string;
  title: string;
  description: string;
  category: string;
  customer_name: string;
  customer_id: string;
  budget_min: number;
  budget_max: number;
  city: string;
  locality: string;
  distance_km: number; // from current worker
  status: JobStatus;
  posted_at: Date;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  is_verified_customer: boolean;
}

export function generateDummyJobs(count: number = 50): DummyJob[] {
  const jobs: DummyJob[] = [];
  const statuses: JobStatus[] = ['NEW', 'NEW', 'NEW', 'ONGOING', 'COMPLETED']; // More NEW jobs
  const urgencies: ('LOW' | 'MEDIUM' | 'HIGH')[] = ['LOW', 'MEDIUM', 'MEDIUM', 'HIGH'];

  for (let i = 0; i < count; i++) {
    const category = getRandomElement(CATEGORIES);
    const titles = jobTitles[category.name] || ['General Work Required'];
    const baseBudget = getRandomNumber(500, 2000);
    const hoursAgo = getRandomNumber(1, 168); // 1 hour to 7 days

    jobs.push({
      id: `job-${i + 1}`,
      title: getRandomElement(titles),
      description: getRandomElement(jobDescriptions),
      category: category.name,
      customer_name: getRandomElement(customerNames),
      customer_id: `customer-${getRandomNumber(1, 100)}`,
      budget_min: baseBudget,
      budget_max: baseBudget + getRandomNumber(200, 800),
      city: getRandomElement(INDIAN_CITIES),
      locality: `Sector ${getRandomNumber(1, 50)}`,
      distance_km: getRandomNumber(1, 30),
      status: getRandomElement(statuses),
      posted_at: getHoursAgo(hoursAgo),
      urgency: getRandomElement(urgencies),
      is_verified_customer: Math.random() > 0.3,
    });
  }

  return jobs;
}

// Pre-generated jobs
export const DUMMY_JOBS = generateDummyJobs(50);

// Search jobs with filters
export function searchJobs(
  query: string,
  filters: {
    category?: string;
    minBudget?: number;
    maxBudget?: number;
    maxDistance?: number;
    status?: JobStatus;
    postedWithinDays?: number;
    urgentOnly?: boolean;
  } = {}
): DummyJob[] {
  let results = [...DUMMY_JOBS];

  // Text search
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      job =>
        job.title.toLowerCase().includes(lowerQuery) ||
        job.category.toLowerCase().includes(lowerQuery) ||
        job.description.toLowerCase().includes(lowerQuery) ||
        job.city.toLowerCase().includes(lowerQuery) ||
        job.customer_name.toLowerCase().includes(lowerQuery)
    );
  }

  // Category filter
  if (filters.category) {
    results = results.filter(job => job.category === filters.category);
  }

  // Budget filters
  if (filters.minBudget) {
    results = results.filter(job => job.budget_max >= filters.minBudget!);
  }
  if (filters.maxBudget) {
    results = results.filter(job => job.budget_min <= filters.maxBudget!);
  }

  // Distance filter
  if (filters.maxDistance) {
    results = results.filter(job => job.distance_km <= filters.maxDistance!);
  }

  // Status filter
  if (filters.status) {
    results = results.filter(job => job.status === filters.status);
  }

  // Posted time filter
  if (filters.postedWithinDays) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - filters.postedWithinDays);
    results = results.filter(job => job.posted_at >= cutoffDate);
  }

  // Urgent only
  if (filters.urgentOnly) {
    results = results.filter(job => job.urgency === 'HIGH');
  }

  return results;
}

// Get time ago string
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}
