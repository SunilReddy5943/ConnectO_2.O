import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface Worker {
  id: string;
  user_id: string;
  name: string;
  profile_photo_url?: string;
  primary_category: string;
  city: string;
  years_of_experience: number;
  daily_wage_min: number;
  daily_wage_max: number;
  rating_average: number;
  rating_count: number;
  kyc_status: string;
  sub_skills: string[];
  languages: string[];
  bio?: string;
}

interface SearchFilters {
  category?: string;
  city?: string;
  minExperience?: number;
  maxExperience?: number;
  minWage?: number;
  maxWage?: number;
  minRating?: number;
  verifiedOnly?: boolean;
  languages?: string[];
  sortBy?: 'rating' | 'experience' | 'wage_low' | 'wage_high';
}

interface AppContextType {
  notifications: Notification[];
  unreadCount: number;
  savedWorkers: string[];
  searchFilters: SearchFilters;
  recentSearches: string[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleSavedWorker: (workerId: string) => void;
  isWorkerSaved: (workerId: string) => boolean;
  setSearchFilters: (filters: SearchFilters) => void;
  clearSearchFilters: () => void;
  addRecentSearch: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to ConnectO!',
      body: 'Find skilled workers near you in seconds.',
      type: 'WELCOME',
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]);
  const [savedWorkers, setSavedWorkers] = useState<string[]>([]);
  const [searchFilters, setSearchFiltersState] = useState<SearchFilters>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const toggleSavedWorker = (workerId: string) => {
    setSavedWorkers(prev =>
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const isWorkerSaved = (workerId: string) => savedWorkers.includes(workerId);

  const setSearchFilters = (filters: SearchFilters) => {
    setSearchFiltersState(filters);
  };

  const clearSearchFilters = () => {
    setSearchFiltersState({});
  };

  const addRecentSearch = (query: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== query);
      return [query, ...filtered].slice(0, 10);
    });
  };

  return (
    <AppContext.Provider
      value={{
        notifications,
        unreadCount,
        savedWorkers,
        searchFilters,
        recentSearches,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        toggleSavedWorker,
        isWorkerSaved,
        setSearchFilters,
        clearSearchFilters,
        addRecentSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
