import React, { useState, useEffect } from 'react';
import questions from './questions';
import './App.css';

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes

  useEffect(() => {
    let interval;
    if (quizStarted && !showResult) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowResult(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, showResult]);

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setTimer(300);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!quizStarted) {
    return (
      <div className="container">
        <div className="card">
          <h1>Welcome to the Quiz</h1>
          <button onClick={() => setQuizStarted(true)}>Start Quiz</button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="container">
        <div className="card">
          <h1>Quiz Finished!</h1>
          <p>Your Score: {score} / {questions.length}</p>
          <button onClick={handleRestart}>Restart Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <span>Time Left: {formatTime(timer)}</span>
        </div>
        <h2>{questions[currentQuestion].question}</h2>
        <div className="options">
          {questions[currentQuestion].options.map((option, index) => {
            let className = 'option';
            if (selectedOption !== null) {
              if (index === questions[currentQuestion].correctAnswer) {
                className += ' correct';
              } else if (index === selectedOption) {
                className += ' incorrect';
              }
            }
            return (
              <div
                key={index}
                className={className}
                onClick={() => handleOptionClick(index)}
              >
                {option}
              </div>
            );
          })}
        </div>
        <button onClick={handleNext} disabled={selectedOption === null} className="next-button">
          {currentQuestion + 1 === questions.length ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default App;
