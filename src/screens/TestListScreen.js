import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { api } from '../lib/api';
import GK_DATA from '../../data/GK.json';

export default function TestListScreen({ navigation }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      try {
        // Try API first, fallback to local data
        const { data, error } = await api.getExams();
        if (!error && data) {
          setTests(data);
        } else {
          // Fallback to local data
          setTests([
            {
              id: '1',
              title: GK_DATA.exam_title.replace(/\s*\[cite:.*?\]/g, ''),
              description: `${GK_DATA.section.replace(/\s*\[cite:.*?\]/g, '')} - ${GK_DATA.questions.length} Questions`,
              questionsCount: GK_DATA.questions.length,
              duration: '60 minutes',
              difficulty: 'Medium',
              category: 'General Knowledge',
            },
          ]);
        }
      } catch (err) {
        // Fallback to local data
        setTests([
          {
            id: '1',
            title: GK_DATA.exam_title.replace(/\s*\[cite:.*?\]/g, ''),
            description: `${GK_DATA.section.replace(/\s*\[cite:.*?\]/g, '')} - ${GK_DATA.questions.length} Questions`,
            questionsCount: GK_DATA.questions.length,
            duration: '60 minutes',
            difficulty: 'Medium',
            category: 'General Knowledge',
          },
        ]);
      }
      setLoading(false);
    };

    loadTests();
  }, []);

  const handleTestPress = (test) => {
    navigation.navigate('TestDetail', { test });
  };

  const renderTestItem = ({ item }) => (
    <TouchableOpacity
      style={styles.testCard}
      onPress={() => handleTestPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.testHeader}>
        <Text style={styles.testTitle}>{item.title}</Text>
        <View style={styles.startBadge}>
          <Text style={styles.startText}>Start Now</Text>
        </View>
      </View>
      
      <Text style={styles.testDescription}>{item.description}</Text>
      
      <View style={styles.testDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Questions</Text>
          <Text style={styles.detailValue}>{item.questionsCount}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{item.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Difficulty</Text>
          <Text style={[styles.detailValue, styles.mediumText]}>
            {item.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading tests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Tests</Text>
        <Text style={styles.headerSubtitle}>
          Select a test to begin your practice
        </Text>
      </View>

      <FlatList
        data={tests}
        renderItem={renderTestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 25,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  listContainer: {
    padding: 15,
  },
  testCard: {
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
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  startBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  startText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  testDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  testDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  mediumText: {
    color: '#FF9500',
  },
});
