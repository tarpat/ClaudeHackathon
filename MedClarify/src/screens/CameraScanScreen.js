import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import CameraScanner from '../components/CameraScanner';
import DocumentUploader from '../components/DocumentUploader';
import { processDocument } from '../services/documentProcessor';

/**
 * Screen for camera scanning or uploading documents
 */
const CameraScanScreen = ({ navigation, route }) => {
  const mode = route.params?.mode || 'camera';

  const [showCamera, setShowCamera] = useState(mode === 'camera');
  const [capturedImage, setCapturedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleCapture = async (photo) => {
    setCapturedImage(photo);
    setShowCamera(false);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  const handleUsePhoto = async () => {
    setProcessing(true);
    setError(null);

    try {
      const result = await processDocument(capturedImage.uri, 'image');

      if (result.success) {
        // Navigate to translation screen with results
        navigation.navigate('Translation', {
          translationData: result.data,
          originalImage: capturedImage.uri,
        });
      } else {
        setError(result.error || 'Failed to process document');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing the document');
    } finally {
      setProcessing(false);
    }
  };

  const handleDocumentSelected = async (document) => {
    setProcessing(true);
    setError(null);

    try {
      const docType = document.mimeType?.includes('pdf') ? 'pdf' : 'image';
      const result = await processDocument(document.uri, docType);

      if (result.success) {
        navigation.navigate('Translation', {
          translationData: result.data,
          originalImage: document.uri,
        });
      } else {
        setError(result.error || 'Failed to process document');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing the document');
    } finally {
      setProcessing(false);
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleCloseCamera = () => {
    navigation.goBack();
  };

  const handleDismissError = () => {
    setError(null);
  };

  // Show camera view
  if (showCamera) {
    return <CameraScanner onCapture={handleCapture} onClose={handleCloseCamera} />;
  }

  // Show upload interface
  if (mode === 'upload' && !capturedImage) {
    return (
      <View style={styles.container}>
        <DocumentUploader
          onDocumentSelected={handleDocumentSelected}
          onError={handleError}
        />

        {processing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.processingText}>Analyzing document...</Text>
          </View>
        )}

        <Portal>
          <Dialog visible={!!error} onDismiss={handleDismissError}>
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Text>{error}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleDismissError}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }

  // Show preview with retake/use options
  if (capturedImage && !processing) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage.uri }} style={styles.preview} resizeMode="contain" />

        <View style={styles.previewActions}>
          <Button mode="outlined" onPress={handleRetake} style={styles.actionButton}>
            Retake
          </Button>
          <Button mode="contained" onPress={handleUsePhoto} style={styles.actionButton}>
            Use This Photo
          </Button>
        </View>

        <Portal>
          <Dialog visible={!!error} onDismiss={handleDismissError}>
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Text>{error}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleDismissError}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }

  // Show processing overlay
  if (processing) {
    return (
      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.processingText}>Analyzing document...</Text>
        <Text style={styles.processingSubtext}>
          This may take a few moments. We're extracting text and translating medical terminology.
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  preview: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  processingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default CameraScanScreen;
