import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Disclaimer at top */}
        <DisclaimerBanner />

        {/* Main Action Cards */}
        <Card style={styles.actionCard} onPress={handleScanDocument}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.icon}>📷</Text>
            <Text variant="headlineSmall" style={styles.cardTitle}>
              Scan Document
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Use your camera to capture a medical document
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard} onPress={handleUploadDocument}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.icon}>📁</Text>
            <Text variant="headlineSmall" style={styles.cardTitle}>
              Upload Photo
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Choose a photo from your gallery
            </Text>
          </Card.Content>
        </Card>

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
    padding: 20,
    gap: 16,
  },
  actionCard: {
    elevation: 4,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  divider: {
    marginVertical: 8,
  },
});

export default HomeScreen;
