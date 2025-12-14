import Application from '../models/Application.js';
import Job from '../models/Job.js';

// Submit Application (UPDATED - with jobId)
export const submitApplication = async (req, res) => {
  try {
    const { jobId, position, skills, education, experience, coverMessage } = req.body;

    // Check if already applied
    const existingApplication = await Application.findOne({
      userId: req.userId,
      jobId: jobId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Increment applicants count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

    const application = new Application({
      userId: req.userId,
      jobId,
      position,
      skills,
      education,
      experience,
      coverMessage
    });

    await application.save();
    res.status(201).json({ 
      message: 'Application submitted successfully', 
      application 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get User Applications (UPDATED - populate job details)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId })
      .populate('jobId', 'title company location jobType')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Applications (Admin) - UPDATED
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'fullName email phone')
      .populate('jobId', 'title company location')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Rest of the application controller methods remain the same
export const getApplicationStats = async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const completed = await Application.countDocuments({ status: 'Completed' });
    const inProgress = await Application.countDocuments({ status: 'In Progress' });
    
    res.json({ total, completed, inProgress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('userId', 'fullName email phone')
      .populate('jobId', 'title company location');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ 
      message: 'Application status updated successfully', 
      application 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Decrement applicants count
    await Job.findByIdAndUpdate(application.jobId, { $inc: { applicantsCount: -1 } });

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};