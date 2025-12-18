import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, CATEGORIES, INDIAN_CITIES } from '../constants/theme';
import SearchBar from '../components/SearchBar';
import WorkerCard from '../components/WorkerCard';
import CategoryCard from '../components/CategoryCard';
import { searchWorkers, DUMMY_WORKERS, DummyWorker } from '../data/dummyWorkers';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string; voiceMode?: string }>();
  const { addRecentSearch, recentSearches } = useApp();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DummyWorker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(params.voiceMode === 'true');
  const [voiceText, setVoiceText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState(params.category || '');
  const [selectedCity, setSelectedCity] = useState('');
  const [minExperience, setMinExperience] = useState(0);
  const [maxWage, setMaxWage] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'wage_low' | 'wage_high'>('rating');

  useEffect(() => {
    if (params.category) {
      handleSearch(params.category);
    } else {
      setResults(DUMMY_WORKERS.slice(0, 20));
    }
  }, [params.category]);

  const handleSearch = useCallback((searchQuery?: string) => {
    const q = searchQuery || query;
    setIsLoading(true);
    
    setTimeout(() => {
      const filtered = searchWorkers(q, {
        category: selectedCategory,
        city: selectedCity,
        minExperience,
        maxWage,
        minRating,
        verifiedOnly,
      });

      // Sort results
      let sorted = [...filtered];
      switch (sortBy) {
        case 'rating':
          sorted.sort((a, b) => b.rating_average - a.rating_average);
          break;
        case 'experience':
          sorted.sort((a, b) => b.years_of_experience - a.years_of_experience);
          break;
        case 'wage_low':
          sorted.sort((a, b) => a.daily_wage_min - b.daily_wage_min);
          break;
        case 'wage_high':
          sorted.sort((a, b) => b.daily_wage_max - a.daily_wage_max);
          break;
      }

      setResults(sorted);
      setIsLoading(false);
      
      if (q.trim()) {
        addRecentSearch(q.trim());
      }
    }, 300);
  }, [query, selectedCategory, selectedCity, minExperience, maxWage, minRating, verifiedOnly, sortBy]);

  const handleVoiceSearch = async () => {
    if (!voiceText.trim()) return;
    
    setAiProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('voice-search', {
        body: { query: voiceText, location: selectedCity || 'Mumbai' },
      });

      if (error) throw error;

      if (data.success && data.parsed) {
        const { category, sub_skill, location_hint } = data.parsed;
        
        if (category) {
          setSelectedCategory(category.charAt(0).toUpperCase() + category.slice(1));
        }
        if (location_hint) {
          setSelectedCity(location_hint);
        }
        
        setQuery(voiceText);
        setShowVoiceModal(false);
        handleSearch(voiceText);
      } else if (data.clarificationNeeded) {
        // Show clarification message
        alert(data.clarificationQuestion);
      }
    } catch (error) {
      console.error('Voice search error:', error);
      // Fallback to text search
      setQuery(voiceText);
      setShowVoiceModal(false);
      handleSearch(voiceText);
    } finally {
      setAiProcessing(false);
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    // Simulate voice recording
    setTimeout(() => {
      setVoiceText('I need a plumber for bathroom leak repair');
      setIsListening(false);
    }, 2000);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedCity('');
    setMinExperience(0);
    setMaxWage(2000);
    setMinRating(0);
    setVerifiedOnly(false);
    setSortBy('rating');
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedCity,
    minExperience > 0,
    maxWage < 2000,
    minRating > 0,
    verifiedOnly,
  ].filter(Boolean).length;

  const renderHeader = () => (
    <View style={styles.header}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearch}
        onVoicePress={() => setShowVoiceModal(true)}
        autoFocus={!params.category}
        isLoading={isLoading}
      />
      
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options" size={18} color={activeFiltersCount > 0 ? COLORS.white : COLORS.textSecondary} />
          <Text style={[styles.filterButtonText, activeFiltersCount > 0 && styles.filterButtonTextActive]}>
            Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
          </Text>
        </TouchableOpacity>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryChips}>
          {CATEGORIES.slice(0, 8).map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, selectedCategory === cat.name && styles.categoryChipActive]}
              onPress={() => {
                setSelectedCategory(selectedCategory === cat.name ? '' : cat.name);
                setTimeout(() => handleSearch(), 100);
              }}
            >
              <Ionicons
                name={cat.icon as any}
                size={14}
                color={selectedCategory === cat.name ? COLORS.white : cat.color}
              />
              <Text style={[styles.categoryChipText, selectedCategory === cat.name && styles.categoryChipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.resultsInfo}>
        <Text style={styles.resultsCount}>{results.length} workers found</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>Sort: {sortBy.replace('_', ' ')}</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No workers found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your filters or search terms</Text>
      <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
        <Text style={styles.clearFiltersText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WorkerCard worker={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Voice Search Modal */}
      <Modal visible={showVoiceModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.voiceModal}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowVoiceModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.voiceContent}>
              <Text style={styles.voiceTitle}>Voice Search</Text>
              <Text style={styles.voiceSubtitle}>
                Describe what you need, and AI will find the right workers
              </Text>
              
              <TouchableOpacity
                style={[styles.micButton, isListening && styles.micButtonActive]}
                onPress={simulateVoiceInput}
                disabled={isListening || aiProcessing}
              >
                {isListening ? (
                  <ActivityIndicator color={COLORS.white} size="large" />
                ) : (
                  <Ionicons name="mic" size={40} color={COLORS.white} />
                )}
              </TouchableOpacity>
              
              <Text style={styles.voiceHint}>
                {isListening ? 'Listening...' : 'Tap to speak'}
              </Text>
              
              {voiceText ? (
                <View style={styles.voiceTextContainer}>
                  <Text style={styles.voiceTextLabel}>You said:</Text>
                  <Text style={styles.voiceTextValue}>"{voiceText}"</Text>
                  
                  <TouchableOpacity
                    style={styles.searchVoiceButton}
                    onPress={handleVoiceSearch}
                    disabled={aiProcessing}
                  >
                    {aiProcessing ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <>
                        <Ionicons name="sparkles" size={18} color={COLORS.white} />
                        <Text style={styles.searchVoiceText}>Search with AI</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.voiceExamples}>
                  <Text style={styles.examplesTitle}>Try saying:</Text>
                  <Text style={styles.exampleText}>"I need a plumber for bathroom leak"</Text>
                  <Text style={styles.exampleText}>"Find electrician near me urgently"</Text>
                  <Text style={styles.exampleText}>"Carpenter for modular kitchen"</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Filters Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.filtersModal}>
            <View style={styles.filtersHeader}>
              <Text style={styles.filtersTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filtersContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>City</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {['All', ...INDIAN_CITIES.slice(0, 10)].map((city) => (
                    <TouchableOpacity
                      key={city}
                      style={[styles.filterChip, (city === 'All' ? !selectedCity : selectedCity === city) && styles.filterChipActive]}
                      onPress={() => setSelectedCity(city === 'All' ? '' : city)}
                    >
                      <Text style={[styles.filterChipText, (city === 'All' ? !selectedCity : selectedCity === city) && styles.filterChipTextActive]}>
                        {city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Minimum Experience</Text>
                <View style={styles.experienceOptions}>
                  {[0, 1, 3, 5, 10].map((years) => (
                    <TouchableOpacity
                      key={years}
                      style={[styles.filterChip, minExperience === years && styles.filterChipActive]}
                      onPress={() => setMinExperience(years)}
                    >
                      <Text style={[styles.filterChipText, minExperience === years && styles.filterChipTextActive]}>
                        {years === 0 ? 'Any' : `${years}+ yrs`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Minimum Rating</Text>
                <View style={styles.ratingOptions}>
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={[styles.filterChip, minRating === rating && styles.filterChipActive]}
                      onPress={() => setMinRating(rating)}
                    >
                      <Ionicons name="star" size={12} color={minRating === rating ? COLORS.white : COLORS.star} />
                      <Text style={[styles.filterChipText, minRating === rating && styles.filterChipTextActive]}>
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <TouchableOpacity
                  style={styles.verifiedToggle}
                  onPress={() => setVerifiedOnly(!verifiedOnly)}
                >
                  <View style={styles.verifiedInfo}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.verified} />
                    <Text style={styles.verifiedText}>Verified Workers Only</Text>
                  </View>
                  <View style={[styles.toggle, verifiedOnly && styles.toggleActive]}>
                    <View style={[styles.toggleKnob, verifiedOnly && styles.toggleKnobActive]} />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.filtersFooter}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setShowFilters(false);
                  handleSearch();
                }}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.base,
  },
  header: {
    marginBottom: SPACING.md,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
    ...SHADOWS.sm,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  categoryChips: {
    flex: 1,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
    ...SHADOWS.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  resultsCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['3xl'],
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
  clearFiltersButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
  },
  clearFiltersText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  voiceModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    minHeight: '60%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: SPACING.sm,
  },
  voiceContent: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  voiceTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  voiceSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
  micButtonActive: {
    backgroundColor: COLORS.error,
  },
  voiceHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  voiceTextContainer: {
    width: '100%',
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  voiceTextLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  voiceTextValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  searchVoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
  },
  searchVoiceText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  voiceExamples: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  examplesTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  exampleText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  filtersModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    maxHeight: '80%',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  filtersTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  filtersContent: {
    padding: SPACING.lg,
  },
  filterSection: {
    marginBottom: SPACING.xl,
  },
  filterLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  experienceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  ratingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  verifiedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  verifiedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  toggleKnobActive: {
    transform: [{ translateX: 22 }],
  },
  filtersFooter: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  applyButton: {
    flex: 2,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
