import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';

const Status = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/applications/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to fetch application status');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Progress':
        return '🔄';
      case 'Under Review':
        return '👀';
      case 'Completed':
        return '✅';
      case 'Rejected':
        return '❌';
      default:
        return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="student" userName={user?.fullName} />

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Application Status</h1>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No applications to display
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getStatusIcon(app.status)}</span>
                        <h3 className="text-xl font-semibold text-gray-900">{app.position}</h3>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Applied on: {new Date(app.appliedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {app.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {app.skills.length > 3 && (
                          <span className="text-gray-500 text-sm">+{app.skills.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                        app.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
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

export default Status;