import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, Divider } from 'react-native-paper';
import ConfidenceIndicator from './ConfidenceIndicator';

/**
 * Displays a section of translated medical text
 * Shows original and simplified versions side by side
 */
const TranslationCard = ({ section }) => {
  const [expandedTerms, setExpandedTerms] = useState({});

  const toggleTerm = (term) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return '#F44336';
      case 'important':
        return '#FFC107';
      default:
        return '#4CAF50';
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return 'URGENT';
      case 'important':
        return 'Important';
      default:
        return 'Normal';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Section Title and Urgency */}
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>
            {section.title}
          </Text>
          <Chip
            mode="flat"
            style={[
              styles.urgencyChip,
              { backgroundColor: getUrgencyColor(section.urgency) },
            ]}
            textStyle={styles.urgencyText}
          >
            {getUrgencyLabel(section.urgency)}
          </Chip>
        </View>

        {/* Confidence Indicator */}
        <ConfidenceIndicator confidence={section.confidence} />

        <Divider style={styles.divider} />

        {/* Original Text */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.sectionLabel}>
            Original Medical Text
          </Text>
          <Text style={styles.originalText}>{section.original}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Simplified Text */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.sectionLabel}>
            Plain Language Explanation
          </Text>
          <Text style={styles.simplifiedText}>{section.simplified}</Text>
        </View>

        {/* Key Terms */}
        {section.keyTerms && section.keyTerms.length > 0 && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.section}>
              <Text variant="labelLarge" style={styles.sectionLabel}>
                Key Medical Terms
              </Text>
              <View style={styles.termsContainer}>
                {section.keyTerms.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => toggleTerm(item.term)}
                    style={styles.termButton}
                  >
                    <Chip
                      mode="outlined"
                      selected={expandedTerms[item.term]}
                      style={styles.termChip}
                    >
                      {item.term}
                    </Chip>
                    {expandedTerms[item.term] && (
                      <Text style={styles.termDefinition}>{item.definition}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  urgencyChip: {
    marginLeft: 8,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  section: {
    marginVertical: 4,
  },
  sectionLabel: {
    color: '#666',
    marginBottom: 4,
  },
  originalText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
  },
  simplifiedText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  termButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  termChip: {
    marginBottom: 4,
  },
  termDefinition: {
    fontSize: 13,
    color: '#555',
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});

export default TranslationCard;
