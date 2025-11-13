import React from 'react';
import { StyleSheet } from 'react-native';
import { Banner, Icon } from 'react-native-paper';

/**
 * Disclaimer banner shown on all screens
 * Displays important warning that this is not medical advice
 */
const DisclaimerBanner = ({ visible = true, style }) => {
  return (
    <Banner
      visible={visible}
      icon={({ size }) => (
        <Icon source="alert-circle" size={size} color="#F44336" />
      )}
      style={[styles.banner, style]}
    >
      This is not medical advice. Always consult your healthcare provider for medical decisions.
    </Banner>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
});

export default DisclaimerBanner;
