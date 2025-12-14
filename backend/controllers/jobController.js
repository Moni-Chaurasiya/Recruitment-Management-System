import Job from '../models/Job.js';
import Application from '../models/Application.js';

// Create Job (Admin)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      location,
      locationType,
      jobType,
      experience,
      salary,
      description,
      responsibilities,
      requirements,
      skills,
      benefits,
      deadline
    } = req.body;

    const job = new Job({
      title,
      location,
      locationType,
      jobType,
      experience,
      salary,
      description,
      responsibilities,
      requirements,
      skills,
      benefits,
      deadline,
      postedBy: req.userId
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Active Jobs (Public)
export const getAllJobs = async (req, res) => {
  try {
    const { search, location, jobType, locationType } = req.query;
    
    let query = { isActive: true, deadline: { $gte: new Date() } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (locationType) {
      query.locationType = locationType;
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Single Job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'fullName email');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment views count
    job.viewsCount += 1;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Jobs Posted by Admin
export const getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.userId })
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Job (Admin)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Job (Admin)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.userId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle Job Status (Admin)
export const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.userId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.json({ 
      message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`, 
      job 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Applicants for Specific Job (Admin)
export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      postedBy: req.userId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const applicants = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'fullName email phone location')
      .sort({ createdAt: -1 });

    res.json({
      job: {
        title: job.title,
        location: job.location,
        applicantsCount: job.applicantsCount
      },
      applicants
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Job Statistics (Admin)
export const getJobStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ postedBy: req.userId });
    const activeJobs = await Job.countDocuments({ postedBy: req.userId, isActive: true });
    const totalApplications = await Application.countDocuments({
      jobId: { $in: await Job.find({ postedBy: req.userId }).distinct('_id') }
    });

    res.json({
      totalJobs,
      activeJobs,
      inactiveJobs: totalJobs - activeJobs,
      totalApplications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

