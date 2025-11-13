import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, Divider } from 'react-native-paper';
import TranslationCard from '../components/TranslationCard';
import DisclaimerBanner from '../components/DisclaimerBanner';

/**
 * Screen showing translated medical document
 */
const TranslationScreen = ({ navigation, route }) => {
  const { translationData } = route.params;

  const handleAskQuestions = () => {
    navigation.navigate('QA', {
      translationData,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Disclaimer banner */}
        <DisclaimerBanner />

        {/* Document Type Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="labelSmall" style={styles.headerLabel}>
              Document Type
            </Text>
            <Text variant="headlineSmall" style={styles.documentType}>
              {translationData.documentType}
            </Text>
          </Card.Content>
        </Card>

        {/* Overall Summary */}
        {translationData.overallSummary && (
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Summary
              </Text>
              <Text variant="bodyLarge" style={styles.summaryText}>
                {translationData.overallSummary}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Action Items */}
        {translationData.actionItems && translationData.actionItems.length > 0 && (
          <Card style={styles.actionItemsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                ⚡ Action Items
              </Text>
              {translationData.actionItems.map((item, index) => (
                <View key={index} style={styles.actionItem}>
                  <Text style={styles.actionItemBullet}>•</Text>
                  <Text variant="bodyMedium" style={styles.actionItemText}>
                    {item}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Uncertainties Warning */}
        {translationData.uncertainties && translationData.uncertainties.length > 0 && (
          <Card style={styles.uncertaintiesCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.uncertaintiesTitle}>
                ⚠️ Areas to Clarify with Your Doctor
              </Text>
              {translationData.uncertainties.map((item, index) => (
                <View key={index} style={styles.uncertaintyItem}>
                  <Text style={styles.uncertaintyBullet}>•</Text>
                  <Text variant="bodyMedium" style={styles.uncertaintyText}>
                    {item}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        <Divider style={styles.divider} />

        {/* Detailed Sections */}
        <Text variant="titleLarge" style={styles.sectionsHeader}>
          Detailed Breakdown
        </Text>

        {translationData.simplifiedSections &&
          translationData.simplifiedSections.map((section, index) => (
            <TranslationCard key={index} section={section} />
          ))}

        {/* Ask Questions Button */}
        <Button
          mode="contained"
          icon="chat-question"
          onPress={handleAskQuestions}
          style={styles.askButton}
          contentStyle={styles.askButtonContent}
        >
          Ask Clarification Questions
        </Button>

        {/* Bottom Disclaimer */}
        <Card style={styles.bottomNotice}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.bottomNoticeText}>
              This translation is AI-generated and meant to help you understand your medical
              documents. It is not a substitute for professional medical advice, diagnosis, or
              treatment. Always seek the advice of your physician or other qualified health provider
              with any questions you may have regarding a medical condition.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#E3F2FD',
  },
  headerLabel: {
    color: '#666',
    marginBottom: 4,
  },
  documentType: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    lineHeight: 24,
  },
  actionItemsCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  actionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  actionItemBullet: {
    fontSize: 20,
    marginRight: 8,
    color: '#4CAF50',
  },
  actionItemText: {
    flex: 1,
    lineHeight: 20,
  },
  uncertaintiesCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  uncertaintiesTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#F57C00',
  },
  uncertaintyItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  uncertaintyBullet: {
    fontSize: 20,
    marginRight: 8,
    color: '#FFC107',
  },
  uncertaintyText: {
    flex: 1,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
  sectionsHeader: {
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  askButton: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  askButtonContent: {
    paddingVertical: 8,
  },
  bottomNotice: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#FFF3E0',
  },
  bottomNoticeText: {
    lineHeight: 18,
    color: '#666',
  },
});

export default TranslationScreen;
