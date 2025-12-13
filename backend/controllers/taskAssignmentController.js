import TaskAssignment from '../models/TaskAssignment.js';
import TaskTemplate from '../models/TaskTemplate.js';
import Application from '../models/Application.js';

// Assign Task to Student (Admin)
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
      deadline
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

// Start Task (Student)
export const startTask = async (req, res) => {
  try {
    const assignment = await TaskAssignment.findByIdAndUpdate(
      req.params.id,
      { status: 'In Progress', startedAt: new Date() },
      { new: true }
    ).populate('taskTemplateId');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Task started', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};