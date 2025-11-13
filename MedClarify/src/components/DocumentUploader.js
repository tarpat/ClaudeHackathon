import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
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
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {preview && preview.type === 'image' && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: preview.uri }} style={styles.preview} resizeMode="contain" />
        </View>
      )}

      {preview && preview.type === 'document' && (
        <View style={styles.previewContainer}>
          <Text style={styles.documentName}>Document selected</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="folder"
          onPress={handlePickDocument}
          style={styles.button}
        >
          Pick PDF or Document
        </Button>

        <Button
          mode="contained"
          icon="image"
          onPress={handlePickImage}
          style={styles.button}
        >
          Pick from Gallery
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  previewContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
});

export default DocumentUploader;
