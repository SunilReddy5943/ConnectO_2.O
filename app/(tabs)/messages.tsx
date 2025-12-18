import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, WORKER_IMAGES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

interface ChatThread {
  id: string;
  worker_name: string;
  worker_photo: string;
  worker_category: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_online: boolean;
}

const DUMMY_CHATS: ChatThread[] = [
  {
    id: '1',
    worker_name: 'Rajesh Kumar',
    worker_photo: WORKER_IMAGES[0],
    worker_category: 'Plumber',
    last_message: 'I can come tomorrow at 10 AM. Will that work for you?',
    last_message_time: '2 min ago',
    unread_count: 2,
    is_online: true,
  },
  {
    id: '2',
    worker_name: 'Suresh Singh',
    worker_photo: WORKER_IMAGES[1],
    worker_category: 'Electrician',
    last_message: 'The wiring work is complete. Please check and let me know.',
    last_message_time: '1 hour ago',
    unread_count: 0,
    is_online: false,
  },
  {
    id: '3',
    worker_name: 'Mahesh Sharma',
    worker_photo: WORKER_IMAGES[2],
    worker_category: 'Carpenter',
    last_message: 'I have attached the quotation for the kitchen cabinets.',
    last_message_time: '3 hours ago',
    unread_count: 1,
    is_online: true,
  },
  {
    id: '4',
    worker_name: 'Anil Verma',
    worker_photo: WORKER_IMAGES[3],
    worker_category: 'Painter',
    last_message: 'Thank you for the payment. Happy to help!',
    last_message_time: 'Yesterday',
    unread_count: 0,
    is_online: false,
  },
  {
    id: '5',
    worker_name: 'Vijay Patel',
    worker_photo: WORKER_IMAGES[4],
    worker_category: 'AC Technician',
    last_message: 'Your AC needs gas refilling. It will cost around ₹1500.',
    last_message_time: '2 days ago',
    unread_count: 0,
    is_online: false,
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [chats, setChats] = useState(DUMMY_CHATS);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleChatPress = (chatId: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: chatId },
    });
  };

  const renderChatItem = ({ item }: { item: ChatThread }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.worker_photo }} style={styles.avatar} />
        {item.is_online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.workerName} numberOfLines={1}>{item.worker_name}</Text>
          <Text style={styles.timeText}>{item.last_message_time}</Text>
        </View>
        <Text style={styles.categoryText}>{item.worker_category}</Text>
        <Text
          style={[styles.lastMessage, item.unread_count > 0 && styles.lastMessageUnread]}
          numberOfLines={1}
        >
          {item.last_message}
        </Text>
      </View>

      {item.unread_count > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread_count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptySubtitle}>
        Start a conversation with a worker to see your messages here
      </Text>
      <TouchableOpacity
        style={styles.findWorkersButton}
        onPress={() => router.push('/search')}
      >
        <Text style={styles.findWorkersText}>Find Workers</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNotLoggedIn = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="lock-closed-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>Login Required</Text>
      <Text style={styles.emptySubtitle}>
        Please login to view your messages
      </Text>
      <TouchableOpacity
        style={styles.findWorkersButton}
        onPress={() => router.push('/auth/login')}
      >
        <Text style={styles.findWorkersText}>Login</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {!isAuthenticated ? (
        renderNotLoggedIn()
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  searchButton: {
    padding: SPACING.sm,
  },
  listContent: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.borderLight,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  chatInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workerName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  timeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  lastMessage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  lastMessageUnread: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: SPACING.sm,
  },
  unreadText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.white,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: 88,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
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
    textAlign: 'center',
  },
  findWorkersButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
  },
  findWorkersText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
