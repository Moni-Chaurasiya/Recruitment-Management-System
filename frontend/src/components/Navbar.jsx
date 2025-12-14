import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = ({ role, userName }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        { name: 'Browse Jobs', path: '/student/jobs', icon: '💼' },
        { name: 'My Applications', path: '/student/dashboard', icon: '📋' },
        { name: 'Assessments', path: '/student/assessments', icon: '📝' },
        { name: 'Profile', path: '/student/profile', icon: '👤' }
      ];
    } else {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Post Job', path: '/admin/jobs/create', icon: '➕' },
        { name: 'My Jobs', path: '/admin/jobs', icon: '💼' },
        { name: 'Create Task', path: '/admin/tasks/create-template', icon: '📝' }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate(role === 'admin' ? '/admin/dashboard' : '/student/jobs')}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                RecruitPro
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* User Info */}
            <div className="px-3 py-3 bg-gray-50 rounded-lg mb-2">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>

            {/* Navigation Items */}
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium transition flex items-center gap-3"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-base font-medium transition mt-4"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;