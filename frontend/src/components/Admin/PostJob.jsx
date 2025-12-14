import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';

const PostJob = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    title: '',
    company: 'Our Company',
    location: '',
    locationType: 'On-site',
    jobType: 'Full-time',
    experience: '',
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    description: '',
    responsibilities: [''],
    requirements: [''],
    skills: [''],
    benefits: [''],
    deadline: ''
  });

  const [loading, setLoading] = useState(false);

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Filter out empty array items
      const cleanedData = {
        ...formData,
        responsibilities: formData.responsibilities.filter(item => item.trim() !== ''),
        requirements: formData.requirements.filter(item => item.trim() !== ''),
        skills: formData.skills.filter(item => item.trim() !== ''),
        benefits: formData.benefits.filter(item => item.trim() !== ''),
        salary: {
          min: parseInt(formData.salary.min),
          max: parseInt(formData.salary.max),
          currency: formData.salary.currency
        }
      };

      await axios.post('http://localhost:5000/api/jobs/create', cleanedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Job posted successfully!');
      navigate('/admin/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="admin" userName={user?.fullName} />

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post New Job</h1>
            <p className="text-gray-600">Fill in the details to create a new job posting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., New York, NY or Remote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type *
                  </label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type *
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Required *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2-5 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Salary Range</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salary.min}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salary: { ...formData.salary, min: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salary.max}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salary: { ...formData.salary, max: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="80000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.salary.currency}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salary: { ...formData.salary, currency: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="6"
                placeholder="Describe the role, what the candidate will do, team structure, etc."
              />
            </div>

            {/* Responsibilities */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
              {formData.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={responsibility}
                    onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Design and develop scalable applications"
                  />
                  {formData.responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('responsibilities', index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('responsibilities')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                + Add Responsibility
              </button>
            </div>

            {/* Requirements */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Bachelor's degree in Computer Science"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('requirements', index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('requirements')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                + Add Requirement
              </button>
            </div>

            {/* Skills */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('skills', index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('skills')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                + Add Skill
              </button>
            </div>

            {/* Benefits */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits</h2>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Health insurance, 401k matching"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('benefits', index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('benefits')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                + Add Benefit
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Posting Job...' : 'Post Job'}
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

export default PostJob;