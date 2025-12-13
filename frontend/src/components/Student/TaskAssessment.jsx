import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Start the task if not started
      await axios.put(`http://localhost:5000/api/task-assignments/${assignmentId}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch assignment with template
      const response = await axios.get(`http://localhost:5000/api/task-assignments/my-assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const currentAssignment = response.data.find(a => a._id === assignmentId);
      setAssignment(currentAssignment);
      setTemplate(currentAssignment.taskTemplateId);

      // Initialize answers array
      const initialAnswers = currentAssignment.taskTemplateId.questions.map(q => ({
        questionId: q._id,
        answer: ''
      }));
      setAnswers(initialAnswers);
    } catch (error) {
        console.log(error);
      toast.error('Failed to load assignment');
      navigate('/student/assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].answer = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all questions are answered
    const unanswered = answers.some(ans => !ans.answer || ans.answer.trim() === '');
    if (unanswered) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/task-submissions/submit', {
        taskAssignmentId: assignmentId,
        answers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Task submitted successfully!');
      navigate('/student/assessments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading assessment...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="student" userName={user?.fullName} />

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{template?.title}</h1>
          <p className="text-gray-600 mb-4">{template?.description}</p>
          
          {template?.instructions && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
              <p className="text-blue-800 whitespace-pre-wrap">{template.instructions}</p>
            </div>
          )}

          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Questions: {template?.questions?.length}</span>
            <span>Total Points: {template?.totalPoints}</span>
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

              <p className="text-gray-700 mb-4">{question.questionText}</p>

              {question.questionType === 'mcq' ? (
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index]?.answer === option}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        required
                      />
                      <span className="ml-3 text-gray-700">
                        {String.fromCharCode(65 + oIndex)}. {option}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[index]?.answer || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  rows="5"
                  placeholder="Type your answer here..."
                  required
                />
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/student/assessments')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
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