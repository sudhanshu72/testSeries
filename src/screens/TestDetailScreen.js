import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

export default function TestDetailScreen({ route, navigation }) {
  const { test } = route.params;

  const handleStartTest = () => {
    navigation.navigate('QuestionScreen', { test });
  };

  const handleViewResults = () => {
    // Navigate to results if completed
    if (test.completed) {
      navigation.navigate('ResultScreen', { test });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{test.title}</Text>
        <View style={[
          styles.statusBadge,
          test.completed ? styles.completedBadge : styles.pendingBadge
        ]}>
          <Text style={styles.statusText}>
            {test.completed ? 'Completed' : 'Available'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>{test.description}</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Test Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category:</Text>
            <Text style={styles.infoValue}>{test.category}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Questions:</Text>
            <Text style={styles.infoValue}>{test.questionsCount}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duration:</Text>
            <Text style={styles.infoValue}>{test.duration}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Difficulty:</Text>
            <Text style={[styles.infoValue, styles[`${test.difficulty.toLowerCase()}Text`]]}>
              {test.difficulty}
            </Text>
          </View>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>
            • Read each question carefully before answering{'\n'}
            • You can navigate between questions using Next/Previous buttons{'\n'}
            • Timer will be shown at the top of the screen{'\n'}
            • Once submitted, answers cannot be changed{'\n'}
            • Your score will be calculated based on correct answers{'\n'}
            • Review explanations after completing the test
          </Text>
        </View>

        {test.completed && test.score !== null ? (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Previous Attempt</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Your Score:</Text>
              <Text style={styles.scoreValue}>{test.score}%</Text>
            </View>
            <TouchableOpacity 
              style={[styles.button, styles.resultsButton]}
              onPress={handleViewResults}
            >
              <Text style={styles.buttonText}>View Detailed Results</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.retakeButton]}
              onPress={handleStartTest}
            >
              <Text style={styles.retakeButtonText}>Retake Test</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.startCard}>
            <Text style={styles.startTitle}>Ready to Start?</Text>
            <Text style={styles.startDescription}>
              Make sure you have a stable internet connection and enough time to complete the test.
            </Text>
            <TouchableOpacity 
              style={[styles.button, styles.startButton]}
              onPress={handleStartTest}
            >
              <Text style={styles.buttonText}>Start Test Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 25,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 90,
    alignItems: 'center',
  },
  completedBadge: {
    backgroundColor: '#34C759',
  },
  pendingBadge: {
    backgroundColor: '#FF9500',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  easyText: {
    color: '#34C759',
  },
  mediumText: {
    color: '#FF9500',
  },
  hardText: {
    color: '#FF3B30',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  startCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  startDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#007AFF',
  },
  resultsButton: {
    backgroundColor: '#34C759',
  },
  retakeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  retakeButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});