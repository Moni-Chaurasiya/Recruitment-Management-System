import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';

const AssignTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const preSelectedApp = location.state?.application;

  const [applications, setApplications] = useState([]);
  const [taskNumbers, setTaskNumbers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    applicationId: preSelectedApp?._id || '',
    userId: preSelectedApp?.userId?._id || '',
    taskNumber: '',
    deadline: 24
  });

  useEffect(() => {
    fetchTaskNumbers();
    if (!preSelectedApp) {
      fetchApplications();
    }
  }, []);

  const fetchTaskNumbers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/task-templates/numbers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaskNumbers(response.data);
    } catch (error) {
        console.log(error);
      toast.error('Failed to fetch task numbers');
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/applications/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
        console.log(error);
      toast.error('Failed to fetch applications');
    }
  };

  const handleApplicationSelect = (appId) => {
    const selected = applications.find(app => app._id === appId);
    setFormData({
      ...formData,
      applicationId: appId,
      userId: selected?.userId?._id || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/task-assignments/assign', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Task assigned successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="admin" userName={user?.fullName} />

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Assign Task to Student</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Application */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Applicant *
              </label>
              {preSelectedApp ? (
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-300">
                  <p className="font-medium">{preSelectedApp.userId?.fullName}</p>
                  <p className="text-sm text-gray-600">{preSelectedApp.position}</p>
                </div>
              ) : (
                <select
                  required
                  value={formData.applicationId}
                  onChange={(e) => handleApplicationSelect(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose an applicant...</option>
                  {applications.map((app) => (
                    <option key={app._id} value={app._id}>
                      {app.userId?.fullName} - {app.position}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Task Number Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Task Number *
              </label>
              <select
                required
                value={formData.taskNumber}
                onChange={(e) => setFormData({ ...formData, taskNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose a task...</option>
                {taskNumbers.map((task) => (
                  <option key={task._id} value={task.taskNumber}>
                    {task.taskNumber} - {task.title}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Tasks are created in "Create New Task" section
              </p>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline (Hours) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                placeholder="24"
              />
              <p className="text-sm text-gray-500 mt-1">Number of hours from now</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Assigning...' : 'Assign Task'}
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

export default AssignTask;