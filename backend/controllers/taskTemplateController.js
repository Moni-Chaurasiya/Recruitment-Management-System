import TaskTemplate from '../models/TaskTemplate.js';

// Create Task Template with Questions (Admin)
export const createTaskTemplate = async (req, res) => {
  try {
    const { taskNumber, title, description, instructions, questions } = req.body;

    // Check if task number already exists
    const existingTask = await TaskTemplate.findOne({ taskNumber });
    if (existingTask) {
      return res.status(400).json({ message: 'Task number already exists' });
    }

    // Calculate total points
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

    const taskTemplate = new TaskTemplate({
      taskNumber,
      title,
      description,
      instructions,
      questions,
      totalPoints,
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

// Get All Task Templates (Admin)
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

// Get Task Template by ID
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

// Get Task Template by Task Number
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

// Get All Task Numbers (for dropdown)
export const getAllTaskNumbers = async (req, res) => {
  try {
    const templates = await TaskTemplate.find().select('taskNumber title');
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Task Template (Admin)
export const updateTaskTemplate = async (req, res) => {
  try {
    const updates = req.body;
    
    // Recalculate total points if questions are updated
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

// Delete Task Template (Admin)
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