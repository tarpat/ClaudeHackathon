import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';

/**
 * Displays confidence score with color-coded progress bar
 * Green (80-100): High confidence
 * Amber (50-79): Medium confidence
 * Red (0-49): Low confidence
 */
const ConfidenceIndicator = ({ confidence, showLabel = true, style }) => {
  const getConfidenceColor = (score) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 50) return '#FFC107'; // Amber
    return '#F44336'; // Red
  };

  const getConfidenceText = (score) => {
    if (score >= 80) return 'High Confidence';
    if (score >= 50) return 'Medium Confidence';
    return 'Low Confidence - Verify with Doctor';
  };

  const color = getConfidenceColor(confidence);
  const normalizedProgress = confidence / 100;

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{getConfidenceText(confidence)}</Text>
          <Text style={[styles.score, { color }]}>{confidence}%</Text>
        </View>
      )}
      <ProgressBar
        progress={normalizedProgress}
        color={color}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  score: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default ConfidenceIndicator;
