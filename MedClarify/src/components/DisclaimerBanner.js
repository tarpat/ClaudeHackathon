import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';

/**
 * Disclaimer banner shown on all screens
 * Displays important warning that this is not medical advice
 */
const DisclaimerBanner = ({ visible = true, style }) => {
  if (!visible) return null;

  return (
    <Surface style={[styles.banner, style]} elevation={1}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <Text variant="bodySmall" style={styles.text}>
          Not medical advice - consult your healthcare provider
        </Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
    marginBottom: 12,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingVertical: 10,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    flex: 1,
    color: '#E65100',
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default DisclaimerBanner;
