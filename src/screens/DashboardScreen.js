import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, profile, isAdmin, signOut } = useAuth();

  const displayName = profile?.full_name?.trim() || user?.email || 'User';

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleViewExams = () => {
    navigation.navigate('TestList');
  };

  const handleViewProgress = () => {
    Alert.alert('Coming Soon', 'Progress tracking feature is coming soon!');
  };

  const handleViewRankings = () => {
    Alert.alert('Coming Soon', 'Rankings feature is coming soon!');
  };

  const handleManageExams = () => {
    Alert.alert('Admin Feature', 'Exam management feature is coming soon!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.welcomeText}>Welcome, {displayName}!</Text>
        <Text style={styles.roleBadge}>
          {isAdmin ? 'Admin' : 'Student'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Exams</Text>
          <Text style={styles.cardDescription}>
            Browse and attempt published exams
          </Text>
          <TouchableOpacity style={styles.cardButton} onPress={handleViewExams}>
            <Text style={styles.cardButtonText}>View Exams</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Progress</Text>
          <Text style={styles.cardDescription}>
            Track your performance and scores
          </Text>
          <TouchableOpacity style={styles.cardButton} onPress={handleViewProgress}>
            <Text style={styles.cardButtonText}>View Progress</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rankings</Text>
          <Text style={styles.cardDescription}>
            Compare your rank against other students
          </Text>
          <TouchableOpacity style={styles.cardButton} onPress={handleViewRankings}>
            <Text style={styles.cardButtonText}>View Rankings</Text>
          </TouchableOpacity>
        </View>

        {isAdmin && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Admin</Text>
            <Text style={styles.cardDescription}>
              Create and publish exams and questions
            </Text>
            <TouchableOpacity style={styles.cardButton} onPress={handleManageExams}>
              <Text style={styles.cardButtonText}>Manage Exams</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  roleBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  card: {
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  cardButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});
