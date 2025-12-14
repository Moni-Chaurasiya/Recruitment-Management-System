import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';

const BrowseJobs = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    locationType: ''
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (filterParams = {}) => {
    try {
      const params = new URLSearchParams(filterParams);
      const response = await axios.get(`http://localhost:5000/api/jobs/all?${params}`);
      setJobs(response.data);
    } catch (error) {
        console.log(error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchJobs(filters);
  };

  const handleViewMore = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
      setSelectedJob(response.data);
      setShowModal(true);
    } catch (error) {
        console.log(error);
      toast.error('Failed to load job details');
    }
  };

  const handleApply = () => {
    setShowModal(false);
    navigate('/student/apply', { state: { job: selectedJob } });
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'Full-time': 'bg-green-100 text-green-800',
      'Part-time': 'bg-blue-100 text-blue-800',
      'Contract': 'bg-purple-100 text-purple-800',
      'Internship': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getLocationTypeIcon = (type) => {
    const icons = {
      'Remote': '🏠',
      'On-site': '🏢',
      'Hybrid': '🔄'
    };
    return icons[type] || '📍';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="student" userName={user?.fullName} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Your Dream Job</h1>
          <p className="text-xl text-gray-600">Explore opportunities and start your career journey</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <input
                  type="text"
                  placeholder="🔍 Search jobs, skills, companies..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <input
                type="text"
                placeholder="📍 Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Job Type */}
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>

              {/* Location Type */}
              <select
                value={filters.locationType}
                onChange={(e) => setFilters({ ...filters, locationType: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                Search Jobs
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters({ search: '', location: '', jobType: '', locationType: '' });
                  fetchJobs();
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{jobs.length}</span> jobs found
          </p>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-xl text-gray-600">No jobs found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform">
                    {job.title}
                  </h3>
                  <p className="text-blue-100">{job.company}</p>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Location & Type */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
                      {getLocationTypeIcon(job.locationType)}
                      {job.locationType}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.jobType)}`}>
                      {job.jobType}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>

                  {/* Experience */}
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {job.experience}
                  </div>

                  {/* Salary */}
                  {job.salary && job.salary.min && (
                    <div className="flex items-center text-gray-600 font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}/{job.salary.currency}
                    </div>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Deadline */}
                  <div className="text-sm text-gray-500">
                    Apply by: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleViewMore(job._id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                  >
                    View Details & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedJob.title}</h2>
                  <p className="text-blue-100 text-lg">{selectedJob.company}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="font-semibold text-gray-900">{selectedJob.jobType}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{selectedJob.locationType}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Experience</p>
                  <p className="font-semibold text-gray-900">{selectedJob.experience}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Applicants</p>
                  <p className="font-semibold text-gray-900">{selectedJob.applicantsCount}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              {/* Responsibilities */}
              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {selectedJob.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-2">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedJob.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center bg-green-50 p-3 rounded-lg">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Salary */}
              {selectedJob.salary && selectedJob.salary.min && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Salary Range</h3>
                  <p className="text-2xl font-bold text-green-700">
                    ${selectedJob.salary.min.toLocaleString()} - ${selectedJob.salary.max.toLocaleString()}
                    <span className="text-base font-normal text-gray-600"> /{selectedJob.salary.currency} per year</span>
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;