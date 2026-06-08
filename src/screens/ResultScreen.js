import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';

export default function ResultScreen({ route, navigation }) {
  const { test, questions = [], selectedOptions = {}, score = 0, correctAnswers = 0, totalQuestions = 0 } = route.params;
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedQ, setSelectedQ] = useState(0);

  const total = totalQuestions || questions.length;
  const correct = correctAnswers || 0;
  const percentage = score || 0;

  const getColor = (s) => {
    if (s >= 80) return '#34C759';
    if (s >= 60) return '#007AFF';
    if (s >= 40) return '#FF9500';
    return '#FF3B30';
  };

  const getMessage = (s) => {
    if (s >= 80) return 'Excellent! Great performance!';
    if (s >= 60) return 'Good job! Keep practicing!';
    if (s >= 40) return 'Satisfactory. Review the topics.';
    return 'Needs more practice. Focus on basics.';
  };

  const color = getColor(percentage);

  const handleViewExplanation = (index) => {
    setSelectedQ(index);
    setShowExplanation(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Test Results</Text>
        <Text style={styles.headerSub}>{test.title}</Text>
      </View>

      {/* Score Card */}
      <View style={styles.scoreCard}>
        <View style={[styles.scoreCircle, { borderColor: color }]}>
          <Text style={[styles.scoreText, { color }]}>{percentage}%</Text>
        </View>
        <Text style={[styles.message, { color }]}>{getMessage(percentage)}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: '#34C759' }]}>{correct}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: '#FF3B30' }]}>{total - correct}</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Question Review */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Question Review</Text>
        <Text style={styles.reviewSub}>Tap to view explanation</Text>

        {questions.slice(0, 15).map((q, i) => {
          const isCorrect = q.is_correct !== undefined
            ? q.is_correct
            : selectedOptions[i] === q.correct_answer;
          const userAns = q.user_answer || selectedOptions[i] || '-';
          const correctAns = q.correct_answer || '-';

          return (
            <TouchableOpacity
              key={i}
              style={[styles.reviewItem, { borderLeftColor: isCorrect ? '#34C759' : '#FF3B30' }]}
              onPress={() => handleViewExplanation(i)}
            >
              <View style={styles.reviewItemHeader}>
                <Text style={styles.qNum}>Q{q.question_number || i + 1}</Text>
                <View style={[styles.badge, isCorrect ? styles.correctBadge : styles.incorrectBadge]}>
                  <Text style={styles.badgeText}>{isCorrect ? 'Correct' : 'Incorrect'}</Text>
                </View>
              </View>
              <Text style={styles.qPreview} numberOfLines={2}>{q.question}</Text>
              <View style={styles.answerRow}>
                <Text style={styles.ansLabel}>Your: <Text style={isCorrect ? styles.correctText : styles.incorrectText}>{userAns}</Text></Text>
                {!isCorrect && <Text style={styles.ansLabel}>  Correct: <Text style={styles.correctText}>{correctAns}</Text></Text>}
              </View>
            </TouchableOpacity>
          );
        })}

        {questions.length > 15 && (
          <Text style={styles.moreText}>+ {questions.length - 15} more questions</Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#007AFF' }]} onPress={() => navigation.replace('QuestionScreen', { test })}>
          <Text style={styles.actionBtnText}>Retake Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e8e8e8' }]} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={[styles.actionBtnText, { color: '#333' }]}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* Explanation Modal */}
      <Modal visible={showExplanation} transparent animationType="slide" onRequestClose={() => setShowExplanation(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {questions[selectedQ] && (
                <>
                  <Text style={styles.modalTitle}>Q{questions[selectedQ].question_number || selectedQ + 1} Explanation</Text>
                  <Text style={styles.modalQuestion}>{questions[selectedQ].question}</Text>

                  <View style={styles.modalOptions}>
                    {Object.entries(questions[selectedQ].options || {}).map(([key, val]) => {
                      const correctAns = questions[selectedQ].correct_answer;
                      const userAns = questions[selectedQ].user_answer || selectedOptions[selectedQ];
                      const isCorrectOption = key === correctAns;
                      const isUserWrong = key === userAns && !isCorrectOption;
                      return (
                        <View key={key} style={[styles.modalOption, isCorrectOption && styles.correctOption, isUserWrong && styles.wrongOption]}>
                          <Text style={styles.modalOptionKey}>{key}.</Text>
                          <Text style={styles.modalOptionVal}>{val}</Text>
                          {isCorrectOption && <Text style={styles.checkmark}> ✓</Text>}
                          {isUserWrong && <Text style={styles.crossmark}> ✗</Text>}
                        </View>
                      );
                    })}
                  </View>

                  {questions[selectedQ].explanation && (
                    <View style={styles.explanationBox}>
                      <Text style={styles.explanationTitle}>Explanation:</Text>
                      <Text style={styles.explanationText}>{questions[selectedQ].explanation}</Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowExplanation(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', padding: 25, paddingTop: 55 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 4 },
  scoreCard: { backgroundColor: '#fff', borderRadius: 12, padding: 30, margin: 16, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  scoreCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  scoreText: { fontSize: 36, fontWeight: 'bold' },
  message: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 24 },
  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  reviewSection: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginHorizontal: 16, marginBottom: 16 },
  reviewTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  reviewSub: { fontSize: 13, color: '#888', marginBottom: 16 },
  reviewItem: { backgroundColor: '#f8f9fa', borderRadius: 8, padding: 14, marginBottom: 10, borderLeftWidth: 4 },
  reviewItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  qNum: { fontWeight: '600', color: '#333' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  correctBadge: { backgroundColor: '#34C759' },
  incorrectBadge: { backgroundColor: '#FF3B30' },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  qPreview: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 8 },
  answerRow: { flexDirection: 'row', flexWrap: 'wrap' },
  ansLabel: { fontSize: 12, color: '#666' },
  correctText: { color: '#34C759', fontWeight: '600' },
  incorrectText: { color: '#FF3B30', fontWeight: '600' },
  moreText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: 8 },
  actions: { paddingHorizontal: 16, paddingBottom: 30 },
  actionBtn: { padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 24, maxHeight: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalQuestion: { fontSize: 15, color: '#333', lineHeight: 22, marginBottom: 16, backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8 },
  modalOptions: { marginBottom: 16 },
  modalOption: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 6 },
  correctOption: { backgroundColor: '#d4edda', borderWidth: 1, borderColor: '#c3e6cb' },
  wrongOption: { backgroundColor: '#f8d7da', borderWidth: 1, borderColor: '#f5c6cb' },
  modalOptionKey: { fontWeight: '600', marginRight: 8, minWidth: 20 },
  modalOptionVal: { flex: 1, fontSize: 14, lineHeight: 20 },
  checkmark: { color: '#34C759', fontWeight: 'bold' },
  crossmark: { color: '#FF3B30', fontWeight: 'bold' },
  explanationBox: { backgroundColor: '#e8f4fd', borderRadius: 8, padding: 14 },
  explanationTitle: { fontWeight: '600', color: '#333', marginBottom: 6 },
  explanationText: { fontSize: 14, color: '#555', lineHeight: 22 },
  closeBtn: { marginTop: 16, padding: 14, backgroundColor: '#f0f0f0', borderRadius: 8, alignItems: 'center' },
  closeBtnText: { fontSize: 15, fontWeight: '600', color: '#555' },
});
