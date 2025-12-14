import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';

const TaskAssessment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [assignment, setAssignment] = useState(null);
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [expired, setExpired] = useState(false);
  const timerInterval = useRef(null);

  useEffect(() => {
    fetchAssignment();
    
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Start the task if not started
      const startResponse = await axios.put(
        `http://localhost:5000/api/task-assignments/${assignmentId}/start`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch assignments with populated template
      const response = await axios.get(
        `http://localhost:5000/api/task-assignments/my-assignments`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const currentAssignment = response.data.find(a => a._id === assignmentId);
      
      if (!currentAssignment) {
        toast.error('Assignment not found');
        navigate('/student/assessments');
        return;
      }

      setAssignment(currentAssignment);
      setTemplate(currentAssignment.taskTemplateId);

      // Initialize answers array
      const initialAnswers = currentAssignment.taskTemplateId.questions.map(q => ({
        questionId: q._id,
        answer: ''
      }));
      setAnswers(initialAnswers);

      // Start timer if expiry time is set
      if (currentAssignment.expiresAt) {
        startTimer(currentAssignment.expiresAt);
      }

    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to load assignment');
      }
      navigate('/student/assessments');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (expiryTime) => {
    const updateTimer = () => {
      const now = new Date();
      const expiry = new Date(expiryTime);
      const diff = expiry - now;

      if (diff <= 0) {
        setExpired(true);
        setTimeRemaining('00:00');
        clearInterval(timerInterval.current);
        handleAutoSubmit();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (hours > 0) {
          setTimeRemaining(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }
    };

    updateTimer(); // Update immediately
    timerInterval.current = setInterval(updateTimer, 1000);
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].answer = value;
    setAnswers(newAnswers);
  };

  const handleAutoSubmit = async () => {
    toast.error('Time expired! Submitting automatically...');
    await submitTask();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all questions are answered
    const unanswered = answers.some(ans => !ans.answer || ans.answer.trim() === '');
    if (unanswered) {
      if (!window.confirm('Some questions are not answered. Do you want to submit anyway?')) {
        return;
      }
    }

    await submitTask();
  };

  const submitTask = async () => {
    if (submitting || expired) return;
    
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/task-submissions/submit', {
        taskAssignmentId: assignmentId,
        answers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }

      toast.success('Task submitted successfully!');
      setTimeout(() => navigate('/student/assessments'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit task');
      setSubmitting(false);
    }
  };

  const getTimerColor = () => {
    if (!timeRemaining) return 'text-blue-600';
    
    const parts = timeRemaining.split(':');
    const totalMinutes = parts.length === 3 
      ? parseInt(parts[0]) * 60 + parseInt(parts[1])
      : parseInt(parts[0]);

    if (totalMinutes <= 5) return 'text-red-600 animate-pulse';
    if (totalMinutes <= 15) return 'text-orange-600';
    return 'text-blue-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="student" userName={user?.fullName} />

      {/* Floating Timer */}
      <div className="fixed top-20 right-4 bg-white shadow-2xl rounded-xl p-4 z-50 border-2 border-gray-200">
        <p className="text-xs text-gray-600 mb-1 text-center">Time Remaining</p>
        <p className={`text-3xl font-bold text-center ${getTimerColor()}`}>
          {timeRemaining || 'Loading...'}
        </p>
        {timeRemaining && timeRemaining.split(':')[0] < 5 && (
          <p className="text-xs text-red-600 mt-1 text-center animate-pulse">
            ⚠️ Hurry up!
          </p>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-6 pb-32">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{template?.title}</h1>
          {template?.description && (
            <p className="text-gray-600 mb-4">{template.description}</p>
          )}
          
          {template?.instructions && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions:</h3>
              <p className="text-blue-800 whitespace-pre-wrap">{template.instructions}</p>
            </div>
          )}

          <div className="flex justify-between items-center text-sm text-gray-600 mt-4 pt-4 border-t">
            <span>Total Questions: <strong>{template?.questions?.length}</strong></span>
            <span>Total Points: <strong>{template?.totalPoints}</strong></span>
            <span>Time Limit: <strong>{assignment?.timeLimit} minutes</strong></span>
          </div>
        </div>

        {/* Questions */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {template?.questions.map((question, index) => (
            <div key={question._id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {index + 1}
                </h3>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {question.points} {question.points === 1 ? 'point' : 'points'}
                </span>
              </div>

              <p className="text-gray-700 mb-4 text-lg">{question.questionText}</p>

              {question.questionType === 'mcq' ? (
                <div className="space-y-3">
                  {question.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index]?.answer === option}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        required
                        disabled={expired || submitting}
                      />
                      <span className="ml-3 text-gray-700 font-medium">
                        {String.fromCharCode(65 + oIndex)}. {option}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[index]?.answer || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="6"
                  placeholder="Type your answer here..."
                  required
                  disabled={expired || submitting}
                />
              )}
            </div>
          ))}

          {/* Submit Button - Fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 z-40">
            <div className="max-w-4xl mx-auto flex gap-4">
              <button
                type="submit"
                disabled={submitting || expired}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {submitting ? 'Submitting...' : expired ? 'Time Expired' : 'Submit Assessment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to leave? Your progress will be lost!')) {
                    navigate('/student/assessments');
                  }
                }}
                className="px-6 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskAssessment;