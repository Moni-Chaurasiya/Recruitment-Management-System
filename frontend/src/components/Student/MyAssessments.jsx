import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';

const MyAssessments = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/task-assignments/my-assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data);
    } catch (error) {
      toast.error('Failed to fetch assignments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = (assignedAt, deadline) => {
    const assigned = new Date(assignedAt);
    const deadlineDate = new Date(assigned.getTime() + deadline * 60 * 60 * 1000);
    const now = new Date();
    const diff = deadlineDate - now;

    if (diff <= 0) return { text: 'Expired', color: 'text-red-600' };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 3) {
      return { text: `${hours}h ${minutes}m`, color: 'text-red-600' };
    } else if (hours < 12) {
      return { text: `${hours}h ${minutes}m`, color: 'text-yellow-600' };
    }
    return { text: `${hours}h ${minutes}m`, color: 'text-green-600' };
  };

  const handleStartAssessment = (assignmentId) => {
    navigate(`/student/assessment/${assignmentId}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Submitted': 'bg-green-100 text-green-800',
      'Reviewed': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="student" userName={user?.fullName} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Assessments</h1>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading assessments...</div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 inline-block">
                <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-600 font-medium">No task has been assigned yet.</p>
                <p className="text-gray-600 mt-2">Please contact the administrator.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {assignments.map((assignment, index) => {
                const timeRemaining = calculateTimeRemaining(assignment.assignedAt, assignment.deadline);
                const canStart = assignment.status !== 'Submitted' && assignment.status !== 'Reviewed';
                
                return (
                  <div key={assignment._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          Assessment Task {index + 1}
                        </h2>
                        <div className="space-y-1 text-gray-600">
                          <p>
                            <span className="font-medium">Position:</span> {assignment.applicationId?.position}
                          </p>
                          <p>
                            <span className="font-medium">Task Number:</span> 
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                              {assignment.taskNumber}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">Title:</span> {assignment.taskTemplateId?.title}
                          </p>
                        </div>
                      </div>
                      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-center">
                        <div className="text-sm font-medium">Time Remaining</div>
                        <div className={`text-lg font-bold ${timeRemaining.color}`}>
                          {timeRemaining.text}
                        </div>
                      </div>
                    </div>

                    {assignment.taskTemplateId?.description && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700">{assignment.taskTemplateId.description}</p>
                      </div>
                    )}

                    {assignment.taskTemplateId?.instructions && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                        <p className="font-medium text-blue-900 mb-1">Instructions:</p>
                        <p className="text-blue-800 whitespace-pre-wrap">{assignment.taskTemplateId.instructions}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-lg font-medium ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                        <span className="text-gray-600">
                          {assignment.taskTemplateId?.questions?.length || 0} Questions
                        </span>
                        <span className="text-gray-600">
                          {assignment.taskTemplateId?.totalPoints || 0} Points
                        </span>
                      </div>
                      
                      {canStart ? (
                        <button
                          onClick={() => handleStartAssessment(assignment._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                        >
                          {assignment.status === 'In Progress' ? 'Continue Assessment' : 'Start Assessment'}
                        </button>
                      ) : (
                        <div className="text-green-600 font-semibold flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Submitted
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAssessments;