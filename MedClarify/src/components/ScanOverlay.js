import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';

/**
 * Camera overlay with document frame and guidance
 * Shows a rectangle frame with animated breathing effect
 */
const ScanOverlay = ({ isAligned = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
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
      {/* Top dark area */}
      <View style={styles.darkArea} />

      {/* Middle row with frame */}
      <View style={styles.middleRow}>
        <View style={styles.darkArea} />

        {/* Document frame */}
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

        <View style={styles.darkArea} />
      </View>

      {/* Bottom dark area with text */}
      <View style={styles.darkAreaBottom}>
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
  },
  darkArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  darkAreaBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRow: {
    flexDirection: 'row',
    height: 300,
  },
  frameContainer: {
    width: 280,
    height: 300,
    borderWidth: 2,
    borderRadius: 12,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  guidanceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ScanOverlay;
