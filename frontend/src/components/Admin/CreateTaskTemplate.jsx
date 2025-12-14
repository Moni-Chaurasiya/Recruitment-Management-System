import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';

const CreateTaskTemplate = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    taskNumber: '',
    title: '',
    description: '',
    instructions: '',
    timeLimit: 60, // NEW - default 60 minutes
    questions: [{
      questionText: '',
      questionType: 'mcq',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    }]
  });

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, {
        questionText: '',
        questionType: 'mcq',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1
      }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    
    if (field === 'questionType' && value === 'text') {
      newQuestions[index].options = [];
      newQuestions[index].correctAnswer = '';
    } else if (field === 'questionType' && value === 'mcq') {
      newQuestions[index].options = ['', '', '', ''];
      newQuestions[index].correctAnswer = '';
    }
    
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (q.questionType === 'mcq') {
        const filledOptions = q.options.filter(opt => opt.trim() !== '');
        if (filledOptions.length < 2) {
          toast.error(`Question ${i + 1}: Please provide at least 2 options for MCQ`);
          return;
        }
        if (!q.correctAnswer) {
          toast.error(`Question ${i + 1}: Please select the correct answer`);
          return;
        }
      }
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/task-templates/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Task template created successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task template');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="admin" userName={user?.fullName} />

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Task Template</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Task Number & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.taskNumber}
                  onChange={(e) => setFormData({ ...formData, taskNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., TASK-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., JavaScript Fundamentals"
                />
              </div>
            </div>

            {/* Time Limit - NEW */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes) *
              </label>
              <input
                type="number"
                required
                min="15"
                max="180"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                ⏱️ Students will have <strong>{formData.timeLimit} minutes</strong> to complete this assessment once they start. The test will auto-submit when time expires.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                rows="3"
                placeholder="Brief description of the task..."
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                rows="4"
                placeholder="Step-by-step instructions for students..."
              />
            </div>

            {/* Questions Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Question
                </button>
              </div>

              {formData.questions.map((question, qIndex) => (
                <div key={qIndex} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Question {qIndex + 1}</h3>
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      required
                      value={question.questionText}
                      onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                      rows="2"
                      placeholder="Enter your question..."
                    />
                  </div>

                  {/* Question Type and Points */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Type *
                      </label>
                      <select
                        value={question.questionType}
                        onChange={(e) => updateQuestion(qIndex, 'questionType', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="mcq">Multiple Choice (MCQ)</option>
                        <option value="text">Text Answer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={question.points}
                        onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* MCQ Options */}
                  {question.questionType === 'mcq' && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options (Enter at least 2 options)
                      </label>
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex gap-2 items-center">
                          <span className="text-gray-600 font-medium min-w-[30px]">
                            {String.fromCharCode(65 + oIndex)}.
                          </span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                          />
                        </div>
                      ))}

                      {/* Correct Answer Selection */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correct Answer *
                        </label>
                        <select
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select correct answer...</option>
                          {question.options.map((option, oIndex) => 
                            option.trim() !== '' && (
                              <option key={oIndex} value={option}>
                                {String.fromCharCode(65 + oIndex)}. {option}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                  {question.questionType === 'text' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        💡 This is a text answer question. Students will type their answer, and you can manually grade it later.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Create Task Template
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskTemplate;
