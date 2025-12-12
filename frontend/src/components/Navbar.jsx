import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = ({ role, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate(role === 'admin' ? '/admin/login' : '/student/login');
  };

  const getNavItems = () => {
    if (role === 'student') {
      return [
        { name: 'Dashboard', path: '/student/dashboard' },
        { name: 'My Assessments', path: '/student/assessments' },
        { name: 'Status', path: '/student/status' },
        { name: 'Profile', path: '/student/profile' }
      ];
    } else {
      return [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Create Task', path: '/admin/tasks/create' }
      ];
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">
              {role === 'admin' ? 'Admin Portal' : 'Student Job Portal'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {getNavItems().map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                {item.name}
              </button>
            ))}
            <div className="border-l pl-4">
              <span className="text-gray-700 mr-3">{userName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;