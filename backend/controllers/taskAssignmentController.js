import TaskAssignment from '../models/TaskAssignment.js';
import TaskTemplate from '../models/TaskTemplate.js';
import Application from '../models/Application.js';

// Assign Task to Student (Admin) - UPDATED
export const assignTask = async (req, res) => {
  try {
    const { applicationId, userId, taskNumber, deadline } = req.body;

    const taskTemplate = await TaskTemplate.findOne({ taskNumber });
    if (!taskTemplate) {
      return res.status(404).json({ message: 'Task template not found' });
    }

    const existingAssignment = await TaskAssignment.findOne({
      applicationId,
      taskNumber
    });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Task already assigned to this applicant' });
    }

    const assignment = new TaskAssignment({
      applicationId,
      userId,
      taskNumber,
      taskTemplateId: taskTemplate._id,
      deadline,
      timeLimit: taskTemplate.timeLimit // Get time limit from template
    });

    await assignment.save();
    res.status(201).json({ 
      message: 'Task assigned successfully', 
      assignment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get User's Assigned Tasks
export const getMyAssignedTasks = async (req, res) => {
  try {
    const assignments = await TaskAssignment.find({ userId: req.userId })
      .populate('taskTemplateId')
      .populate('applicationId', 'position')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Assignments (Admin)
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await TaskAssignment.find()
      .populate('userId', 'fullName email')
      .populate('taskTemplateId', 'title taskNumber')
      .populate('applicationId', 'position')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Start Task (Student) - UPDATED with expiry time
export const startTask = async (req, res) => {
  try {
    const assignment = await TaskAssignment.findById(req.params.id)
      .populate('taskTemplateId');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if deadline to start has passed
    const deadlineDate = new Date(assignment.assignedAt.getTime() + assignment.deadline * 60 * 60 * 1000);
    if (new Date() > deadlineDate) {
      assignment.status = 'Expired';
      await assignment.save();
      return res.status(400).json({ message: 'Deadline to start this test has passed' });
    }

    // Set expiry time based on time limit
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + assignment.timeLimit * 60 * 1000);

    assignment.status = 'In Progress';
    assignment.startedAt = startedAt;
    assignment.expiresAt = expiresAt;
    await assignment.save();

    res.json({ 
      message: 'Task started', 
      assignment,
      expiresAt 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if task expired (called from frontend)
export const checkTaskExpiry = async (req, res) => {
  try {
    const assignment = await TaskAssignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.expiresAt && new Date() > assignment.expiresAt) {
      if (assignment.status === 'In Progress') {
        assignment.status = 'Expired';
        await assignment.save();
        return res.json({ expired: true, message: 'Test time has expired' });
      }
    }

    res.json({ expired: false, expiresAt: assignment.expiresAt });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};