import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { GEMINI_CONFIG, SYSTEM_PROMPTS, QUICK_PROMPTS } from '../config/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export default function AIAssistant({
  visible,
  onClose,
  initialMessage,
}: AIAssistantProps) {
  const { activeRole } = useAuth();
  const isWorkerMode = activeRole === 'WORKER';
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with welcome message when modal opens
  useEffect(() => {
    if (visible && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: getWelcomeMessage(),
      };
      setMessages([welcomeMessage]);
    }
    
    // Reset messages when modal closes
    if (!visible && messages.length > 1) {
      setMessages([]);
      setInput('');
    }
  }, [visible]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  function getWelcomeMessage(): string {
    if (isWorkerMode) {
      return "Hello! I'm here to help you earn more and manage your work better. Ask me about getting more jobs, improving your profile, or any work-related questions.";
    }
    return "Hi! I'm here to help you find the right workers and manage your jobs. Ask me about finding workers, understanding pricing, or posting jobs.";
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await callGeminiAPI(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble right now. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const callGeminiAPI = async (userInput: string): Promise<string> => {
    const systemPrompt = isWorkerMode 
      ? `${SYSTEM_PROMPTS.BASE}\n\n${SYSTEM_PROMPTS.WORKER}`
      : `${SYSTEM_PROMPTS.BASE}\n\n${SYSTEM_PROMPTS.CUSTOMER}`;

    const fullPrompt = `${systemPrompt}

User: ${userInput}

Assistant:`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEMINI_CONFIG.TIMEOUT);

    try {
      const response = await fetch(
        `${GEMINI_CONFIG.API_URL}?key=${GEMINI_CONFIG.API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: fullPrompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
              topP: 0.8,
              topK: 40,
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        let text = data.candidates[0].content.parts[0].text.trim();
        
        // Limit response length (approximately 150 words)
        const words = text.split(/\s+/);
        if (words.length > GEMINI_CONFIG.MAX_RESPONSE_LENGTH) {
          text = words.slice(0, GEMINI_CONFIG.MAX_RESPONSE_LENGTH).join(' ') + '...';
        }
        
        return text;
      }

      throw new Error('No response from AI');
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  const quickActions = isWorkerMode 
    ? QUICK_PROMPTS.WORKER 
    : QUICK_PROMPTS.CUSTOMER;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View style={styles.aiIcon}>
                <Ionicons name="sparkles" size={20} color={COLORS.white} />
              </View>
              <View>
                <Text style={styles.headerTitle}>ConnectO Assistant</Text>
                <Text style={styles.headerSubtitle}>
                  {isWorkerMode 
                    ? 'Helping you earn more and manage work' 
                    : 'Helping you find the right workers'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => {
              setMessages([]);
              setInput('');
              onClose();
            }} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {message.role === 'assistant' && (
                  <View style={styles.assistantIcon}>
                    <Ionicons name="sparkles" size={14} color={COLORS.primary} />
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'assistant' && styles.assistantMessageText,
                    message.role === 'user' && styles.userMessageText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingText}>AI is thinking...</Text>
              </View>
            )}
          </ScrollView>

          {/* Quick Actions - Only show initially, hide after first user message */}
          {messages.filter(m => m.role === 'user').length === 0 && (
            <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>Quick questions:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {quickActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickActionButton}
                    onPress={() => handleQuickAction(action)}
                  >
                    <Text style={styles.quickActionText}>{action}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor={COLORS.textMuted}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[styles.sendButton, input.trim() && styles.sendButtonActive]}
              onPress={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Ionicons
                name="send"
                size={20}
                color={input.trim() ? COLORS.white : COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.base,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: BORDER_RADIUS.sm,
  },
  assistantBubble: {
    backgroundColor: COLORS.borderLight,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: BORDER_RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  assistantIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  messageText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  assistantMessageText: {
    flex: 1,
  },
  userMessageText: {
    color: COLORS.white,
    flexShrink: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  loadingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
  quickActions: {
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  quickActionsTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  quickActionButton: {
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  quickActionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    maxHeight: 100,
    marginRight: SPACING.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
});
