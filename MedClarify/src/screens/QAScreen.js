import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import { askQuestion } from '../services/claudeAPI';
import DisclaimerBanner from '../components/DisclaimerBanner';

/**
 * Q&A Chat screen for asking clarification questions
 */
const QAScreen = ({ route }) => {
  const { translationData } = route.params;

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I can help answer questions about your medical document. I can only explain what's in the document - I cannot provide additional medical advice.",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendQuestion = async () => {
    if (!inputText.trim() || loading) return;

    const userQuestion = inputText.trim();
    setInputText('');

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userQuestion }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Prepare document context from translation data
      const documentContext = JSON.stringify({
        documentType: translationData.documentType,
        sections: translationData.simplifiedSections,
        summary: translationData.overallSummary,
        actionItems: translationData.actionItems,
      });

      // Get conversation history for context (exclude the initial greeting)
      const conversationHistory = newMessages.slice(1);

      // Ask Claude API
      const result = await askQuestion(userQuestion, documentContext, conversationHistory);

      if (result.success) {
        setMessages([...newMessages, { role: 'assistant', content: result.answer }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content:
              result.error ||
              'Sorry, I encountered an error. Please try again or rephrase your question.',
          },
        ]);
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        {/* Disclaimer banner */}
        <DisclaimerBanner />

        {/* Chat messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessageContainer : styles.assistantMessageContainer,
              ]}
            >
              <Card
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Card.Content>
                  <Text
                    variant="bodyMedium"
                    style={message.role === 'user' ? styles.userText : styles.assistantText}
                  >
                    {message.content}
                  </Text>
                </Card.Content>
              </Card>
            </View>
          ))}

          {loading && (
            <View style={styles.loadingContainer}>
              <Card style={styles.loadingBubble}>
                <Card.Content style={styles.loadingContent}>
                  <ActivityIndicator size="small" color="#2196F3" />
                  <Text style={styles.loadingText}>Claude is thinking...</Text>
                </Card.Content>
              </Card>
            </View>
          )}
        </ScrollView>

        {/* Input area */}
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            placeholder="Ask a question about your document..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendQuestion}
            style={styles.input}
            multiline
            maxLength={500}
            disabled={loading}
          />
          <Button
            mode="contained"
            onPress={handleSendQuestion}
            disabled={!inputText.trim() || loading}
            style={styles.sendButton}
            icon="send"
          >
            Send
          </Button>
        </View>

        {/* Bottom disclaimer */}
        <View style={styles.bottomDisclaimer}>
          <Text variant="bodySmall" style={styles.disclaimerText}>
            This is not medical advice - always consult your healthcare provider
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  assistantMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#2196F3',
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#000000',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  loadingBubble: {
    backgroundColor: '#F5F5F5',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    height: 56,
  },
  bottomDisclaimer: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F44336',
  },
  disclaimerText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default QAScreen;
