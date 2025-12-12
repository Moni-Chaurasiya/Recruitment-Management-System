import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';

const CreateTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const preSelectedApp = location.state?.application;

  const [formData, setFormData] = useState({
    applicationId: preSelectedApp?._id || '',
    userId: preSelectedApp?.userId?._id || '',
    taskNumber: '',
    title: '',
    description: '',
    instructions: '',
    resourceUrl: '',
    deadline: 24
  });

  useEffect(() => {
    if (!preSelectedApp) {
      fetchApplications();
    }
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/applications/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
      console.error(error);
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
      await axios.post('http://localhost:5000/api/tasks/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Task created and assigned successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="admin" userName={user?.fullName} />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Task</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Application */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Applicant
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

            {/* Task Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Number
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

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Machine Learning Model Development"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
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
                Step-by-step Instructions (Optional)
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                rows="5"
                placeholder="1. First step...
2. Second step...
3. Third step..."
              />
            </div>

            {/* Resource URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Resources URL (Optional)
              </label>
              <input
                type="url"
                value={formData.resourceUrl}
                onChange={(e) => setFormData({ ...formData, resourceUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/resources"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline (Hours)
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
                {loading ? 'Creating Task...' : 'Create Task'}
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

export default CreateTask;