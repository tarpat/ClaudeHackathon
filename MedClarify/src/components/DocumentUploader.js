import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Button, Text, ActivityIndicator, Card } from 'react-native-paper';
import { pickDocument, pickImageFromGallery, validateDocument } from '../services/documentProcessor';

/**
 * Component for uploading documents from files or gallery
 */
const DocumentUploader = ({ onDocumentSelected, onError }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handlePickDocument = async () => {
    try {
      setLoading(true);
      const result = await pickDocument();

      if (result.canceled) {
        setLoading(false);
        return;
      }

      const validation = validateDocument(result);
      if (!validation.valid) {
        onError(validation.error);
        setLoading(false);
        return;
      }

      setPreview({ uri: result.uri, type: 'document' });
      onDocumentSelected(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      onError(error.message || 'Failed to pick document');
    }
  };

  const handlePickImage = async () => {
    try {
      setLoading(true);
      const result = await pickImageFromGallery();

      if (result.canceled) {
        setLoading(false);
        return;
      }

      setPreview({ uri: result.uri, type: 'image' });
      onDocumentSelected({ ...result, mimeType: 'image/jpeg' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      onError(error.message || 'Failed to pick image');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Upload Document
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Choose a photo of your medical document
        </Text>
      </View>

      {preview && preview.type === 'image' && (
        <Card style={styles.previewCard}>
          <Image source={{ uri: preview.uri }} style={styles.preview} resizeMode="contain" />
        </Card>
      )}

      {preview && preview.type === 'document' && (
        <Card style={styles.previewCard}>
          <Card.Content>
            <Text style={styles.documentName}>✓ Document selected</Text>
          </Card.Content>
        </Card>
      )}

      <View style={styles.buttonContainer}>
        <Card style={styles.optionCard} onPress={handlePickImage}>
          <Card.Content style={styles.optionContent}>
            <Text style={styles.optionIcon}>📷</Text>
            <Text variant="titleMedium" style={styles.optionTitle}>
              Photo Gallery
            </Text>
            <Text variant="bodySmall" style={styles.optionDescription}>
              Choose from your photos
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.optionCard} onPress={handlePickDocument}>
          <Card.Content style={styles.optionContent}>
            <Text style={styles.optionIcon}>📁</Text>
            <Text variant="titleMedium" style={styles.optionTitle}>
              Files
            </Text>
            <Text variant="bodySmall" style={styles.optionDescription}>
              Browse documents (PDF, images)
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  previewCard: {
    marginBottom: 24,
    elevation: 2,
    borderRadius: 12,
  },
  preview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4CAF50',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  optionCard: {
    elevation: 3,
    borderRadius: 16,
  },
  optionContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  optionIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  optionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    color: '#666',
    textAlign: 'center',
  },
});

export default DocumentUploader;
