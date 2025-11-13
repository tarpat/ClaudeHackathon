import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
          Ask Questions About This Document
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    elevation: 2,
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
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    lineHeight: 24,
    color: '#333',
  },
  actionItemsCard: {
    marginBottom: 12,
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    borderRadius: 12,
    elevation: 2,
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
    marginBottom: 12,
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    borderRadius: 12,
    elevation: 2,
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
  },
  sectionsHeader: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  askButton: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  askButtonContent: {
    paddingVertical: 8,
  },
});

export default TranslationScreen;
