import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';

const MyAssessments = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks/my-tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
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

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="student" userName={user?.fullName} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Assessments</h1>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading assessments...</div>
          ) : tasks.length === 0 ? (
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
              {tasks.map((task, index) => (
                <div key={task._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Assessment Task {index + 1}
                      </h2>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Position:</span> {task.applicationId?.position}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Task Number:</span> {task.taskNumber}
                      </p>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                      <div className="text-sm font-medium">Time Remaining</div>
                      <div className="text-lg font-bold">
                        {calculateTimeRemaining(task.assignedAt, task.deadline)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                    {task.description && (
                      <p className="text-gray-700 mb-3">{task.description}</p>
                    )}
                    {task.instructions && (
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Instructions:</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{task.instructions}</p>
                      </div>
                    )}
                  </div>

                  {task.resourceUrl && (
                    <div className="mb-4">
                      <a
                        href={task.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        📎 View Resources
                      </a>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                      Start Assessment
                    </button>
                    <span className={`px-4 py-3 rounded-lg font-medium ${
                      task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      task.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAssessments;