import TaskTemplate from '../models/TaskTemplate.js';

// Create Task Template with Questions (Admin) - UPDATED
export const createTaskTemplate = async (req, res) => {
  try {
    const { taskNumber, title, description, instructions, questions, timeLimit } = req.body;

    const existingTask = await TaskTemplate.findOne({ taskNumber });
    if (existingTask) {
      return res.status(400).json({ message: 'Task number already exists' });
    }

    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

    const taskTemplate = new TaskTemplate({
      taskNumber,
      title,
      description,
      instructions,
      questions,
      totalPoints,
      timeLimit: timeLimit || 60, // Default 60 minutes
      createdBy: req.userId
    });

    await taskTemplate.save();
    res.status(201).json({ 
      message: 'Task template created successfully', 
      taskTemplate 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Rest remain same
export const getAllTaskTemplates = async (req, res) => {
  try {
    const templates = await TaskTemplate.find()
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTaskTemplateById = async (req, res) => {
  try {
    const template = await TaskTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Task template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTaskTemplateByNumber = async (req, res) => {
  try {
    const template = await TaskTemplate.findOne({ taskNumber: req.params.taskNumber });
    if (!template) {
      return res.status(404).json({ message: 'Task template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllTaskNumbers = async (req, res) => {
  try {
    const templates = await TaskTemplate.find().select('taskNumber title timeLimit');
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateTaskTemplate = async (req, res) => {
  try {
    const updates = req.body;
    
    if (updates.questions) {
      updates.totalPoints = updates.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    }

    const template = await TaskTemplate.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ message: 'Task template not found' });
    }

    res.json({ message: 'Task template updated successfully', template });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteTaskTemplate = async (req, res) => {
  try {
    const template = await TaskTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Task template not found' });
    }
    res.json({ message: 'Task template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};