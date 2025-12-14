import React, { useEffect, useState } from 'react';
import { api } from './api';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import WelcomeScreen from './components/WelcomeScreen';
import ResultsScreen from './components/ResultsScreen';

function App() {
  const [view, setView] = useState('welcome'); // welcome, questions, results
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load questions initially
  useEffect(() => {
    async function loadQuestions() {
      try {
        const qs = await api.getQuestions();
        setQuestions(qs);
      } catch (error) {
        console.error("Failed to load questions", error);
      }
    }
    loadQuestions();
  }, []);

  const [error, setError] = useState(null);

  const handleStart = async (nickname) => {
    setLoading(true);
    setError(null);
    try {
      const user = await api.initSession(nickname);
      setSessionId(user.sessionId);
      setView('questions');
    } catch (error) {
      console.error("Failed to start session", error);
      setError("Could not connect to server. Please check your connection.");
      alert(`Error: ${error.message}`); // Simple alert for mobile debugging
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (optionId) => {
    if (submitting) return;
    // Explicitly blur the button to prevent sticky focus states on mobile
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setSubmitting(true);

    try {
      const question = questions[currentIndex];
      await api.submitAnswer(sessionId, question.id, optionId);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setView('results');
      }
    } catch (error) {
      console.error("Failed to submit answer", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    localStorage.removeItem('sessionId'); // Clear session to start fresh
    window.location.reload();
  };

  if (view === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (view === 'results') {
    return <ResultsScreen sessionId={sessionId} onRestart={handleRestart} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No questions available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b 
                    from-slate-950 via-slate-900 to-slate-950 
                    flex flex-col items-center justify-center 
                    py-12 px-4 sm:px-6 lg:px-8">
      <ProgressBar current={currentIndex + 1} total={questions.length} />
      <QuestionCard
        key={questions[currentIndex].id || currentIndex}
        question={questions[currentIndex]}
        onAnswer={handleAnswer}
        isSubmitting={submitting}
      />
    </div>
  );
}

export default App;
