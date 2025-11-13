import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Card, Divider } from 'react-native-paper';
import DisclaimerBanner from '../components/DisclaimerBanner';

/**
 * Home screen with options to scan or upload documents
 */
const HomeScreen = ({ navigation }) => {
  const handleScanDocument = () => {
    navigation.navigate('CameraScan');
  };

  const handleUploadDocument = () => {
    navigation.navigate('CameraScan', { mode: 'upload' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Disclaimer at top */}
        <DisclaimerBanner />

        {/* App Title and Description */}
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            MedClarify
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Understand your medical documents in plain language
          </Text>
        </View>

        {/* Main Action Cards */}
        <View style={styles.actionsContainer}>
          <Card style={styles.actionCard} onPress={handleScanDocument}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📷</Text>
              </View>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Scan Document
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Use your camera to scan a medical document
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.actionCard} onPress={handleUploadDocument}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📁</Text>
              </View>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Upload from Files
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Choose a photo from your gallery
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Divider style={styles.divider} />

        {/* How It Works */}
        <View style={styles.infoSection}>
          <Text variant="titleMedium" style={styles.infoTitle}>
            How It Works
          </Text>

          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>
              Scan or upload your medical document
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>
              AI translates medical jargon into plain language
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>
              Ask clarification questions about your document
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>
              Discuss results with your healthcare provider
            </Text>
          </View>
        </View>

        {/* Important Notice */}
        <Card style={styles.noticeCard}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.noticeTitle}>
              ⚠️ Important Notice
            </Text>
            <Text variant="bodyMedium" style={styles.noticeText}>
              MedClarify helps you understand medical documents but does not provide medical advice.
              Always consult with your healthcare provider for medical decisions, treatment plans,
              and health concerns.
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
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  actionCard: {
    elevation: 3,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconContainer: {
    marginBottom: 12,
  },
  icon: {
    fontSize: 48,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    textAlign: 'center',
    color: '#666',
  },
  divider: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  infoSection: {
    paddingHorizontal: 24,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
  },
  noticeCard: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  noticeTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#F44336',
  },
  noticeText: {
    lineHeight: 20,
  },
});

export default HomeScreen;
