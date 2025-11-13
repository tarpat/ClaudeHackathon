import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Camera overlay with document frame and guidance
 * Shows a full-width document-shaped rectangle frame
 */
const ScanOverlay = ({ isAligned = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.01,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  const frameColor = isAligned ? '#4CAF50' : '#FFFFFF';

  return (
    <View style={styles.overlay}>
      {/* Document frame - full width */}
      <Animated.View
        style={[
          styles.frameContainer,
          {
            transform: [{ scale: scaleAnim }],
            borderColor: frameColor,
          },
        ]}
      >
        {/* Corner accents */}
        <View style={[styles.cornerTopLeft, { borderColor: frameColor }]} />
        <View style={[styles.cornerTopRight, { borderColor: frameColor }]} />
        <View style={[styles.cornerBottomLeft, { borderColor: frameColor }]} />
        <View style={[styles.cornerBottomRight, { borderColor: frameColor }]} />
      </Animated.View>

      {/* Guidance text at bottom */}
      <View style={[styles.textContainer, { bottom: insets.bottom + 140 }]}>
        <Text style={styles.guidanceText}>
          {isAligned
            ? 'Document detected - Hold steady'
            : 'Position document within frame'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  frameContainer: {
    width: SCREEN_WIDTH - 40, // Full width with 20px margin on each side
    height: SCREEN_HEIGHT * 0.7, // 70% of screen height for document shape
    borderWidth: 3,
    borderRadius: 8,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 40,
    height: 40,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 40,
    height: 40,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -3,
    left: -3,
    width: 40,
    height: 40,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 40,
    height: 40,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 8,
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  guidanceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});

export default ScanOverlay;
