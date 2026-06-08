import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { api } from '../lib/api';
import GK_DATA from '../../data/GK.json';

export default function QuestionScreen({ route, navigation }) {
  const { test } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Try API first
        const { data, error } = await api.getQuestions(test.id);
        if (!error && data && data.questions) {
          setQuestions(data.questions);
        } else {
          // Fallback: Load from local GK.json and clean citations
          const cleaned = GK_DATA.questions.map((q) => ({
            question_number: q.question_number,
            question: q.question.replace(/\s*\[cite:.*?\]/g, ''),
            options: Object.fromEntries(
              Object.entries(q.options).map(([k, v]) => [k, v.replace(/\s*\[cite:.*?\]/g, '')])
            ),
            correct_answer: q.correct_answer.replace(/\s*\[cite:.*?\]/g, '').trim(),
            explanation: q.explanation.replace(/\s*\[cite:.*?\]/g, ''),
          }));
          setQuestions(cleaned);
        }
      } catch (err) {
        // Fallback to local
        const cleaned = GK_DATA.questions.map((q) => ({
          question_number: q.question_number,
          question: q.question.replace(/\s*\[cite:.*?\]/g, ''),
          options: Object.fromEntries(
            Object.entries(q.options).map(([k, v]) => [k, v.replace(/\s*\[cite:.*?\]/g, '')])
          ),
          correct_answer: q.correct_answer.replace(/\s*\[cite:.*?\]/g, '').trim(),
          explanation: q.explanation.replace(/\s*\[cite:.*?\]/g, ''),
        }));
        setQuestions(cleaned);
      }
      setLoading(false);
    };

    loadQuestions();

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionKey) => {
    setSelectedOptions({ ...selectedOptions, [currentQuestionIndex]: optionKey });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Try to submit via API
    const { data } = await api.submitTest(test.id, selectedOptions);

    if (data) {
      navigation.replace('ResultScreen', {
        test,
        questions: data.results,
        score: data.score,
        correctAnswers: data.correct_answers,
        totalQuestions: data.total_questions,
      });
    } else {
      // Local fallback scoring
      let correct = 0;
      questions.forEach((q, i) => {
        if (selectedOptions[i] === q.correct_answer) correct++;
      });
      const score = Math.round((correct / questions.length) * 100);
      navigation.replace('ResultScreen', {
        test,
        questions,
        selectedOptions,
        score,
        correctAnswers: correct,
        totalQuestions: questions.length,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No questions available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.timerRow}>
          <Text style={styles.timerLabel}>Time Left</Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }]}
          />
        </View>
      </View>

      {/* Question */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={styles.questionNumber}>Q{currentQuestion.question_number}.</Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            const isSelected = selectedOptions[currentQuestionIndex] === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.optionButton, isSelected && styles.selectedOption]}
                onPress={() => handleOptionSelect(key)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionCircle, isSelected && styles.selectedCircle]}>
                  <Text style={[styles.optionKey, isSelected && styles.selectedKey]}>{key}</Text>
                </View>
                <Text style={[styles.optionText, isSelected && styles.selectedText]}>{value}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, styles.prevBtn, currentQuestionIndex === 0 && styles.disabledBtn]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={[styles.navBtnText, currentQuestionIndex === 0 && styles.disabledText]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reviewBtn} onPress={() => setShowReviewModal(true)}>
          <Text style={styles.reviewBtnText}>
            {Object.values(selectedOptions).filter(Boolean).length}/{questions.length}
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex < questions.length - 1 ? (
          <TouchableOpacity style={[styles.navBtn, styles.nextBtn]} onPress={handleNext}>
            <Text style={styles.navBtnText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navBtn, styles.submitBtn]} onPress={handleSubmit}>
            <Text style={styles.navBtnText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Review Modal */}
      <Modal visible={showReviewModal} transparent animationType="slide" onRequestClose={() => setShowReviewModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Question Navigator</Text>
            <View style={styles.legend}>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#34C759' }]} /><Text style={styles.legendText}>Answered</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#e0e0e0' }]} /><Text style={styles.legendText}>Not answered</Text></View>
            </View>
            <ScrollView contentContainerStyle={styles.gridContainer}>
              {questions.map((_, i) => {
                const answered = selectedOptions[i] != null;
                const isCurrent = i === currentQuestionIndex;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.gridItem,
                      answered && styles.answeredItem,
                      isCurrent && styles.currentItem,
                    ]}
                    onPress={() => { setCurrentQuestionIndex(i); setShowReviewModal(false); }}
                  >
                    <Text style={[styles.gridText, answered && styles.answeredText, isCurrent && styles.currentText]}>
                      {i + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowReviewModal(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 50 },
  timerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timerLabel: { color: '#fff', opacity: 0.8, marginRight: 10 },
  timer: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  progressText: { color: '#fff', marginBottom: 6 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  content: { flex: 1 },
  contentInner: { padding: 20 },
  questionNumber: { fontSize: 16, fontWeight: 'bold', color: '#007AFF', marginBottom: 8 },
  questionText: { fontSize: 17, color: '#333', lineHeight: 26, marginBottom: 24 },
  optionsContainer: { gap: 10 },
  optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 16, borderWidth: 1.5, borderColor: '#e0e0e0' },
  selectedOption: { borderColor: '#007AFF', backgroundColor: '#f0f7ff' },
  optionCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  selectedCircle: { backgroundColor: '#007AFF' },
  optionKey: { fontSize: 15, fontWeight: '600', color: '#666' },
  selectedKey: { color: '#fff' },
  optionText: { fontSize: 15, color: '#333', flex: 1, lineHeight: 22 },
  selectedText: { color: '#007AFF', fontWeight: '500' },
  footer: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', justifyContent: 'space-between' },
  navBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  prevBtn: { backgroundColor: '#e8e8e8' },
  nextBtn: { backgroundColor: '#007AFF' },
  submitBtn: { backgroundColor: '#34C759' },
  disabledBtn: { backgroundColor: '#f5f5f5' },
  navBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  disabledText: { color: '#bbb' },
  reviewBtn: { backgroundColor: '#FF9500', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  reviewBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 24, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  legend: { flexDirection: 'row', marginBottom: 16, gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendText: { fontSize: 13, color: '#666' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  answeredItem: { backgroundColor: '#34C759', borderColor: '#2da44e' },
  currentItem: { borderColor: '#007AFF', borderWidth: 2 },
  gridText: { fontSize: 15, fontWeight: '600', color: '#666' },
  answeredText: { color: '#fff' },
  currentText: { color: '#007AFF' },
  closeBtn: { marginTop: 16, padding: 14, backgroundColor: '#f0f0f0', borderRadius: 8, alignItems: 'center' },
  closeBtnText: { fontSize: 15, fontWeight: '600', color: '#555' },
});
