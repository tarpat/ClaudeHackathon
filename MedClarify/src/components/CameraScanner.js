import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScanOverlay from './ScanOverlay';

/**
 * Camera scanner component with document detection overlay
 */
const CameraScanner = ({ onCapture, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isAligned, setIsAligned] = useState(false);
  const cameraRef = useRef(null);
  const insets = useSafeAreaInsets();

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          MedClarify needs camera access to scan documents.
        </Text>
        <Button mode="contained" onPress={requestPermission} style={styles.permissionButton}>
          Grant Permission
        </Button>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
        });
        onCapture(photo);
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    }
  };

  const toggleFlash = () => {
    setFlashEnabled((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        enableTorch={flashEnabled}
      />

      {/* Scan overlay - positioned absolutely on top of camera */}
      <ScanOverlay isAligned={isAligned} />

      {/* Top controls - positioned absolutely on top of camera */}
      <View style={[styles.topControls, { top: insets.top + 10 }]}>
        <IconButton
          icon="close"
          iconColor="#FFFFFF"
          size={32}
          onPress={onClose}
          style={styles.closeButton}
        />

        <IconButton
          icon={flashEnabled ? 'flash' : 'flash-off'}
          iconColor="#FFFFFF"
          size={32}
          onPress={toggleFlash}
          style={styles.flashButton}
        />
      </View>

      {/* Bottom capture button - positioned absolutely on top of camera */}
      <View style={[styles.bottomControls, { bottom: insets.bottom + 40 }]}>
        <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    marginTop: 12,
  },
  camera: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  flashButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bottomControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
});

export default CameraScanner;
