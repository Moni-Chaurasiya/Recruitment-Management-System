import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';

const ViewSubmissions = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [submissions, setSubmissions] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [userId]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/task-submissions/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSubmissions(response.data);
      if (response.data.length > 0) {
        setStudentInfo(response.data[0].userId);
      }
    } catch (error) {
        console.log(error);
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const viewSubmissionDetails = (submission) => {
    setSelectedSubmission(selectedSubmission?._id === submission._id ? null : submission);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="admin" userName={user?.fullName} />

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Submitted Tasks - {studentInfo?.fullName}
            </h1>
            <p className="text-gray-600">{studentInfo?.email}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            No submissions yet
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission._id} className="bg-white rounded-lg shadow-lg">
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => viewSubmissionDetails(submission)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {submission.taskNumber}
                      </h3>
                      <p className="text-gray-600">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                      <div className="mt-2">
                        <span className="text-lg font-semibold text-purple-600">
                          Score: {submission.totalPoints}/{submission.maxPoints} points
                        </span>
                      </div>
                    </div>
                    <div>
                      <svg
                        className={`w-6 h-6 text-gray-600 transition-transform ${
                          selectedSubmission?._id === submission._id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Submission Details */}
                {selectedSubmission?._id === submission._id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Questions & Answers</h4>
                    <div className="space-y-6">
                      {submission.answers.map((answer, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-semibold text-gray-900">Question {index + 1}</h5>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                              {answer.pointsEarned} points
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{answer.questionText}</p>
                          
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-3">
                            <p className="text-sm font-medium text-blue-900 mb-1">Student's Answer:</p>
                            <p className="text-blue-800">{answer.answer}</p>
                          </div>

                          {answer.questionType === 'mcq' && (
                            <div className="mt-2">
                              {answer.isCorrect ? (
                                <span className="text-green-600 font-medium flex items-center gap-1">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Correct
                                </span>
                              ) : (
                                <span className="text-red-600 font-medium flex items-center gap-1">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                  Incorrect
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {submission.feedback && (
                      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4">
                        <p className="text-sm font-medium text-yellow-900 mb-1">Admin Feedback:</p>
                        <p className="text-yellow-800">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSubmissions;